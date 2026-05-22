import type { Locale } from "@/lib/i18n";
import type { ListingBusiness } from "@/components/BusinessCard";

export type SearchOption = {
  slug: string;
  label: string;
};

type Translation = {
  locale: Locale;
  name: string;
  description?: string | null;
};

type BusinessForCard = {
  id: string;
  slug: string;
  featured: boolean;
  verified: boolean;
  priceRange: string | null;
  whatsapp: string | null;
  city: { slug: string; name: string; localName: string };
  area: { name: string; localName: string | null } | null;
  category: { slug: string; translations: Translation[] };
  translations: Translation[];
  photos: { url: string }[];
  reviews: { rating: number }[];
};

export function getLocalizedName(locale: Locale, name: string, localName?: string | null) {
  if (locale === "en") return name;
  return localName?.trim() ? localName : name;
}

export function getTranslation(
  translations: Translation[],
  locale: Locale,
  fallback: { name: string; description?: string | null }
) {
  const match = translations.find((item) => item.locale === locale);
  return {
    name: match?.name ?? fallback.name,
    description: match?.description ?? fallback.description ?? ""
  };
}

export function toCityOption(city: { slug: string; name: string; localName: string }, locale: Locale): SearchOption {
  return {
    slug: city.slug,
    label: getLocalizedName(locale, city.name, city.localName)
  };
}

export function toCategoryOption(
  category: { slug: string; translations: Translation[] },
  locale: Locale
): SearchOption {
  const localized = getTranslation(category.translations, locale, { name: category.slug, description: null });
  return {
    slug: category.slug,
    label: localized.name
  };
}

export function toBusinessCardData(business: BusinessForCard, locale: Locale): ListingBusiness {
  const localizedBusiness = getTranslation(business.translations, locale, {
    name: business.slug,
    description: ""
  });
  const localizedCategory = getTranslation(business.category.translations, locale, {
    name: business.category.slug,
    description: null
  });
  const areaName = business.area
    ? getLocalizedName(locale, business.area.name, business.area.localName)
    : locale === "en"
      ? "City center"
      : "مرکز شهر";

  const reviewCount = business.reviews.length;
  const rating = reviewCount
    ? business.reviews.reduce((total, review) => total + review.rating, 0) / reviewCount
    : 0;

  return {
    id: business.id,
    slug: business.slug,
    citySlug: business.city.slug,
    name: localizedBusiness.name,
    category: localizedCategory.name,
    area: areaName,
    description: localizedBusiness.description ?? "",
    imageUrl: business.photos[0]?.url ?? null,
    featured: business.featured,
    verified: business.verified,
    rating,
    reviewCount,
    priceRange: business.priceRange ?? null,
    whatsapp: business.whatsapp ?? null
  };
}
