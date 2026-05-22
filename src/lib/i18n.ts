import type { Business } from "@/lib/data";
import { categories, cities } from "@/lib/data";

export const locales = ["fa", "ps", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fa";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDirection(locale: Locale) {
  return locale === "en" ? "ltr" : "rtl";
}

export const dictionaries = {
  fa: {
    paidaco: "پیدا کو",
    brandSub: "",
    nav: {
      search: "جستجو",
      nearMe: "نزدیک من",
      guides: "راهنماها",
      addBusiness: "افزودن کسب‌وکار",
      claim: "درخواست مالکیت"
    },
    home: {
      kicker: "پیدا کو",
      title: "هر چیز را در افغانستان پیدا کو",
      body: "رستورانت، داکتر، مکتب، موبایل فروشی، قیمت‌ها، نظرها و راهنماهای محلی.",
      cityKicker: "جستجو بر اساس شهر",
      cityTitle: "از کابل، هرات، مزار شریف و کندهار شروع کنید",
      categoryKicker: "دسته‌بندی‌های محبوب",
      categoryTitle: "فروشگاه‌ها، خدمات و مکان‌ها را سریع‌تر پیدا کنید",
      featuredKicker: "ویژه در کابل",
      featuredTitle: "مکان‌های تاییدشده برای تماس، سفارش و دریافت قیمت",
      guidesKicker: "راهنماها",
      guidesTitle: "صفحه‌هایی که مردم واقعا جستجو می‌کنند"
    },
    search: {
      title: "کسب‌وکارها، خدمات و مکان‌ها را در افغانستان پیدا کنید",
      body: (count: number) => `${count} نتیجه در فهرست فعلی پیدا کو پیدا شد.`,
      kicker: "جستجو",
      what: "دنبال چه می‌گردید؟",
      placeholder: "رستورانت، داکتر، موبایل فروشی...",
      city: "شهر",
      category: "دسته‌بندی",
      allAfghanistan: "تمام افغانستان",
      allCategories: "همه دسته‌بندی‌ها",
      submit: "پیدا کن"
    },
    common: {
      places: "مکان",
      listings: "مورد",
      reviews: "نظر",
      verified: "تاییدشده",
      featured: "ویژه",
      whatsapp: "واتساپ",
      viewProfile: "نمایش پروفایل",
      call: "تماس",
      claimBusiness: "درخواست مالکیت",
      services: "خدمات",
      overview: "معرفی",
      contact: "تماس",
      address: "آدرس",
      hours: "ساعات کاری",
      phone: "تلفن",
      relatedListings: "فهرست‌های مرتبط"
    },
    pages: {
      nearMeTitle: "مکان‌های نزدیک در شهرهای مهم افغانستان",
      nearMeBody: "در نسخه اول، این صفحه مکان‌های ویژه و تاییدشده را نشان می‌دهد.",
      addTitle: "کسب‌وکار محلی خود را به پیدا کو اضافه کنید",
      addBody: "پروفایل اولیه با دسته‌بندی، شهر، تلفن، واتساپ، ساعات کاری و خدمات بسازید.",
      claimTitle: "پروفایل پیدا کو خود را بگیرید",
      claimBody: "کسب‌وکارهای تاییدشده می‌توانند اطلاعات، عکس‌ها، واتساپ و جایگاه ویژه را مدیریت کنند.",
      blogTitle: "راهنماهای محلی افغانستان",
      blogBody: "صفحه‌های مفید برای مقایسه مکان‌ها، قیمت‌ها، خدمات و محله‌ها."
    }
  },
  ps: {
    paidaco: "پیدا کو",
    brandSub: "",
    nav: {
      search: "لټون",
      nearMe: "ما ته نږدې",
      guides: "لارښودونه",
      addBusiness: "سوداګري اضافه کړئ",
      claim: "مالکیت واخلئ"
    },
    home: {
      kicker: "پیدا کو",
      title: "هر څه په افغانستان کې پیدا کو",
      body: "رستورانتونه، ډاکتران، ښوونځي، موبایل پلورنځي، بیې، نظرونه او ځایي لارښودونه.",
      cityKicker: "د ښار له مخې لټون",
      cityTitle: "له کابل، هرات، مزار شریف او کندهار څخه پیل کړئ",
      categoryKicker: "مشهورې برخې",
      categoryTitle: "پلورنځي، خدمتونه او ځایونه ژر پیدا کړئ",
      featuredKicker: "په کابل کې ځانګړي",
      featuredTitle: "تایید شوي ځایونه د تماس، سفارش او بیې غوښتلو لپاره",
      guidesKicker: "لارښودونه",
      guidesTitle: "هغه پاڼې چې خلک یې رښتیا لټوي"
    },
    search: {
      title: "په افغانستان کې سوداګرۍ، خدمتونه او ځایونه پیدا کړئ",
      body: (count: number) => `${count} پایلې د پیدا کو په اوسني فهرست کې وموندل شوې.`,
      kicker: "لټون",
      what: "څه شی لټوئ؟",
      placeholder: "رستورانت، ډاکتر، موبایل پلورنځی...",
      city: "ښار",
      category: "برخه",
      allAfghanistan: "ټول افغانستان",
      allCategories: "ټولې برخې",
      submit: "پیدا یې کړه"
    },
    common: {
      places: "ځایونه",
      listings: "لیستونه",
      reviews: "نظرونه",
      verified: "تایید شوی",
      featured: "ځانګړی",
      whatsapp: "واتساپ",
      viewProfile: "پروفایل وګورئ",
      call: "زنګ",
      claimBusiness: "مالکیت واخلئ",
      services: "خدمتونه",
      overview: "لنډه پېژندنه",
      contact: "تماس",
      address: "پته",
      hours: "کاري وخت",
      phone: "تلیفون",
      relatedListings: "اړوند لیستونه"
    },
    pages: {
      nearMeTitle: "د افغانستان په مهمو ښارونو کې نږدې ځایونه",
      nearMeBody: "په لومړۍ نسخه کې، دا پاڼه ځانګړي او تایید شوي ځایونه ښيي.",
      addTitle: "خپله ځایي سوداګري پیدا کو ته اضافه کړئ",
      addBody: "لومړنی پروفایل د برخې، ښار، تلیفون، واتساپ، کاري وخت او خدمتونو سره جوړ کړئ.",
      claimTitle: "خپل پیدا کو پروفایل واخلئ",
      claimBody: "تایید شوي کاروبارونه معلومات، عکسونه، واتساپ او ځانګړی ځای مدیریت کولی شي.",
      blogTitle: "د افغانستان ځایي لارښودونه",
      blogBody: "د ځایونو، بیو، خدمتونو او سیمو د پرتله کولو لپاره ګټورې پاڼې."
    }
  },
  en: {
    paidaco: "Paidaco",
    brandSub: "پیدا کو",
    nav: {
      search: "Search",
      nearMe: "Near me",
      guides: "Guides",
      addBusiness: "Add business",
      claim: "Claim"
    },
    home: {
      kicker: "Paidaco",
      title: "Find anything in Afghanistan",
      body: "Restaurants, doctors, schools, mobile shops, prices, reviews, and local guides.",
      cityKicker: "Browse by city",
      cityTitle: "Start with Kabul, Herat, Mazar, and Kandahar",
      categoryKicker: "Popular categories",
      categoryTitle: "Find shops, services, and places faster",
      featuredKicker: "Featured in Kabul",
      featuredTitle: "Verified places ready for calls, orders, and quotes",
      guidesKicker: "Guides",
      guidesTitle: "SEO pages people actually search for"
    },
    search: {
      title: "Find businesses, services, and places in Afghanistan",
      body: (count: number) => `${count} matching listings from the current Paidaco directory.`,
      kicker: "Search",
      what: "What are you looking for?",
      placeholder: "Restaurant, doctor, mobile shop...",
      city: "City",
      category: "Category",
      allAfghanistan: "All Afghanistan",
      allCategories: "All categories",
      submit: "Find it"
    },
    common: {
      places: "places",
      listings: "listings",
      reviews: "reviews",
      verified: "Verified",
      featured: "Featured",
      whatsapp: "WhatsApp",
      viewProfile: "View profile",
      call: "Call",
      claimBusiness: "Claim this business",
      services: "Services",
      overview: "Overview",
      contact: "Contact",
      address: "Address",
      hours: "Hours",
      phone: "Phone",
      relatedListings: "Related listings"
    },
    pages: {
      nearMeTitle: "Local places around major Afghanistan cities",
      nearMeBody: "For the MVP, this page shows high-confidence featured and verified places.",
      addTitle: "Add a local business to Paidaco",
      addBody: "Create a starter profile with category, city, phone, WhatsApp, hours, and services.",
      claimTitle: "Claim your Paidaco profile",
      claimBody: "Verified businesses can update details, add photos, receive WhatsApp leads, and request featured placement.",
      blogTitle: "Local guides for Afghanistan",
      blogBody: "Useful search pages for people comparing places, prices, services, and neighborhoods."
    }
  }
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

const categoryNames: Record<string, Record<Locale, string>> = {
  restaurants: { fa: "رستورانت‌ها", ps: "رستورانتونه", en: "Restaurants" },
  doctors: { fa: "داکتران", ps: "ډاکتران", en: "Doctors" },
  "mobile-shops": { fa: "موبایل فروشی‌ها", ps: "موبایل پلورنځي", en: "Mobile Shops" },
  "beauty-salons": { fa: "آرایشگاه‌ها", ps: "سینګار سالونونه", en: "Beauty Salons" },
  "wedding-halls": { fa: "تالارهای عروسی", ps: "د واده تالارونه", en: "Wedding Halls" },
  courses: { fa: "کورس‌ها", ps: "کورسونه", en: "Courses" }
};

const cityNames: Record<string, Record<Locale, string>> = {
  kabul: { fa: "کابل", ps: "کابل", en: "Kabul" },
  herat: { fa: "هرات", ps: "هرات", en: "Herat" },
  "mazar-e-sharif": { fa: "مزار شریف", ps: "مزار شریف", en: "Mazar-e-Sharif" },
  kandahar: { fa: "کندهار", ps: "کندهار", en: "Kandahar" }
};

const areaNames: Record<string, Record<Locale, string>> = {
  "Kart-e Sakhi": { fa: "کارتۀ سخی", ps: "کارته سخي", en: "Kart-e Sakhi" },
  "Shar-e Naw": { fa: "شهر نو", ps: "شهر نو", en: "Shar-e Naw" },
  "Darwaza Khosh": { fa: "دروازه خوش", ps: "دروازه خوش", en: "Darwaza Khosh" },
  Rawza: { fa: "روضه", ps: "روضه", en: "Rawza" },
  "Dasht-e Barchi": { fa: "دشت برچی", ps: "دشت برچي", en: "Dasht-e Barchi" },
  "Jada-e Mokhaberat": { fa: "جادۀ مخابرات", ps: "د مخابراتو سړک", en: "Jada-e Mokhaberat" }
};

const businessCopy: Record<string, Record<Locale, { description: string; address: string }>> = {
  "bagh-e-babur-cafe": {
    fa: { description: "کافه‌ای آرام در کابل برای صبحانه افغانی، غذاهای کبابی، چای و غذای خانوادگی نزدیک باغ بابر.", address: "نزدیک باغ بابر، کارتۀ سخی، کابل" },
    ps: { description: "په کابل کې ارامه کافه د افغاني ناشتو، کباب، چای او کورنیو خوړو لپاره د بابر باغ ته نږدې.", address: "د بابر باغ ته نږدې، کارته سخي، کابل" },
    en: { description: "A calm Kabul cafe for Afghan breakfast, grilled dishes, tea, and family meals near Bagh-e Babur.", address: "Near Bagh-e Babur, Kart-e Sakhi, Kabul" }
  },
  "shar-e-naw-mobile-center": {
    fa: { description: "فروش موبایل نو و دست دوم، لوازم جانبی، ترمیمات، محافظ صفحه و بررسی قیمت در مرکز کابل.", address: "چهارراهی حاجی یعقوب، شهر نو، کابل" },
    ps: { description: "نوي او کارول شوي موبایلونه، لوازم، ترمیم، سکرین محافظ او د بیو پرتله په مرکز کابل کې.", address: "حاجي یعقوب څلورلارې، شهر نو، کابل" },
    en: { description: "New and used phones, accessories, repairs, screen protectors, and price checks in central Kabul.", address: "Haji Yaqoob Square, Shar-e Naw, Kabul" }
  },
  "arian-dental-clinic": {
    fa: { description: "معاینات دندان، سفیدسازی، مشوره ارتودنسی و وقت اضطراری در هرات.", address: "سرک دروازه خوش، هرات" },
    ps: { description: "د غاښونو معاینه، سپینول، د ارتودنسي مشوره او بیړني وختونه په هرات کې.", address: "د دروازه خوش سړک، هرات" },
    en: { description: "Dental checkups, whitening, braces consultation, and emergency appointments in Herat.", address: "Darwaza Khosh Road, Herat" }
  },
  "blue-mosque-wedding-hall": {
    fa: { description: "تالار عروسی و نامزدی با غذا، دیزاین استیج، بخش‌های خانوادگی و برنامه‌ریزی محفل.", address: "ناحیۀ روضه، مزار شریف" },
    ps: { description: "د واده او کوژدې تالار د خوړو، سټېج ډیزاین، کورنیو برخو او محفل پلان سره.", address: "د روضې سیمه، مزار شریف" },
    en: { description: "Wedding and engagement hall with catering, stage design, family sections, and event planning.", address: "Rawza District, Mazar-e-Sharif" }
  },
  "noor-english-academy": {
    fa: { description: "کورس‌های انگلیسی، آمادگی آیلتس، صنف‌های مکالمه و امتحان تعیین سویه برای شاگردان غرب کابل.", address: "پل خشک، دشت برچی، کابل" },
    ps: { description: "انګلیسي کورسونه، IELTS چمتووالی، د خبرو ټولګي او د سویې ازموینه د لویدیځ کابل زده کوونکو لپاره.", address: "پل خشک، دشت برچي، کابل" },
    en: { description: "English, IELTS preparation, conversation classes, and placement tests for students in west Kabul.", address: "Pul-e Khoshk, Dasht-e Barchi, Kabul" }
  },
  "herat-rose-salon": {
    fa: { description: "آرایشگاه زنانه برای میکاپ عروس، آرایش مو، مراقبت پوست و گرفتن وقت.", address: "جادۀ مخابرات، هرات" },
    ps: { description: "د ښځو سینګار سالون د ناوې میک اپ، وېښتانو جوړولو، پوستکي پاملرنې او وخت اخیستلو لپاره.", address: "د مخابراتو سړک، هرات" },
    en: { description: "Women-focused salon for bridal makeup, hair styling, skincare, and appointment booking.", address: "Jada-e Mokhaberat, Herat" }
  }
};

const serviceNames: Record<string, Record<Locale, string>> = {
  Breakfast: { fa: "صبحانه", ps: "ناشته", en: "Breakfast" },
  "Family seating": { fa: "جای خانوادگی", ps: "کورنۍ ناسته", en: "Family seating" },
  "Outdoor tables": { fa: "میزهای بیرونی", ps: "بهرني مېزونه", en: "Outdoor tables" },
  "WhatsApp orders": { fa: "سفارش واتساپی", ps: "واتساپي سفارشونه", en: "WhatsApp orders" },
  "Phone sales": { fa: "فروش موبایل", ps: "د موبایل خرڅلاو", en: "Phone sales" },
  Repairs: { fa: "ترمیمات", ps: "ترمیم", en: "Repairs" },
  Accessories: { fa: "لوازم جانبی", ps: "لوازم", en: "Accessories" },
  "Price quotes": { fa: "درخواست قیمت", ps: "د بیې غوښتنه", en: "Price quotes" },
  "Dental checkup": { fa: "معاینه دندان", ps: "د غاښونو معاینه", en: "Dental checkup" },
  Whitening: { fa: "سفیدسازی", ps: "سپینول", en: "Whitening" },
  Braces: { fa: "ارتودنسی", ps: "ارتودنسي", en: "Braces" },
  Booking: { fa: "گرفتن وقت", ps: "وخت اخیستل", en: "Booking" },
  "Wedding packages": { fa: "بسته‌های عروسی", ps: "د واده پکېجونه", en: "Wedding packages" },
  Catering: { fa: "غذا و پذیرایی", ps: "خواړه او مېلمستیا", en: "Catering" },
  "Stage design": { fa: "دیزاین استیج", ps: "د سټېج ډیزاین", en: "Stage design" },
  "Quote requests": { fa: "درخواست قیمت", ps: "د بیې غوښتنه", en: "Quote requests" },
  "English courses": { fa: "کورس‌های انگلیسی", ps: "انګلیسي کورسونه", en: "English courses" },
  "IELTS prep": { fa: "آمادگی آیلتس", ps: "IELTS چمتووالی", en: "IELTS prep" },
  "Placement test": { fa: "امتحان سویه", ps: "د سویې ازموینه", en: "Placement test" },
  "Monthly plans": { fa: "برنامه‌های ماهانه", ps: "میاشتني پلانونه", en: "Monthly plans" },
  "Bridal makeup": { fa: "میکاپ عروس", ps: "د ناوې میک اپ", en: "Bridal makeup" },
  "Hair styling": { fa: "آرایش مو", ps: "د وېښتانو جوړول", en: "Hair styling" },
  Skincare: { fa: "مراقبت پوست", ps: "د پوستکي پاملرنه", en: "Skincare" },
  "Book now": { fa: "همین حالا وقت بگیرید", ps: "اوس وخت واخلئ", en: "Book now" }
};

const blogCopy: Record<string, Record<Locale, { title: string; excerpt: string; category: string; readTime: string }>> = {
  "best-restaurants-in-kabul": {
    fa: { title: "بهترین رستورانت‌های کابل", excerpt: "راهنمای کاربردی برای رستورانت‌های خانوادگی، کافه‌ها، کبابی‌ها و غذاهای مدرن در کابل.", category: "رستورانت‌ها", readTime: "۶ دقیقه" },
    ps: { title: "په کابل کې غوره رستورانتونه", excerpt: "د کورنیو رستورانتونو، کافه‌ګانو، کباب ځایونو او عصري خوړو لپاره عملي لارښود.", category: "رستورانتونه", readTime: "۶ دقیقې" },
    en: { title: "Best restaurants in Kabul", excerpt: "A practical guide to family restaurants, cafes, kebab spots, and modern dining in Kabul.", category: "Restaurants", readTime: "6 min" }
  },
  "mobile-shops-in-shar-e-naw": {
    fa: { title: "موبایل فروشی‌های شهر نو", excerpt: "کجا قیمت موبایل، لوازم جانبی و گزینه‌های ترمیم را در مرکز کابل مقایسه کنیم.", category: "موبایل فروشی‌ها", readTime: "۵ دقیقه" },
    ps: { title: "د شهر نو موبایل پلورنځي", excerpt: "په مرکز کابل کې د موبایل بیې، لوازم او ترمیم ځایونه چیرته پرتله کړو.", category: "موبایل پلورنځي", readTime: "۵ دقیقې" },
    en: { title: "Mobile shops in Shar-e Naw", excerpt: "Where to compare phone prices, accessories, and repair options in central Kabul.", category: "Mobile Shops", readTime: "5 min" }
  },
  "english-courses-in-kabul": {
    fa: { title: "کورس‌های انگلیسی در کابل", excerpt: "چگونه کورس‌های انگلیسی را بر اساس ناحیه، سویه، فیس ماهانه و نظر شاگردان مقایسه کنیم.", category: "کورس‌ها", readTime: "۴ دقیقه" },
    ps: { title: "په کابل کې انګلیسي کورسونه", excerpt: "انګلیسي اکاډمۍ د سیمې، سویې، میاشتني فیس او د زده کوونکو نظرونو له مخې پرتله کړئ.", category: "کورسونه", readTime: "۴ دقیقې" },
    en: { title: "English courses in Kabul", excerpt: "How to compare English academies by area, level, monthly fee, and student reviews.", category: "Courses", readTime: "4 min" }
  }
};

export function localePath(locale: Locale, path = "") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function localizeCategory(slug: string, locale: Locale) {
  return categoryNames[slug]?.[locale] ?? categories.find((category) => category.slug === slug)?.label ?? slug;
}

export function localizeCity(slug: string, locale: Locale) {
  return cityNames[slug]?.[locale] ?? cities.find((city) => city.slug === slug)?.name ?? slug;
}

export function localizeArea(area: string, locale: Locale) {
  return areaNames[area]?.[locale] ?? area;
}

export function localizeBusiness(business: Business, locale: Locale) {
  return {
    name: locale === "fa" ? business.dariName : locale === "ps" ? business.pashtoName : business.name,
    category: localizeCategory(business.category, locale),
    area: localizeArea(business.area, locale),
    address: businessCopy[business.slug]?.[locale]?.address ?? business.address,
    description: businessCopy[business.slug]?.[locale]?.description ?? business.description
  };
}

export function localizeService(service: string, locale: Locale) {
  return serviceNames[service]?.[locale] ?? service;
}

export function localizeBlogPost(
  post: { slug: string; title: string; excerpt: string; category: string; readTime: string },
  locale: Locale
) {
  return blogCopy[post.slug]?.[locale] ?? post;
}
