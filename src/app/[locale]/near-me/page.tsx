import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingGrid } from "@/components/ListingGrid";
import { PageIntro } from "@/components/PageIntro";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { toBusinessCardData } from "@/lib/presenters";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Near Me"
};

type NearMePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NearMePage({ params }: NearMePageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const results = await prisma.business.findMany({
    where: {
      OR: [{ verified: true }, { featured: true }]
    },
    include: {
      city: true,
      area: true,
      translations: { where: { locale } },
      category: { include: { translations: { where: { locale } } } },
      photos: { orderBy: { sortOrder: "asc" }, take: 1 },
      reviews: { select: { rating: true } }
    }
  });
  const listings = results.map((business) => toBusinessCardData(business, locale));

  return (
    <>
      <PageIntro kicker={dictionary.nav.nearMe} title={dictionary.pages.nearMeTitle} body={dictionary.pages.nearMeBody} />
      <section className="content-section">
        <ListingGrid businesses={listings} locale={locale} />
      </section>
    </>
  );
}
