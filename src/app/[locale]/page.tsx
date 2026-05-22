import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Bed,
  Building2,
  Car,
  GraduationCap,
  Heart,
  HeartPulse,
  MapPin,
  Scissors,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Utensils,
  Wrench
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import {
  getDictionary,
  isLocale,
  localePath,
  type Locale
} from "@/lib/i18n";
import { loadSearchOptions } from "@/lib/loaders";
import { getLocalizedName, getTranslation, toBusinessCardData } from "@/lib/presenters";
import { prisma } from "@/lib/prisma";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

const categoryIcons: Record<string, typeof Utensils> = {
  restaurants: Utensils,
  hotels: Bed,
  doctors: HeartPulse,
  "mobile-shops": ShoppingBag,
  "beauty-salons": Scissors,
  "real-estate": Building2,
  universities: GraduationCap,
  "wedding-halls": Heart
};

const cityImages: Record<string, string> = {
  kabul: "https://images.unsplash.com/photo-1570213489059-0aac6626cade?auto=format&fit=crop&w=900&q=80",
  herat: "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?auto=format&fit=crop&w=900&q=80",
  "mazar-e-sharif": "https://images.unsplash.com/photo-1605649461784-f1743b58f8db?auto=format&fit=crop&w=900&q=80",
  kandahar: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=80",
  jalalabad: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
};

const homeCopy = {
  fa: {
    headline: "هر چیز را در افغانستان پیدا کن",
    subtitle: "کسب‌وکارها، خدمات، فروشگاه‌ها و مکان‌های مورد نیاز خود را سریع پیدا کنید",
    popular: "محبوب‌ترین‌های این هفته",
    categories: "دسته‌بندی‌ها",
    cities: "شهرها",
    featured: "کسب‌وکارهای ویژه",
    guides: "راهنماها و مقایسه‌ها",
    claimTitle: "آیا صاحب کسب‌وکار هستید؟",
    claimBody: "در پیدا کو دیده شوید، مشتری بگیرید، نظر دریافت کنید و راه تماس مستقیم خود را اضافه کنید.",
    claimButton: "کسب‌وکار خود را ثبت کنید",
    learnMore: "بیشتر بدانید",
    appTitle: "اپلیکیشن پیدا کو",
    appBody: "جستجو، نقشه، علاقه‌مندی‌ها و نظرها به‌زودی در موبایل.",
    comingSoon: "به‌زودی",
    statsTitle: "اعتماد محلی، رشد سریع",
    blog: "کشف‌های تازه",
    footerBody: "پیدا کو موتور جستجوی محلی افغانستان برای کسب‌وکارها، خدمات، فروشگاه‌ها، قیمت‌ها و راهنماها است.",
    newsletter: "خبرنامه",
    emailPlaceholder: "ایمیل خود را وارد کنید",
    subscribe: "اشتراک",
    open: "باز",
    closed: "بسته",
    viewAll: "مشاهده همه",
    popularCategories: "دسته‌های محبوب"
  },
  ps: {
    headline: "هر څه په افغانستان کې پیدا کړه",
    subtitle: "سوداګرۍ، خدمتونه، پلورنځي او اړین ځایونه ژر پیدا کړئ",
    popular: "د دې اونۍ مشهور ځایونه",
    categories: "برخې",
    cities: "ښارونه",
    featured: "ځانګړي کاروبارونه",
    guides: "لارښودونه او پرتله کول",
    claimTitle: "ایا د کاروبار مالک یاست؟",
    claimBody: "په پیدا کو کې ښکاره شئ، مشتریان ترلاسه کړئ، نظرونه واخلئ او مستقیم تماس اضافه کړئ.",
    claimButton: "خپل کاروبار ثبت کړئ",
    learnMore: "نور معلومات",
    appTitle: "د پیدا کو اپلیکیشن",
    appBody: "لټون، نقشه، خوښې او نظرونه ډېر ژر په موبایل کې.",
    comingSoon: "ژر راځي",
    statsTitle: "ځايي باور، چټک رشد",
    blog: "نوي کشفونه",
    footerBody: "پیدا کو د افغانستان ځایي لټون ماشین دی د سوداګریو، خدمتونو، پلورنځیو، بیو او لارښودونو لپاره.",
    newsletter: "خبرپاڼه",
    emailPlaceholder: "خپل ایمیل ولیکئ",
    subscribe: "ګډون",
    open: "پرانیستی",
    closed: "تړلی",
    viewAll: "ټول وګورئ",
    popularCategories: "مشهورې برخې"
  },
  en: {
    headline: "Find anything in Afghanistan",
    subtitle: "Quickly find the businesses, services, shops, and places you need.",
    popular: "Popular this week",
    categories: "Categories",
    cities: "Cities",
    featured: "Featured businesses",
    guides: "Guides and comparisons",
    claimTitle: "Own a business?",
    claimBody: "Get discovered on Paidaco, receive customers, collect reviews, and add direct contact options.",
    claimButton: "Claim your business",
    learnMore: "Learn more",
    appTitle: "Paidaco mobile app",
    appBody: "Search, maps, favorites, and reviews are coming soon to mobile.",
    comingSoon: "Coming soon",
    statsTitle: "Local trust, fast growth",
    blog: "Local discoveries",
    footerBody: "Paidaco is Afghanistan's local search engine for businesses, services, shops, prices, and guides.",
    newsletter: "Newsletter",
    emailPlaceholder: "Enter your email",
    subscribe: "Subscribe",
    open: "Open",
    closed: "Closed",
    viewAll: "View all",
    popularCategories: "Popular categories"
  }
} as const;


