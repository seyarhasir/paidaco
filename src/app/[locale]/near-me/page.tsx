import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingGrid } from "@/components/ListingGrid";
import { PageIntro } from "@/components/PageIntro";
import { businesses } from "@/lib/data";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Near Me"
};

type NearMePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NearMePage({ params }: NearMePageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);

  return (
    <>
      <PageIntro kicker={dictionary.nav.nearMe} title={dictionary.pages.nearMeTitle} body={dictionary.pages.nearMeBody} />
      <section className="content-section">
        <ListingGrid businesses={businesses.filter((business) => business.verified || business.featured)} locale={locale} />
      </section>
    </>
  );
}
