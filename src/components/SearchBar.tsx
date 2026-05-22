import { categories, cities } from "@/lib/data";
import { getDictionary, localePath, localizeCategory, localizeCity, type Locale } from "@/lib/i18n";

type SearchBarProps = {
  locale: Locale;
  query?: string;
  city?: string;
  category?: string;
  compact?: boolean;
  showCategory?: boolean;
};

export function SearchBar({
  locale,
  query = "",
  city = "",
  category = "",
  compact = false,
  showCategory = true
}: SearchBarProps) {
  const dictionary = getDictionary(locale);

  return (
    <form className={`${compact ? "search-panel compact" : "search-panel"} ${showCategory ? "" : "without-category"}`} action={localePath(locale, "/search")}>
      <label>
        <span>{dictionary.search.what}</span>
        <input name="q" defaultValue={query} placeholder={dictionary.search.placeholder} />
      </label>
      <label>
        <span>{dictionary.search.city}</span>
        <select name="city" defaultValue={city}>
          <option value="">{dictionary.search.allAfghanistan}</option>
          {cities.map((item) => (
            <option value={item.slug} key={item.slug}>
              {localizeCity(item.slug, locale)}
            </option>
          ))}
        </select>
      </label>
      {showCategory ? (
        <label>
          <span>{dictionary.search.category}</span>
          <select name="category" defaultValue={category}>
            <option value="">{dictionary.search.allCategories}</option>
            {categories.map((item) => (
              <option value={item.slug} key={item.slug}>
                {localizeCategory(item.slug, locale)}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <button type="submit">{dictionary.search.submit}</button>
    </form>
  );
}
