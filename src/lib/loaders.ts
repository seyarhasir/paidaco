import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { categories as demoCategories, cities as demoCities } from "@/lib/data";
import { toCategoryOption, toCityOption } from "@/lib/presenters";
import { isRetryableDependencyError, logDependencyFallback } from "@/lib/dependency-errors";

export async function loadSearchOptions(locale: Locale) {
  try {
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
  } catch (error) {
    if (isRetryableDependencyError(error)) {
      logDependencyFallback("loadSearchOptions", error);
      const cities = demoCities.map((city) => ({
        id: city.slug,
        slug: city.slug,
        name: city.name,
        localName: city.localName
      }));
      const categories = demoCategories.map((category) => ({
        id: category.slug,
        slug: category.slug,
        translations: [
          {
            locale,
            name: locale === "en" ? category.label : category.localLabel,
            description: null
          }
        ]
      }));

      return {
        cities,
        categories,
        cityOptions: cities.map((city) => toCityOption(city, locale)),
        categoryOptions: categories.map((category) => toCategoryOption(category, locale))
      };
    }

    throw error;
  }
}
