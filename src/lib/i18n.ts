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

export function localePath(locale: Locale, path = "") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}
