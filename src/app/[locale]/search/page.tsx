import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingGrid } from "@/components/ListingGrid";
import { PageIntro } from "@/components/PageIntro";
import { SearchBar } from "@/components/SearchBar";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { loadSearchOptions } from "@/lib/loaders";
import { toBusinessCardData } from "@/lib/presenters";
import { prisma } from "@/lib/prisma";

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

  const { cityOptions, categoryOptions } = await loadSearchOptions(locale);

  const results = await prisma.business.findMany({
    where: {
      ...(city ? { city: { slug: city } } : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(query
        ? {
            OR: [
              { slug: { contains: query, mode: "insensitive" } },
              { address: { contains: query, mode: "insensitive" } },
              {
                translations: {
                  some: {
                    locale,
                    OR: [
                      { name: { contains: query, mode: "insensitive" } },
                      { description: { contains: query, mode: "insensitive" } }
                    ]
                  }
                }
              }
            ]
          }
        : {})
    },
    include: {
      city: true,
      area: true,
      translations: { where: { locale } },
      category: { include: { translations: { where: { locale } } } },
      photos: { orderBy: { sortOrder: "asc" }, take: 1 },
      reviews: { select: { rating: true } }
    }
  });

  const listings = results.map((business) => toBusinessCardData(business, locale));

  return (
    <>
      <PageIntro kicker={dictionary.search.kicker} title={dictionary.search.title} body={dictionary.search.body(listings.length)} />
      <section className="content-section">
        <SearchBar
          locale={locale}
          query={search.q}
          city={city}
          category={category}
          cities={cityOptions}
          categories={categoryOptions}
          compact
        />
        <ListingGrid businesses={listings} locale={locale} />
      </section>
    </>
  );
}
