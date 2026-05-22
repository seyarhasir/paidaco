import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localePath, type Locale } from "@/lib/i18n";
import { toBusinessCardData } from "@/lib/presenters";
import { prisma } from "@/lib/prisma";

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const metadata: Metadata = {
  title: "Paidaco Guide"
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } }
    }
  });
  if (!post) notFound();
  const translation = post.translations[0];

  const normalizedCategory = post.category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const relatedBusinesses = await prisma.business.findMany({
    where: normalizedCategory
      ? {
          category: {
            slug: normalizedCategory
          }
        }
      : {},
    take: 3,
    include: {
      city: true,
      area: true,
      translations: { where: { locale } },
      category: { include: { translations: { where: { locale } } } },
      photos: { orderBy: { sortOrder: "asc" }, take: 1 },
      reviews: { select: { rating: true } }
    }
  });
  const related = relatedBusinesses.map((business) => toBusinessCardData(business, locale));

  return (
    <article className="article-page">
      <p className="eyebrow">{dictionary.nav.guides}</p>
      <h1>{translation?.title ?? post.slug}</h1>
      <p className="article-lede">{translation?.excerpt ?? ""}</p>
      <div className="article-body">
        <p>
          {locale === "en"
            ? "Paidaco guide pages combine local listings, contact details, areas, reviews, prices, and direct actions."
            : locale === "ps"
              ? "د پیدا کو لارښود پاڼې ځایي لیستونه، تماس، سیمې، نظرونه، بیې او مستقیم عملونه یو ځای کوي."
              : "راهنماهای پیدا کو فهرست‌های محلی، تماس، ناحیه، نظرها، قیمت‌ها و اقدام مستقیم را یک‌جا می‌کند."}
        </p>
      </div>
      {related.length ? (
        <div className="related-links">
          <h2>{dictionary.common.relatedListings}</h2>
          {related.map((business) => {
            return (
              <Link href={localePath(locale, `/business/${business.citySlug}/${business.slug}`)} key={business.slug}>
                {business.name} · {business.area}
              </Link>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}
