import Image from "next/image";
import Link from "next/link";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

export type ListingBusiness = {
  id: string;
  slug: string;
  citySlug: string;
  name: string;
  category: string;
  area: string;
  description: string;
  imageUrl: string | null;
  featured: boolean;
  verified: boolean;
  rating: number;
  reviewCount: number;
  priceRange: string | null;
  whatsapp: string | null;
};

type BusinessCardProps = {
  business: ListingBusiness;
  locale: Locale;
};

export function BusinessCard({ business, locale }: BusinessCardProps) {
  const dictionary = getDictionary(locale);
  const imageUrl = business.imageUrl ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

  return (
    <article className={business.featured ? "business-card featured" : "business-card"}>
      <Link className="business-photo" href={localePath(locale, `/business/${business.citySlug}/${business.slug}`)}>
        <Image src={imageUrl} alt="" fill sizes="(max-width: 760px) 100vw, 320px" />
        {business.featured ? <span>{dictionary.common.featured}</span> : null}
      </Link>
      <div className="business-body">
        <div>
          <p className="eyebrow">{business.category} · {business.area}</p>
          <h3 className="name-with-badge">
            <Link href={localePath(locale, `/business/${business.citySlug}/${business.slug}`)}>{business.name}</Link>
            {business.verified ? (
              <span className="verified-asset" title={dictionary.common.verified}>
                <VerifiedBadge label={dictionary.common.verified} size={24} />
              </span>
            ) : null}
          </h3>
        </div>
        <p className="business-description">{business.description}</p>
        <div className="meta-row">
          <span>{business.rating.toFixed(1)} ★</span>
          <span>{business.reviewCount} {dictionary.common.reviews}</span>
          {business.priceRange ? <span>{business.priceRange}</span> : null}
        </div>
        <div className="actions-row">
          {business.whatsapp ? (
            <a href={`https://wa.me/${business.whatsapp.replace("+", "")}`}>{dictionary.common.whatsapp}</a>
          ) : null}
          <Link href={localePath(locale, `/business/${business.citySlug}/${business.slug}`)}>{dictionary.common.viewProfile}</Link>
        </div>
      </div>
    </article>
  );
}
