import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth/session";
import { getDirection, getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const descriptions = {
    fa: "پیدا کو؛ جستجوی کسب‌وکارها، خدمات، فروشگاه‌ها، قیمت‌ها، نظرها و راهنماهای محلی در افغانستان.",
    ps: "پیدا کو؛ په افغانستان کې د سوداګریو، خدمتونو، پلورنځیو، بیو، نظرونو او ځایي لارښودونو لټون.",
    en: "Paidaco; search businesses, services, shops, prices, reviews, and local guides in Afghanistan."
  };

  return {
    title: {
      default: dictionary.paidaco,
      template: `%s | ${dictionary.paidaco}`
    },
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fa: "/fa",
        ps: "/ps",
        en: "/en"
      }
    },
    openGraph: {
      title: dictionary.paidaco,
      description: descriptions[locale],
      locale: locale === "fa" ? "fa_AF" : locale === "ps" ? "ps_AF" : "en_US",
      type: "website"
    }
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const user = await getCurrentUser("locale layout auth");

  return (
    <div className={`locale-shell locale-${locale}`} lang={locale} dir={getDirection(locale)}>
      <Header locale={locale} userEmail={user?.email ?? null} />
      <main>{children}</main>
    </div>
  );
}
