import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });

const prisma = new PrismaClient();

const cities = [
  { slug: "kabul", name: "Kabul", localName: "کابل" },
  { slug: "herat", name: "Herat", localName: "هرات" },
  { slug: "mazar-e-sharif", name: "Mazar-e-Sharif", localName: "مزار شریف" },
  { slug: "kandahar", name: "Kandahar", localName: "کندهار" }
];

const categories = [
  { slug: "restaurants", labelEn: "Restaurants", labelFa: "رستورانت‌ها", labelPs: "رستورانتونه" },
  { slug: "doctors", labelEn: "Doctors", labelFa: "داکتران", labelPs: "ډاکتران" },
  { slug: "mobile-shops", labelEn: "Mobile Shops", labelFa: "موبایل فروشی", labelPs: "موبایل پلورنځي" },
  { slug: "beauty-salons", labelEn: "Beauty Salons", labelFa: "آرایشگاه‌ها", labelPs: "سینګار سالونونه" },
  { slug: "wedding-halls", labelEn: "Wedding Halls", labelFa: "تالارها", labelPs: "د واده تالارونه" },
  { slug: "courses", labelEn: "Courses", labelFa: "کورس‌ها", labelPs: "کورسونه" }
];

const businesses = [
  {
    slug: "bagh-e-babur-cafe",
    name: "Bagh-e Babur Cafe",
    dariName: "کافه باغ بابر",
    pashtoName: "د بابر باغ کافه",
    category: "restaurants",
    city: "kabul",
    area: "Kart-e Sakhi",
    address: "Near Bagh-e Babur, Kart-e Sakhi, Kabul",
    phone: "+93 79 123 4567",
    whatsapp: "+93791234567",
    priceRange: "$$",
    verified: true,
    featured: true,
    description: "A calm Kabul cafe for Afghan breakfast, grilled dishes, tea, and family meals near Bagh-e Babur.",
    services: ["Breakfast", "Family seating", "Outdoor tables", "WhatsApp orders"],
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    latitude: 34.5031,
    longitude: 69.1568,
    reviews: [5, 4, 5]
  },
  {
    slug: "shar-e-naw-mobile-center",
    name: "Shar-e Naw Mobile Center",
    dariName: "مرکز موبایل شهر نو",
    pashtoName: "د شهر نو موبایل مرکز",
    category: "mobile-shops",
    city: "kabul",
    area: "Shar-e Naw",
    address: "Haji Yaqoob Square, Shar-e Naw, Kabul",
    phone: "+93 78 222 9000",
    whatsapp: "+93782229000",
    priceRange: "$$",
    verified: true,
    featured: true,
    description: "New and used phones, accessories, repairs, screen protectors, and price checks in central Kabul.",
    services: ["Phone sales", "Repairs", "Accessories", "Price quotes"],
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
    latitude: 34.5328,
    longitude: 69.1666,
    reviews: [4, 5, 4]
  },
  {
    slug: "arian-dental-clinic",
    name: "Arian Dental Clinic",
    dariName: "کلینیک دندان آرین",
    pashtoName: "آرین د غاښونو کلینیک",
    category: "doctors",
    city: "herat",
    area: "Darwaza Khosh",
    address: "Darwaza Khosh Road, Herat",
    phone: "+93 79 555 1100",
    whatsapp: "+93795551100",
    priceRange: "$$$",
    verified: true,
    featured: false,
    description: "Dental checkups, whitening, braces consultation, and emergency appointments in Herat.",
    services: ["Dental checkup", "Whitening", "Braces", "Booking"],
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80",
    latitude: 34.3529,
    longitude: 62.204,
    reviews: [5, 5, 4]
  },
  {
    slug: "blue-mosque-wedding-hall",
    name: "Blue Mosque Wedding Hall",
    dariName: "تالار عروسی روضه شریف",
    pashtoName: "د روضې شریف واده تالار",
    category: "wedding-halls",
    city: "mazar-e-sharif",
    area: "Rawza",
    address: "Rawza District, Mazar-e-Sharif",
    phone: "+93 70 455 8800",
    whatsapp: "+93704558800",
    priceRange: "$$$",
    verified: true,
    featured: false,
    description: "Wedding and engagement hall with catering, stage design, family sections, and event planning.",
    services: ["Wedding packages", "Catering", "Stage design", "Quote requests"],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    latitude: 36.709,
    longitude: 67.1109,
    reviews: [5, 4, 4]
  },
  {
    slug: "noor-english-academy",
    name: "Noor English Academy",
    dariName: "آکادمی انگلیسی نور",
    pashtoName: "نور انګلیسي اکاډمي",
    category: "courses",
    city: "kabul",
    area: "Dasht-e Barchi",
    address: "Pul-e Khoshk, Dasht-e Barchi, Kabul",
    phone: "+93 78 333 2200",
    whatsapp: "+93783332200",
    priceRange: "$",
    verified: false,
    featured: false,
    description: "English, IELTS preparation, conversation classes, and placement tests for students in west Kabul.",
    services: ["English courses", "IELTS prep", "Placement test", "Monthly plans"],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
    latitude: 34.4993,
    longitude: 69.0704,
    reviews: [4, 4, 5]
  },
  {
    slug: "herat-rose-salon",
    name: "Herat Rose Salon",
    dariName: "سالن رز هرات",
    pashtoName: "د هرات ګلاب سالون",
    category: "beauty-salons",
    city: "herat",
    area: "Jada-e Mokhaberat",
    address: "Jada-e Mokhaberat, Herat",
    phone: "+93 79 201 3300",
    whatsapp: "+93792013300",
    priceRange: "$$",
    verified: true,
    featured: true,
    description: "Women-focused salon for bridal makeup, hair styling, skincare, and appointment booking.",
    services: ["Bridal makeup", "Hair styling", "Skincare", "Book now"],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
    latitude: 34.3482,
    longitude: 62.1997,
    reviews: [5, 5, 4]
  }
];

