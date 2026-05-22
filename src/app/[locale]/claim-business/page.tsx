import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/PageIntro";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Claim Business"
};

type ClaimBusinessPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ClaimBusinessPage({ params }: ClaimBusinessPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);

  return (
    <>
      <PageIntro kicker={dictionary.nav.claim} title={dictionary.pages.claimTitle} body={dictionary.pages.claimBody} />
      <section className="form-section split-panel">
        <form className="directory-form">
          <label>
            <span>{locale === "en" ? "Business profile URL" : locale === "ps" ? "د سوداګرۍ د پروفایل پته" : "لینک پروفایل کسب‌وکار"}</span>
            <input placeholder="paidaco.com/fa/business/kabul/..." />
          </label>
          <label>
            <span>{locale === "en" ? "Owner name" : locale === "ps" ? "د مالک نوم" : "نام مالک"}</span>
            <input />
          </label>
          <label>
            <span>{locale === "en" ? "Verification phone" : locale === "ps" ? "د تایید تلیفون" : "تلفن تایید"}</span>
            <input placeholder="+93..." />
          </label>
          <label>
            <span>{locale === "en" ? "Message" : locale === "ps" ? "پیغام" : "پیام"}</span>
            <textarea />
          </label>
          <button type="button">{locale === "en" ? "Request verification" : locale === "ps" ? "د تایید غوښتنه وکړئ" : "درخواست تایید بفرستید"}</button>
        </form>
        <div className="pricing-panel">
          <p className="eyebrow">{locale === "en" ? "Premium" : locale === "ps" ? "پریمیم" : "ویژه"}</p>
          <h2>$5-$20/month</h2>
          <p>{locale === "en" ? "Badge, photos, WhatsApp button, better ranking, services, prices, and richer profile content." : locale === "ps" ? "نښه، عکسونه، واتساپ، ښه رتبه، خدمتونه، بیې او بشپړ پروفایل." : "نشان تایید، عکس‌ها، واتساپ، جایگاه بهتر، خدمات، قیمت‌ها و پروفایل کامل‌تر."}</p>
        </div>
      </section>
    </>
  );
}
