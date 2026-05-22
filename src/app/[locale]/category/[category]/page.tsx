import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingGrid } from "@/components/ListingGrid";
import { PageIntro } from "@/components/PageIntro";
import { SearchBar } from "@/components/SearchBar";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { loadSearchOptions } from "@/lib/loaders";
import { getTranslation, toBusinessCardData } from "@/lib/presenters";
import { prisma } from "@/lib/prisma";

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
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: { translations: { where: { locale } } }
  });
  if (!category) notFound();

  const dictionary = getDictionary(locale);
  const categoryName = getTranslation(category.translations, locale, { name: category.slug }).name;
  const { cityOptions, categoryOptions } = await loadSearchOptions(locale);
  const results = await prisma.business.findMany({
    where: { category: { slug: category.slug } },
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
      <PageIntro kicker={categoryName} title={categoryName} body={dictionary.search.body(listings.length)} />
      <section className="content-section">
        <SearchBar
          locale={locale}
          category={category.slug}
          cities={cityOptions}
          categories={categoryOptions}
          compact
        />
        <ListingGrid businesses={listings} locale={locale} />
      </section>
    </>
  );
}
