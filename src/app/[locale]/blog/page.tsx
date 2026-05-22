import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/PageIntro";
import { blogPosts } from "@/lib/data";
import { getDictionary, isLocale, localePath, localizeBlogPost, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Guides"
};

type BlogPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);

  return (
    <>
      <PageIntro kicker={dictionary.nav.guides} title={dictionary.pages.blogTitle} body={dictionary.pages.blogBody} />
      <section className="content-section">
        <div className="blog-row">
          {blogPosts.map((post) => (
            <Link className="blog-card" href={localePath(locale, `/blog/${post.slug}`)} key={post.slug}>
              <span>{localizeBlogPost(post, locale).category}</span>
              <strong>{localizeBlogPost(post, locale).title}</strong>
              <p>{localizeBlogPost(post, locale).excerpt}</p>
              <small>{localizeBlogPost(post, locale).readTime}</small>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
