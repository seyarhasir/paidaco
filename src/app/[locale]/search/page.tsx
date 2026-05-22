import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingGrid } from "@/components/ListingGrid";
import { PageIntro } from "@/components/PageIntro";
import { SearchBar } from "@/components/SearchBar";
import { businesses } from "@/lib/data";
import { getDictionary, isLocale, localizeBusiness, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Paidaco Search"
};

type SearchPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    q?: string;
    city?: string;
    category?: string;
  }>;
};

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const search = (await searchParams) ?? {};
  const query = search.q?.trim().toLowerCase() ?? "";
  const city = search.city ?? "";
  const category = search.category ?? "";

  const results = businesses.filter((business) => {
    const localized = localizeBusiness(business, locale);
    const matchesQuery = query
      ? [business.name, business.dariName, business.pashtoName, localized.area, localized.description]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;
    const matchesCity = city ? business.city === city : true;
    const matchesCategory = category ? business.category === category : true;
    return matchesQuery && matchesCity && matchesCategory;
  });

  return (
    <>
      <PageIntro kicker={dictionary.search.kicker} title={dictionary.search.title} body={dictionary.search.body(results.length)} />
      <section className="content-section">
        <SearchBar locale={locale} query={search.q} city={city} category={category} compact />
        <ListingGrid businesses={results} locale={locale} />
      </section>
    </>
  );
}