const guideTitles = {
  fa: [
    "بهترین شرکت‌های انترنتی در افغانستان",
    "بهترین تالارهای عروسی در کابل",
    "ارزان‌ترین هوتل‌های کابل",
    "بهترین کافه‌ها برای کار و مطالعه"
  ],
  ps: [
    "په افغانستان کې غوره انټرنېټ شرکتونه",
    "په کابل کې غوره د واده تالارونه",
    "په کابل کې ارزانه هوټلونه",
    "د کار او مطالعې لپاره غوره کافې"
  ],
  en: [
    "Best Internet Providers in Afghanistan",
    "Top Wedding Halls in Kabul",
    "Cheapest Hotels in Kabul",
    "Best Cafes for Work"
  ]
} as const;

export default async function LocaleHome({ params }: HomeProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const copy = homeCopy[locale];
  const { cities: cityRecords, categories: categoryRecords, cityOptions, categoryOptions } = await loadSearchOptions(locale);

  const [cityCounts, categoryCounts, popularRaw, featuredRaw, blogRaw] = await Promise.all([
    prisma.business.groupBy({
      by: ["cityId"],
      _count: { _all: true }
    }),
    prisma.business.groupBy({
      by: ["categoryId"],
      _count: { _all: true }
    }),
    prisma.business.findMany({
      orderBy: {
        reviews: {
          _count: "desc"
        }
      },
      take: 5,
      include: {
        city: true,
        area: true,
        translations: { where: { locale } },
        category: { include: { translations: { where: { locale } } } },
        photos: { orderBy: { sortOrder: "asc" }, take: 1 },
        reviews: { select: { rating: true } }
      }
    }),
    prisma.business.findMany({
      where: { featured: true },
      take: 4,
      include: {
        city: true,
        area: true,
        translations: { where: { locale } },
        category: { include: { translations: { where: { locale } } } },
        photos: { orderBy: { sortOrder: "asc" }, take: 1 },
        reviews: { select: { rating: true } }
      }
    }),
    prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { translations: { where: { locale } } }
    })
  ]);

  const cityCountMap = new Map(cityCounts.map((item) => [item.cityId, item._count._all]));
  const categoryCountMap = new Map(categoryCounts.map((item) => [item.categoryId, item._count._all]));

  const cityCards = cityRecords.map((city) => ({
    slug: city.slug,
    name: getLocalizedName(locale, city.name, city.localName),
    count: cityCountMap.get(city.id) ?? 0
  }));

  const categoryCards = categoryRecords.map((category) => {
    const localized = getTranslation(category.translations, locale, { name: category.slug, description: null });
    return {
      slug: category.slug,
      label: localized.name,
      count: categoryCountMap.get(category.id) ?? 0,
      Icon: categoryIcons[category.slug] ?? Store
    };
  });

  const popular = popularRaw.map((business) => toBusinessCardData(business, locale));
  const featured = featuredRaw.map((business) => toBusinessCardData(business, locale));
  const stats = [
    { value: "10,000+", label: locale === "en" ? "listed businesses" : locale === "ps" ? "ثبت شوي کاروبارونه" : "کسب‌وکار ثبت‌شده" },
    { value: "25+", label: locale === "en" ? "covered cities" : locale === "ps" ? "ښارونه تر پوښښ لاندې" : "شهر تحت پوشش" },
    { value: "50,000+", label: locale === "en" ? "monthly searches" : locale === "ps" ? "میاشتني لټونونه" : "جستجوی ماهانه" },
    { value: "4.8/5", label: locale === "en" ? "average rating" : locale === "ps" ? "منځنۍ درجه" : "میانگین امتیاز" }
  ];

  return (
    <>
      <section className="modern-hero">
        <div className="hero-backdrop" />
        <div className="modern-hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">{dictionary.paidaco}</p>
            <h1>{copy.headline}</h1>
            <p>{copy.subtitle}</p>
          </div>
          <div className="hero-search-block">
            <SearchBar
              locale={locale}
              city="kabul"
              showCategory={false}
              cities={cityOptions}
              categories={categoryOptions}
            />
            <div className="quick-chips" aria-label={copy.popularCategories}>
              {categoryCards.map((category) => (
                <Link href={localePath(locale, `/category/${category.slug}`)} key={category.slug}>
                  <span><category.Icon size={18} strokeWidth={2.1} /></span>
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <SectionHeading title={copy.popular} action={copy.viewAll} href={localePath(locale, "/search")} />
        <div className="popular-strip">
          {popular.map((business) => {
            const imageUrl = business.imageUrl ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";
            return (
              <Link className="discovery-card" href={localePath(locale, `/business/${business.citySlug}/${business.slug}`)} key={business.slug}>
                <img src={imageUrl} alt="" />
                <span className="save-dot"><Heart size={16} /></span>
                <span className="rating-pill"><Star size={15} fill="currentColor" /> {business.rating.toFixed(1)}</span>
                <div>
                  <strong>{business.name}</strong>
                  <small>{business.category} · {business.area}</small>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-section" id="categories">
        <SectionHeading title={copy.categories} action={copy.viewAll} href={localePath(locale, "/search")} />
        <div className="icon-category-grid">
          {categoryCards.map((category) => (
            <Link className="icon-category-card" href={localePath(locale, `/category/${category.slug}`)} key={category.slug}>
              <span><category.Icon size={26} strokeWidth={2} /></span>
              <strong>{category.label}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section" id="cities">
        <SectionHeading title={copy.cities} action={copy.viewAll} href={localePath(locale, "/search")} />
        <div className="city-showcase">
          {cityCards.map((city) => (
            <Link
              className="city-photo-card"
              href={localePath(locale, `/city/${city.slug}`)}
              key={city.slug}
              style={{ backgroundImage: `url(${cityImages[city.slug] ?? cityImages.kabul})` }}
            >
              <strong>{city.name}</strong>
              <small>{city.count.toLocaleString("en-US")} {dictionary.common.listings}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <SectionHeading title={copy.featured} action={copy.viewAll} href={localePath(locale, "/search")} />
        <div className="featured-business-grid">
          {featured.map((business) => {
            const imageUrl = business.imageUrl ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";
            return (
              <Link className="premium-card" href={localePath(locale, `/business/${business.citySlug}/${business.slug}`)} key={business.slug}>
                <img src={imageUrl} alt="" />
                <div className="premium-card-body">
                  <h3 className="name-with-badge">
                    {business.name}
                    <span className="verified-asset" title={dictionary.common.verified}>
                      <VerifiedBadge label={dictionary.common.verified} size={26} />
                    </span>
                  </h3>
                  <p>{business.category} · {business.area}</p>
                  <div className="premium-actions">
                    <span><Star size={15} fill="currentColor" /> {business.rating.toFixed(1)}</span>
                    <span>{copy.open}</span>
                    <span>{dictionary.common.whatsapp}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <SectionHeading title={copy.guides} action={copy.viewAll} href={localePath(locale, "/blog")} />
        <div className="guide-grid">
          {guideTitles[locale].map((title, index) => (
            <Link className="guide-card" href={localePath(locale, "/blog")} key={title}>
              <span>{index === 0 ? <Search size={18} /> : index === 1 ? <Store size={18} /> : index === 2 ? <MapPin size={18} /> : <Wrench size={18} />}</span>
              <strong>{title}</strong>
              <small>{locale === "en" ? "Updated guide" : locale === "ps" ? "تازه لارښود" : "راهنمای تازه"}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="claim-band">
          <div>
            <p className="eyebrow">{dictionary.nav.claim}</p>
            <h2>{copy.claimTitle}</h2>
            <p>{copy.claimBody}</p>
            <div className="claim-benefits">
              <span><Sparkles size={16} /> {locale === "en" ? "Get discovered" : locale === "ps" ? "پیدا شئ" : "دیده شوید"}</span>
              <span><Store size={16} /> {locale === "en" ? "Receive customers" : locale === "ps" ? "مشتریان واخلئ" : "مشتری بگیرید"}</span>
              <span><MapPin size={16} /> {locale === "en" ? "Add WhatsApp" : locale === "ps" ? "واتساپ اضافه کړئ" : "واتساپ اضافه کنید"}</span>
            </div>
            <div className="actions-row prominent">
              <Link href={localePath(locale, "/claim-business")}>{copy.claimButton}</Link>
              <Link href={localePath(locale, "/add-business")}>{copy.learnMore}</Link>
            </div>
          </div>
          <div className="store-illustration">
            <Image src="/shop.png" alt="" width={640} height={427} sizes="(max-width: 760px) 100vw, 440px" />
          </div>
        </div>
      </section>

      <section className="home-section stats-section">
        <h2>{copy.statsTitle}</h2>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section app-preview-section">
        <div>
          <p className="eyebrow">{copy.comingSoon}</p>
          <h2>{copy.appTitle}</h2>
          <p>{copy.appBody}</p>
        </div>
        <div className="phone-preview">
          <div />
          <span>{copy.comingSoon}</span>
        </div>
      </section>

      <section className="home-section">
        <SectionHeading title={copy.blog} action={copy.viewAll} href={localePath(locale, "/blog")} />
        <div className="blog-row">
          {blogRaw.map((post) => {
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

      <footer className="site-footer">
        <div className="footer-brand">
          <Link className="brand" href={localePath(locale)}>
            <span className="brand-mark">پ</span>
            <span>
              <strong>{dictionary.paidaco}</strong>
            </span>
          </Link>
          <p>{copy.footerBody}</p>
        </div>
        <FooterColumn title={copy.categories} items={categoryCards.slice(0, 5).map((category) => category.label)} />
        <FooterColumn title={copy.cities} items={cityCards.slice(0, 5).map((city) => city.name)} />
        <FooterColumn title={locale === "en" ? "Links" : locale === "ps" ? "لینکونه" : "لینک‌ها"} items={[dictionary.nav.addBusiness, dictionary.nav.guides, dictionary.nav.claim, locale === "en" ? "Privacy" : locale === "ps" ? "محرمیت" : "حریم خصوصی"]} />
        <div className="newsletter-card">
          <h3>{copy.newsletter}</h3>
          <input placeholder={copy.emailPlaceholder} />
          <button>{copy.subscribe}</button>
        </div>
      </footer>
    </>
  );
}

function SectionHeading({ title, action, href }: { title: string; action: string; href: string }) {
  return (
    <div className="modern-section-heading">
      <h2>{title}</h2>
      <Link href={href}>{action}</Link>
    </div>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}
