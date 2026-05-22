import Image from "next/image";
import Link from "next/link";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { businesses, getBusiness } from "@/lib/data";
import {
  getDictionary,
  isLocale,
  localePath,
  localizeBusiness,
  localizeService,
  type Locale
} from "@/lib/i18n";

type BusinessPageProps = {
  params: Promise<{
    locale: string;
    city: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return businesses.flatMap((business) =>
    (["fa", "ps", "en"] as const).map((locale) => ({
      locale,
      city: business.city,
      slug: business.slug
    }))
  );
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { locale: rawLocale, city, slug } = await params;
  if (!isLocale(rawLocale)) return {};

  const business = getBusiness(city, slug);
  if (!business) return {};

  const locale = rawLocale as Locale;
  const localized = localizeBusiness(business, locale);

  return {
    title: `${localized.name} - ${localized.area}`,
    description: `${localized.description} ${localized.address}. ${business.phone}.`,
    alternates: {
      canonical: localePath(locale, `/business/${business.city}/${business.slug}`),
      languages: {
        fa: localePath("fa", `/business/${business.city}/${business.slug}`),
        ps: localePath("ps", `/business/${business.city}/${business.slug}`),
        en: localePath("en", `/business/${business.city}/${business.slug}`)
      }
    },
    openGraph: {
      title: localized.name,
      description: localized.description,
      images: [business.image],
      type: "website"
    }
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { locale: rawLocale, city, slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const business = getBusiness(city, slug);
  if (!business) notFound();

  const dictionary = getDictionary(locale);
  const localized = localizeBusiness(business, locale);
  const reviewSummary =
    locale === "en"
      ? `Based on ${business.reviewCount} local reviews.`
      : locale === "ps"
        ? `د ${business.reviewCount} ځایي نظرونو پر بنسټ.`
        : `بر اساس ${business.reviewCount} نظر محلی.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: localized.name,
    alternateName: [business.dariName, business.pashtoName, business.name],
    image: business.image,
    address: {
      "@type": "PostalAddress",
      streetAddress: localized.address,
      addressLocality: business.city,
      addressCountry: "AF"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.coordinates.lat,
      longitude: business.coordinates.lng
    },
    telephone: business.phone,
    priceRange: business.priceRange,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviewCount
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
          <Image src={business.image} alt="" fill priority sizes="100vw" />
        </div>
        <div className="business-hero-content">
          <p className="eyebrow">{localized.category} · {localized.area}</p>
          <h1 className="name-with-badge hero-title-with-badge">
            {localized.name}
            {business.verified ? (
              <span className="verified-asset" title={dictionary.common.verified}>
                <VerifiedBadge label={dictionary.common.verified} size={38} />
              </span>
            ) : null}
          </h1>
          <div className="meta-row">
            <span>{business.rating.toFixed(1)} ★</span>
            <span>{business.reviewCount} {dictionary.common.reviews}</span>
            <span>{business.priceRange}</span>
          </div>
          <div className="actions-row prominent">
            <a href={`tel:${business.phone}`}>{dictionary.common.call}</a>
            <a href={`https://wa.me/${business.whatsapp.replace("+", "")}`}>{dictionary.common.whatsapp}</a>
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
              {business.services.map((service) => (
                <span key={service}>{localizeService(service, locale)}</span>
              ))}
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
              <dd>{localized.address}</dd>
            </div>
            <div>
              <dt>{dictionary.common.hours}</dt>
              <dd>{business.hours}</dd>
            </div>
            <div>
              <dt>{dictionary.common.phone}</dt>
              <dd>{business.phone}</dd>
            </div>
          </dl>
          <div className="map-panel">
            <span>{business.coordinates.lat.toFixed(4)}, {business.coordinates.lng.toFixed(4)}</span>
          </div>
        </aside>
      </section>
    </>
  );
}
