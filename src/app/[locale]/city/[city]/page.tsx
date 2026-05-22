import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingGrid } from "@/components/ListingGrid";
import { PageIntro } from "@/components/PageIntro";
import { SearchBar } from "@/components/SearchBar";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { loadSearchOptions } from "@/lib/loaders";
import { getLocalizedName, toBusinessCardData } from "@/lib/presenters";
import { prisma } from "@/lib/prisma";

type CityPageProps = {
  params: Promise<{ locale: string; city: string }>;
};

export const metadata: Metadata = {
  title: "Paidaco City"
};

export default async function CityPage({ params }: CityPageProps) {
  const { locale: rawLocale, city: citySlug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const city = await prisma.city.findUnique({ where: { slug: citySlug } });
  if (!city) notFound();

  const dictionary = getDictionary(locale);
  const cityName = getLocalizedName(locale, city.name, city.localName);
  const { cityOptions, categoryOptions } = await loadSearchOptions(locale);
  const results = await prisma.business.findMany({
    where: { city: { slug: city.slug } },
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
      <PageIntro
        kicker={cityName}
        title={locale === "en" ? `Find places in ${cityName}` : locale === "ps" ? `په ${cityName} کې ځایونه پیدا کړئ` : `در ${cityName} مکان‌ها را پیدا کنید`}
        body={dictionary.search.body(listings.length)}
      />
      <section className="content-section">
        <SearchBar
          locale={locale}
          city={city.slug}
          cities={cityOptions}
          categories={categoryOptions}
          compact
        />
        <ListingGrid businesses={listings} locale={locale} />
      </section>
    </>
  );
}
