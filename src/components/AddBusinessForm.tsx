"use client";

import { useState } from "react";
import { LocationPicker } from "@/components/LocationPicker";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { SearchOption } from "@/lib/presenters";

type AddBusinessFormProps = {
  locale: Locale;
  cities: SearchOption[];
  categories: SearchOption[];
};

const cityCenters: Record<string, [number, number]> = {
  kabul: [34.526, 69.1777],
  herat: [34.3529, 62.204],
  "mazar-e-sharif": [36.709, 67.1109],
  kandahar: [31.6289, 65.7372]
};

export function AddBusinessForm({ locale, cities, categories }: AddBusinessFormProps) {
  const dictionary = getDictionary(locale);
  const [city, setCity] = useState(cities[0]?.slug ?? "kabul");
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null
  });

  return (
    <form className="directory-form">
      <label>
        <span>{locale === "en" ? "Business name" : locale === "ps" ? "د سوداګرۍ نوم" : "نام کسب‌وکار"}</span>
        <input
          name="name"
          placeholder={
            locale === "en"
              ? "Example: Ahmad Mobile Store"
              : locale === "ps"
                ? "بېلګه: احمد موبایل پلورنځی"
                : "نمونه: موبایل فروشی احمد"
          }
        />
      </label>
      <div className="form-grid">
        <label>
          <span>{dictionary.search.city}</span>
          <select name="city" value={city} onChange={(event) => setCity(event.target.value)}>
            {cities.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{dictionary.search.category}</span>
          <select name="category">
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>{dictionary.common.address}</span>
        <input
          name="address"
          placeholder={locale === "en" ? "Area, street, landmark" : locale === "ps" ? "سیمه، سړک، نښه" : "ناحیه، سرک، نشانۀ نزدیک"}
        />
      </label>
      <LocationPicker
        key={city}
        locale={locale}
        value={location}
        onChange={setLocation}
        latitudeName="latitude"
        longitudeName="longitude"
        defaultCenter={cityCenters[city] ?? cityCenters.kabul}
      />
      <div className="form-grid">
        <label>
          <span>{dictionary.common.phone}</span>
          <input name="phone" placeholder="+93..." />
        </label>
        <label>
          <span>{dictionary.common.whatsapp}</span>
          <input name="whatsapp" placeholder="+93..." />
        </label>
      </div>
      <label>
        <span>{dictionary.common.services}</span>
        <textarea
          name="services"
          placeholder={
            locale === "en"
              ? "Repairs, delivery, booking, quotes..."
              : locale === "ps"
                ? "ترمیم، رسونه، وخت اخیستل، بیه غوښتل..."
                : "ترمیم، ارسال، گرفتن وقت، درخواست قیمت..."
          }
        />
      </label>
      <button type="button">{locale === "en" ? "Submit for review" : locale === "ps" ? "د کتنې لپاره ولېږئ" : "برای بررسی بفرستید"}</button>
    </form>
  );
}
