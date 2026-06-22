import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddBusinessForm } from "@/components/AddBusinessForm";
import { PageIntro } from "@/components/PageIntro";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { loadSearchOptions } from "@/lib/loaders";

export const metadata: Metadata = {
  title: "Add Business"
};

type AddBusinessPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AddBusinessPage({ params }: AddBusinessPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const { cityOptions, categoryOptions } = await loadSearchOptions(locale);

  return (
    <>
      <PageIntro kicker={dictionary.nav.addBusiness} title={dictionary.pages.addTitle} body={dictionary.pages.addBody} />
      <section className="form-section">
        <AddBusinessForm locale={locale} cities={cityOptions} categories={categoryOptions} />
      </section>
    </>
  );
}
