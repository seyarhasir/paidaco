import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingGrid } from "@/components/ListingGrid";
import { PageIntro } from "@/components/PageIntro";
import { SearchBar } from "@/components/SearchBar";
import { businesses, getCategory } from "@/lib/data";
import { getDictionary, isLocale, localizeCategory, type Locale } from "@/lib/i18n";

type CategoryPageProps = {
  params: Promise<{ locale: string; category: string }>;
};

export const metadata: Metadata = {
  title: "Paidaco Category"
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale: rawLocale, category: categorySlug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const dictionary = getDictionary(locale);
  const categoryName = localizeCategory(category.slug, locale);
  const categoryBusinesses = businesses.filter((business) => business.category === category.slug);

  return (
    <>
      <PageIntro kicker={categoryName} title={categoryName} body={dictionary.search.body(categoryBusinesses.length)} />
      <section className="content-section">
        <SearchBar locale={locale} category={category.slug} compact />
        <ListingGrid businesses={categoryBusinesses} locale={locale} />
      </section>
    </>
  );
}
