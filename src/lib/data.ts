export type Language = "fa" | "ps" | "en";

export type Business = {
  slug: string;
  name: string;
  dariName: string;
  pashtoName: string;
  category: string;
  categoryLabel: string;
  city: string;
  area: string;
  address: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  hours: string;
  priceRange: string;
  verified: boolean;
  featured: boolean;
  description: string;
  services: string[];
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export const cities = [
  { slug: "kabul", name: "Kabul", localName: "کابل", count: 842 },
  { slug: "herat", name: "Herat", localName: "هرات", count: 214 },
  { slug: "mazar-e-sharif", name: "Mazar-e-Sharif", localName: "مزار شریف", count: 188 },
  { slug: "kandahar", name: "Kandahar", localName: "کندهار", count: 127 }
];

export const categories = [
  { slug: "restaurants", label: "Restaurants", localLabel: "رستورانت‌ها", count: 182 },
  { slug: "doctors", label: "Doctors", localLabel: "داکتران", count: 96 },
  { slug: "mobile-shops", label: "Mobile Shops", localLabel: "موبایل فروشی", count: 143 },
  { slug: "beauty-salons", label: "Beauty Salons", localLabel: "آرایشگاه‌ها", count: 74 },
  { slug: "wedding-halls", label: "Wedding Halls", localLabel: "تالارها", count: 61 },
  { slug: "courses", label: "Courses", localLabel: "کورس‌ها", count: 89 }
];

export const businesses: Business[] = [
  {
    slug: "bagh-e-babur-cafe",
    name: "Bagh-e Babur Cafe",
    dariName: "کافه باغ بابر",
    pashtoName: "د بابر باغ کافه",
    category: "restaurants",
    categoryLabel: "Restaurants",
    city: "kabul",
    area: "Kart-e Sakhi",
    address: "Near Bagh-e Babur, Kart-e Sakhi, Kabul",
    phone: "+93 79 123 4567",
    whatsapp: "+93791234567",
    rating: 4.7,
    reviewCount: 128,
    hours: "8:00 AM - 10:00 PM",
    priceRange: "$$",
    verified: true,
    featured: true,
    description: "A calm Kabul cafe for Afghan breakfast, grilled dishes, tea, and family meals near Bagh-e Babur.",
    services: ["Breakfast", "Family seating", "Outdoor tables", "WhatsApp orders"],
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    coordinates: { lat: 34.5031, lng: 69.1568 }
  },
  {
    slug: "shar-e-naw-mobile-center",
    name: "Shar-e Naw Mobile Center",
    dariName: "مرکز موبایل شهر نو",
    pashtoName: "د شهر نو موبایل مرکز",
    category: "mobile-shops",
    categoryLabel: "Mobile Shops",
    city: "kabul",
    area: "Shar-e Naw",
    address: "Haji Yaqoob Square, Shar-e Naw, Kabul",
    phone: "+93 78 222 9000",
    whatsapp: "+93782229000",
    rating: 4.5,
    reviewCount: 92,
    hours: "9:00 AM - 8:30 PM",
    priceRange: "$$",
    verified: true,
    featured: true,
    description: "New and used phones, accessories, repairs, screen protectors, and price checks in central Kabul.",
    services: ["Phone sales", "Repairs", "Accessories", "Price quotes"],
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
    coordinates: { lat: 34.5328, lng: 69.1666 }
  },
  {
    slug: "arian-dental-clinic",
    name: "Arian Dental Clinic",
    dariName: "کلینیک دندان آرین",
    pashtoName: "آرین د غاښونو کلینیک",
    category: "doctors",
    categoryLabel: "Doctors",
    city: "herat",
    area: "Darwaza Khosh",
    address: "Darwaza Khosh Road, Herat",
    phone: "+93 79 555 1100",
    whatsapp: "+93795551100",
    rating: 4.8,
    reviewCount: 64,
    hours: "8:30 AM - 6:00 PM",
    priceRange: "$$$",
    verified: true,
    featured: false,
    description: "Dental checkups, whitening, braces consultation, and emergency appointments in Herat.",
    services: ["Dental checkup", "Whitening", "Braces", "Booking"],
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80",
    coordinates: { lat: 34.3529, lng: 62.204 }
  },
  {
    slug: "blue-mosque-wedding-hall",
    name: "Blue Mosque Wedding Hall",
    dariName: "تالار عروسی روضه شریف",
    pashtoName: "د روضې شریف واده تالار",
    category: "wedding-halls",
    categoryLabel: "Wedding Halls",
    city: "mazar-e-sharif",
    area: "Rawza",
    address: "Rawza District, Mazar-e-Sharif",
    phone: "+93 77 880 4422",
    whatsapp: "+93778804422",
    rating: 4.4,
    reviewCount: 38,
    hours: "10:00 AM - 11:00 PM",
    priceRange: "$$$",
    verified: false,
    featured: false,
    description: "Wedding and engagement hall with catering, stage design, family sections, and event planning.",
    services: ["Wedding packages", "Catering", "Stage design", "Quote requests"],
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    coordinates: { lat: 36.709, lng: 67.1109 }
  },
  {
    slug: "noor-english-academy",
    name: "Noor English Academy",
    dariName: "اکادمی انگلیسی نور",
    pashtoName: "نور انګلیسي اکاډمي",
    category: "courses",
    categoryLabel: "Courses",
    city: "kabul",
    area: "Dasht-e Barchi",
    address: "Pul-e Khoshk, Dasht-e Barchi, Kabul",
    phone: "+93 74 331 0202",
    whatsapp: "+93743310202",
    rating: 4.6,
    reviewCount: 77,
    hours: "6:30 AM - 7:00 PM",
    priceRange: "$",
    verified: true,
    featured: false,
    description: "English, IELTS preparation, conversation classes, and placement tests for students in west Kabul.",
    services: ["English courses", "IELTS prep", "Placement test", "Monthly plans"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    coordinates: { lat: 34.4993, lng: 69.0704 }
  },
  {
    slug: "herat-rose-salon",
    name: "Herat Rose Salon",
    dariName: "آرایشگاه رز هرات",
    pashtoName: "هرات روز سالون",
    category: "beauty-salons",
    categoryLabel: "Beauty Salons",
    city: "herat",
    area: "Jada-e Mokhaberat",
    address: "Jada-e Mokhaberat, Herat",
    phone: "+93 78 609 4545",
    whatsapp: "+93786094545",
    rating: 4.3,
    reviewCount: 51,
    hours: "9:00 AM - 7:00 PM",
    priceRange: "$$",
    verified: false,
    featured: false,
    description: "Women-focused salon for bridal makeup, hair styling, skincare, and appointment booking.",
    services: ["Bridal makeup", "Hair styling", "Skincare", "Book now"],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
    coordinates: { lat: 34.3482, lng: 62.1997 }
  }
];

export const blogPosts = [
  {
    slug: "best-restaurants-in-kabul",
    title: "بهترین رستورانت های کابل",
    excerpt: "A practical guide to family restaurants, cafes, kebab spots, and modern dining in Kabul.",
    category: "Restaurants",
    readTime: "6 min"
  },
  {
    slug: "mobile-shops-in-shar-e-naw",
    title: "موبایل فروشی های شهر نو",
    excerpt: "Where to compare phone prices, accessories, and repair options in central Kabul.",
    category: "Mobile Shops",
    readTime: "5 min"
  },
  {
    slug: "english-courses-in-kabul",
    title: "English courses in Kabul",
    excerpt: "How to compare English academies by area, level, monthly fee, and student reviews.",
    category: "Courses",
    readTime: "4 min"
  }
];

export function getBusiness(city: string, slug: string) {
  return businesses.find((business) => business.city === city && business.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getCity(slug: string) {
  return cities.find((city) => city.slug === slug);
}
