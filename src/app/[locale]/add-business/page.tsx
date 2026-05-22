import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/PageIntro";
import { categories, cities } from "@/lib/data";
import { getDictionary, isLocale, localizeCategory, localizeCity, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Add Business"
};

type AddBusinessPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AddBusinessPage({ params }: AddBusinessPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);

  return (
    <>
      <PageIntro kicker={dictionary.nav.addBusiness} title={dictionary.pages.addTitle} body={dictionary.pages.addBody} />
      <section className="form-section">
        <form className="directory-form">
          <label>
            <span>{locale === "en" ? "Business name" : locale === "ps" ? "د سوداګرۍ نوم" : "نام کسب‌وکار"}</span>
            <input placeholder={locale === "en" ? "Example: Ahmad Mobile Store" : locale === "ps" ? "بېلګه: احمد موبایل پلورنځی" : "نمونه: موبایل فروشی احمد"} />
          </label>
          <div className="form-grid">
            <label>
              <span>{dictionary.search.city}</span>
              <select>
                {cities.map((city) => (
                  <option key={city.slug}>{localizeCity(city.slug, locale)}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{dictionary.search.category}</span>
              <select>
                {categories.map((category) => (
                  <option key={category.slug}>{localizeCategory(category.slug, locale)}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            <span>{dictionary.common.address}</span>
            <input placeholder={locale === "en" ? "Area, street, landmark" : locale === "ps" ? "سیمه، سړک، نښه" : "ناحیه، سرک، نشانۀ نزدیک"} />
          </label>
          <div className="form-grid">
            <label>
              <span>{dictionary.common.phone}</span>
              <input placeholder="+93..." />
            </label>
            <label>
              <span>{dictionary.common.whatsapp}</span>
              <input placeholder="+93..." />
            </label>
          </div>
          <label>
            <span>{dictionary.common.services}</span>
            <textarea placeholder={locale === "en" ? "Repairs, delivery, booking, quotes..." : locale === "ps" ? "ترمیم، رسونه، وخت اخیستل، بیه غوښتل..." : "ترمیم، ارسال، گرفتن وقت، درخواست قیمت..."} />
          </label>
          <button type="button">{locale === "en" ? "Submit for review" : locale === "ps" ? "د کتنې لپاره ولېږئ" : "برای بررسی بفرستید"}</button>
        </form>
      </section>
    </>
  );
}
