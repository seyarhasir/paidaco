import Image from "next/image";
import Link from "next/link";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getDictionary,
  isLocale,
  localePath,
  type Locale
} from "@/lib/i18n";
import { getLocalizedName, getTranslation } from "@/lib/presenters";
import { prisma } from "@/lib/prisma";

type BusinessPageProps = {
  params: Promise<{
    locale: string;
    city: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { locale: rawLocale, city, slug } = await params;
  if (!isLocale(rawLocale)) return {};

  const business = await prisma.business.findFirst({
    where: {
      slug,
      city: { slug: city }
    },
    include: {
      city: true,
      translations: { where: { locale: rawLocale as Locale } },
      photos: { orderBy: { sortOrder: "asc" }, take: 1 }
    }
  });
  if (!business) return {};

  const locale = rawLocale as Locale;
  const localized = getTranslation(business.translations, locale, {
    name: business.slug,
    description: ""
  });
  const imageUrl = business.photos[0]?.url ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";
  const cityName = getLocalizedName(locale, business.city.name, business.city.localName);

  return {
    title: `${localized.name} - ${cityName}`,
    description: `${localized.description} ${business.address}. ${business.phone ?? ""}`.trim(),
    alternates: {
      canonical: localePath(locale, `/business/${business.city.slug}/${business.slug}`),
      languages: {
        fa: localePath("fa", `/business/${business.city.slug}/${business.slug}`),
        ps: localePath("ps", `/business/${business.city.slug}/${business.slug}`),
        en: localePath("en", `/business/${business.city.slug}/${business.slug}`)
      }
    },
    openGraph: {
      title: localized.name,
      description: localized.description,
      images: [imageUrl],
      type: "website"
    }
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { locale: rawLocale, city, slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const business = await prisma.business.findFirst({
    where: {
      slug,
      city: { slug: city }
    },
    include: {
      city: true,
      area: true,
      translations: { where: { locale } },
      category: { include: { translations: { where: { locale } } } },
      photos: { orderBy: { sortOrder: "asc" }, take: 1 },
      services: { where: { locale } },
      reviews: { where: { approved: true }, select: { rating: true } }
    }
  });
  if (!business) notFound();

  const dictionary = getDictionary(locale);
  const localized = getTranslation(business.translations, locale, {
    name: business.slug,
    description: ""
  });
  const categoryName = getTranslation(business.category.translations, locale, {
    name: business.category.slug,
    description: null
  }).name;
  const areaName = business.area
    ? getLocalizedName(locale, business.area.name, business.area.localName)
    : locale === "en"
      ? "City center"
      : "مرکز شهر";
  const imageUrl = business.photos[0]?.url ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";
  const reviewCount = business.reviews.length;
  const rating = reviewCount
    ? business.reviews.reduce((total, review) => total + review.rating, 0) / reviewCount
    : 0;
  const reviewSummary =
    locale === "en"
      ? `Based on ${reviewCount} local reviews.`
      : locale === "ps"
        ? `د ${reviewCount} ځایي نظرونو پر بنسټ.`
        : `بر اساس ${reviewCount} نظر محلی.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: localized.name,
    alternateName: localized.name,
    image: imageUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city.slug,
      addressCountry: "AF"
    },
    telephone: business.phone ?? undefined,
    priceRange: business.priceRange ?? undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
      <section className="business-hero">
        <div className="business-hero-image">
          <Image src={imageUrl} alt="" fill priority sizes="100vw" />
        </div>
        <div className="business-hero-content">
          <p className="eyebrow">{categoryName} · {areaName}</p>
          <h1 className="name-with-badge hero-title-with-badge">
            {localized.name}
            {business.verified ? (
              <span className="verified-asset" title={dictionary.common.verified}>
                <VerifiedBadge label={dictionary.common.verified} size={38} />
              </span>
            ) : null}
          </h1>
          <div className="meta-row">
            <span>{rating.toFixed(1)} ★</span>
            <span>{reviewCount} {dictionary.common.reviews}</span>
            {business.priceRange ? <span>{business.priceRange}</span> : null}
          </div>
          <div className="actions-row prominent">
            {business.phone ? <a href={`tel:${business.phone}`}>{dictionary.common.call}</a> : null}
            {business.whatsapp ? (
              <a href={`https://wa.me/${business.whatsapp.replace("+", "")}`}>{dictionary.common.whatsapp}</a>
            ) : null}
            <Link href={localePath(locale, "/claim-business")}>{dictionary.common.claimBusiness}</Link>
          </div>
        </div>
      </section>

      <section className="profile-layout">
        <div className="profile-main">
          <section>
            <h2>{dictionary.common.overview}</h2>
            <p>{localized.description}</p>
          </section>
          <section>
            <h2>{dictionary.common.services}</h2>
            <div className="service-list">
              {business.services.length ? (
                business.services.map((service) => <span key={service.id}>{service.name}</span>)
              ) : (
                <span>{dictionary.common.services}</span>
              )}
            </div>
          </section>
          <section>
            <h2>{dictionary.common.reviews}</h2>
            <div className="review-card">
              <strong>{business.rating.toFixed(1)} ★</strong>
              <p>{reviewSummary}</p>
            </div>
          </section>
        </div>
        <aside className="profile-aside">
          <h2>{dictionary.common.contact}</h2>
          <dl>
            <div>
              <dt>{dictionary.common.address}</dt>
              <dd>{business.address}</dd>
            </div>
            <div>
              <dt>{dictionary.common.hours}</dt>
              <dd>{locale === "en" ? "Hours coming soon" : locale === "ps" ? "د ساعتونو معلومات ژر راځي" : "ساعات به‌زودی"}</dd>
            </div>
            <div>
              <dt>{dictionary.common.phone}</dt>
              <dd>{business.phone ?? "-"}</dd>
            </div>
          </dl>
          <div className="map-panel">
            <span>
              {business.latitude ? Number(business.latitude).toFixed(4) : "0.0000"}, {business.longitude ? Number(business.longitude).toFixed(4) : "0.0000"}
            </span>
          </div>
        </aside>
      </section>
    </>
  );
}
