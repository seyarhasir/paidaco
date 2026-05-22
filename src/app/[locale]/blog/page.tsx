import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/PageIntro";
import { getDictionary, isLocale, localePath, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

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
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      translations: { where: { locale } }
    }
  });

  return (
    <>
      <PageIntro kicker={dictionary.nav.guides} title={dictionary.pages.blogTitle} body={dictionary.pages.blogBody} />
      <section className="content-section">
        <div className="blog-row">
          {posts.map((post) => {
            const translation = post.translations[0];
            return (
              <Link className="blog-card" href={localePath(locale, `/blog/${post.slug}`)} key={post.slug}>
                <span>{post.category}</span>
                <strong>{translation?.title ?? post.slug}</strong>
                <p>{translation?.excerpt ?? ""}</p>
                <small>{post.readTime}</small>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
