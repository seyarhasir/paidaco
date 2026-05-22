import { BusinessCard, type ListingBusiness } from "@/components/BusinessCard";
import { type Locale } from "@/lib/i18n";

export function ListingGrid({ businesses, locale }: { businesses: ListingBusiness[]; locale: Locale }) {
  if (!businesses.length) {
    return (
      <div className="empty-state">
        <h2>No listings found yet</h2>
        <p>Try another city, category, or search term. Paidaco can add this area next.</p>
      </div>
    );
  }

  return (
    <div className="listing-grid">
      {businesses.map((business) => (
        <BusinessCard business={business} locale={locale} key={`${business.citySlug}-${business.slug}`} />
      ))}
    </div>
  );
}
