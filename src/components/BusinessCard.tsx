import Image from "next/image";
import Link from "next/link";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Business } from "@/lib/data";
import { getDictionary, localePath, localizeBusiness, type Locale } from "@/lib/i18n";

type BusinessCardProps = {
  business: Business;
  locale: Locale;
};

export function BusinessCard({ business, locale }: BusinessCardProps) {
  const dictionary = getDictionary(locale);
  const localized = localizeBusiness(business, locale);

  return (
    <article className={business.featured ? "business-card featured" : "business-card"}>
      <Link className="business-photo" href={localePath(locale, `/business/${business.city}/${business.slug}`)}>
        <Image src={business.image} alt="" fill sizes="(max-width: 760px) 100vw, 320px" />
        {business.featured ? <span>{dictionary.common.featured}</span> : null}
      </Link>
      <div className="business-body">
        <div>
          <p className="eyebrow">{localized.category} · {localized.area}</p>
          <h3 className="name-with-badge">
            <Link href={localePath(locale, `/business/${business.city}/${business.slug}`)}>{localized.name}</Link>
            {business.verified ? (
              <span className="verified-asset" title={dictionary.common.verified}>
                <VerifiedBadge label={dictionary.common.verified} size={24} />
              </span>
            ) : null}
          </h3>
        </div>
        <p className="business-description">{localized.description}</p>
        <div className="meta-row">
          <span>{business.rating.toFixed(1)} ★</span>
          <span>{business.reviewCount} {dictionary.common.reviews}</span>
          <span>{business.priceRange}</span>
        </div>
        <div className="actions-row">
          <a href={`https://wa.me/${business.whatsapp.replace("+", "")}`}>{dictionary.common.whatsapp}</a>
          <Link href={localePath(locale, `/business/${business.city}/${business.slug}`)}>{dictionary.common.viewProfile}</Link>
        </div>
      </div>
    </article>
  );
}
