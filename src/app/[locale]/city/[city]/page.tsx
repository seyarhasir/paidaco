import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingGrid } from "@/components/ListingGrid";
import { PageIntro } from "@/components/PageIntro";
import { SearchBar } from "@/components/SearchBar";
import { businesses, getCity } from "@/lib/data";
import { getDictionary, isLocale, localizeCity, type Locale } from "@/lib/i18n";

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
  const city = getCity(citySlug);
  if (!city) notFound();

  const dictionary = getDictionary(locale);
  const cityName = localizeCity(city.slug, locale);
  const cityBusinesses = businesses.filter((business) => business.city === city.slug);

  return (
    <>
      <PageIntro
        kicker={cityName}
        title={locale === "en" ? `Find places in ${cityName}` : locale === "ps" ? `په ${cityName} کې ځایونه پیدا کړئ` : `در ${cityName} مکان‌ها را پیدا کنید`}
        body={dictionary.search.body(cityBusinesses.length)}
      />
      <section className="content-section">
        <SearchBar locale={locale} city={city.slug} compact />
        <ListingGrid businesses={cityBusinesses} locale={locale} />
      </section>
    </>
  );
}
