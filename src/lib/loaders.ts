import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { toCategoryOption, toCityOption } from "@/lib/presenters";

export async function loadSearchOptions(locale: Locale) {
  const [cities, categories] = await Promise.all([
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({
      orderBy: { slug: "asc" },
      include: {
        translations: {
          where: { locale }
        }
      }
    })
  ]);

  return {
    cities,
    categories,
    cityOptions: cities.map((city) => toCityOption(city, locale)),
    categoryOptions: categories.map((category) => toCategoryOption(category, locale))
  };
}