const blogPosts = [
  {
    slug: "best-restaurants-in-kabul",
    category: "Restaurants",
    readTime: "6 min",
    translations: {
      fa: {
        title: "بهترین رستورانت‌های کابل",
        excerpt: "راهنمای کاربردی برای رستورانت‌های خانوادگی، کافه‌ها، کبابی‌ها و غذاهای مدرن در کابل."
      },
      ps: {
        title: "په کابل کې غوره رستورانتونه",
        excerpt: "د کورنیو رستورانتونو، کافه‌ګانو، کباب ځایونو او عصري خوړو لپاره عملي لارښود."
      },
      en: {
        title: "Best restaurants in Kabul",
        excerpt: "A practical guide to family restaurants, cafes, kebab spots, and modern dining in Kabul."
      }
    }
  },
  {
    slug: "mobile-shops-in-shar-e-naw",
    category: "Mobile Shops",
    readTime: "5 min",
    translations: {
      fa: {
        title: "موبایل فروشی‌های شهر نو",
        excerpt: "کجا قیمت موبایل، لوازم جانبی و گزینه‌های ترمیم را در مرکز کابل مقایسه کنیم."
      },
      ps: {
        title: "د شهر نو موبایل پلورنځي",
        excerpt: "په مرکز کابل کې د موبایل بیې، لوازم او ترمیم ځایونه چیرته پرتله کړو."
      },
      en: {
        title: "Mobile shops in Shar-e Naw",
        excerpt: "Where to compare phone prices, accessories, and repair options in central Kabul."
      }
    }
  },
  {
    slug: "english-courses-in-kabul",
    category: "Courses",
    readTime: "4 min",
    translations: {
      fa: {
        title: "کورس‌های انگلیسی در کابل",
        excerpt: "چگونه کورس‌های انگلیسی را بر اساس ناحیه، سویه، فیس ماهانه و نظر شاگردان مقایسه کنیم."
      },
      ps: {
        title: "په کابل کې انګلیسي کورسونه",
        excerpt: "انګلیسي اکاډمۍ د سیمې، سویې، میاشتني فیس او د زده کوونکو نظرونو له مخې پرتله کړئ."
      },
      en: {
        title: "English courses in Kabul",
        excerpt: "How to compare English academies by area, level, monthly fee, and student reviews."
      }
    }
  }
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function seed() {
  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city
    });
  }

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { slug: category.slug },
      create: { slug: category.slug }
    });

    const translations = [
      { locale: "en", name: category.labelEn, description: null },
      { locale: "fa", name: category.labelFa, description: null },
      { locale: "ps", name: category.labelPs, description: null }
    ];

    for (const translation of translations) {
      await prisma.categoryTranslation.upsert({
        where: {
          categoryId_locale: {
            categoryId: record.id,
            locale: translation.locale
          }
        },
        update: translation,
        create: {
          categoryId: record.id,
          ...translation
        }
      });
    }
  }

  for (const entry of businesses) {
    const city = await prisma.city.findUnique({ where: { slug: entry.city } });
    const category = await prisma.category.findUnique({ where: { slug: entry.category } });
    if (!city || !category) continue;

    const areaSlug = slugify(entry.area);
    const area = await prisma.area.upsert({
      where: {
        cityId_slug: {
          cityId: city.id,
          slug: areaSlug
        }
      },
      update: {
        name: entry.area,
        localName: entry.area
      },
      create: {
        cityId: city.id,
        slug: areaSlug,
        name: entry.area,
        localName: entry.area
      }
    });

    const business = await prisma.business.upsert({
      where: {
        cityId_slug: {
          cityId: city.id,
          slug: entry.slug
        }
      },
      update: {
        status: entry.featured ? "published" : "pending",
        phone: entry.phone,
        whatsapp: entry.whatsapp,
        address: entry.address,
        latitude: entry.latitude,
        longitude: entry.longitude,
        priceRange: entry.priceRange,
        verified: entry.verified,
        featured: entry.featured,
        cityId: city.id,
        areaId: area.id,
        categoryId: category.id,
        publishedAt: entry.featured ? new Date() : null
      },
      create: {
        slug: entry.slug,
        status: entry.featured ? "published" : "pending",
        phone: entry.phone,
        whatsapp: entry.whatsapp,
        address: entry.address,
        latitude: entry.latitude,
        longitude: entry.longitude,
        priceRange: entry.priceRange,
        verified: entry.verified,
        featured: entry.featured,
        cityId: city.id,
        areaId: area.id,
        categoryId: category.id,
        publishedAt: entry.featured ? new Date() : null
      }
    });

    const translations = [
      { locale: "en", name: entry.name, description: entry.description },
      { locale: "fa", name: entry.dariName, description: entry.description },
      { locale: "ps", name: entry.pashtoName, description: entry.description }
    ];

    for (const translation of translations) {
      await prisma.businessTranslation.upsert({
        where: {
          businessId_locale: {
            businessId: business.id,
            locale: translation.locale
          }
        },
        update: translation,
        create: {
          businessId: business.id,
          ...translation
        }
      });
    }

    await prisma.businessPhoto.upsert({
      where: {
        businessId_sortOrder: {
          businessId: business.id,
          sortOrder: 0
        }
      },
      update: {
        url: entry.image,
        alt: entry.name
      },
      create: {
        businessId: business.id,
        url: entry.image,
        alt: entry.name,
        sortOrder: 0
      }
    });

    for (const [index, service] of entry.services.entries()) {
      await prisma.businessService.upsert({
        where: {
          businessId_locale_sortOrder: {
            businessId: business.id,
            locale: "en",
            sortOrder: index
          }
        },
        update: { name: service },
        create: {
          businessId: business.id,
          locale: "en",
          name: service,
          sortOrder: index
        }
      });
    }

    await prisma.review.deleteMany({ where: { businessId: business.id } });
    for (const rating of entry.reviews) {
      await prisma.review.create({
        data: {
          businessId: business.id,
          rating,
          comment: "",
          approved: true
        }
      });
    }
  }

  for (const post of blogPosts) {
    const record = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        category: post.category,
        readTime: post.readTime
      },
      create: {
        slug: post.slug,
        category: post.category,
        readTime: post.readTime
      }
    });

    for (const locale of ["fa", "ps", "en"]) {
      const translation = post.translations[locale];
      await prisma.blogPostTranslation.upsert({
        where: {
          postId_locale: {
            postId: record.id,
            locale
          }
        },
        update: {
          title: translation.title,
          excerpt: translation.excerpt
        },
        create: {
          postId: record.id,
          locale,
          title: translation.title,
          excerpt: translation.excerpt
        }
      });
    }
  }
}

try {
  await seed();
  console.log("Seeded demo data.");
} finally {
  await prisma.$disconnect();
}
