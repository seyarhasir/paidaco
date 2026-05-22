import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, businesses } from "@/lib/data";
import { getDictionary, isLocale, localePath, localizeBlogPost, localizeBusiness, type Locale } from "@/lib/i18n";

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
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();
  const localizedPost = localizeBlogPost(post, locale);

  const related = businesses.filter((business) => business.categoryLabel === post.category).slice(0, 3);

  return (
    <article className="article-page">
      <p className="eyebrow">{dictionary.nav.guides}</p>
      <h1>{localizedPost.title}</h1>
      <p className="article-lede">{localizedPost.excerpt}</p>
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
            const localized = localizeBusiness(business, locale);
            return (
              <Link href={localePath(locale, `/business/${business.city}/${business.slug}`)} key={business.slug}>
                {localized.name} · {localized.area}
              </Link>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}
