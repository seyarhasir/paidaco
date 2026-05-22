import Link from "next/link";
import { Globe2, LogIn, UserPlus } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

export function Header({ locale, userEmail }: { locale: Locale; userEmail?: string | null }) {
  const dictionary = getDictionary(locale);
  const extra = {
    fa: {
      home: "خانه",
      explore: "اکتشاف",
      categories: "دسته‌بندی‌ها",
      cities: "شهرها",
      signIn: "ورود",
      register: "ثبت نام",
      language: "دری"
    },
    ps: {
      home: "کور",
      explore: "سپړنه",
      categories: "برخې",
      cities: "ښارونه",
      signIn: "ننوتل",
      register: "ثبت نام",
      language: "پښتو"
    },
    en: {
      home: "Home",
      explore: "Explore",
      categories: "Categories",
      cities: "Cities",
      signIn: "Sign In",
      register: "Register",
      language: "EN"
    }
  }[locale];
  const navItems = [
    { href: localePath(locale), label: extra.home },
    { href: localePath(locale, "/search"), label: extra.explore },
    { href: `${localePath(locale)}#categories`, label: extra.categories },
    { href: `${localePath(locale)}#cities`, label: extra.cities },
    { href: localePath(locale, "/blog"), label: dictionary.nav.guides },
    { href: localePath(locale, "/add-business"), label: dictionary.nav.addBusiness }
  ];

  return (
    <header className="site-header">
      <Link className="brand" href={localePath(locale)} aria-label={dictionary.paidaco}>
        <span className="brand-mark">پ</span>
        <span>
          <strong>{dictionary.paidaco}</strong>
          {dictionary.brandSub ? <small>{dictionary.brandSub}</small> : null}
        </span>
      </Link>
      <nav aria-label="Main navigation">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <div className="language-switcher" aria-label="Language">
          <Globe2 size={16} aria-hidden="true" />
          <Link className={locale === "fa" ? "active" : ""} href="/fa">دری</Link>
          <Link className={locale === "ps" ? "active" : ""} href="/ps">پښتو</Link>
          <Link className={locale === "en" ? "active" : ""} href="/en">EN</Link>
        </div>
        {userEmail ? (
          <>
            <Link className="signin-link" href={localePath(locale, "/dashboard")}>{userEmail}</Link>
            <form action={logoutAction}>
              <input type="hidden" name="locale" value={locale} />
              <button className="signin-link header-form-button" type="submit">
                {locale === "en" ? "Logout" : locale === "ps" ? "وتل" : "خروج"}
              </button>
            </form>
          </>
        ) : (
          <>
            <Link className="signin-link" href={localePath(locale, "/login")}><LogIn size={16} />{extra.signIn}</Link>
            <Link className="register-link" href={localePath(locale, "/register")}><UserPlus size={16} />{extra.register}</Link>
          </>
        )}
        <Link className="claim-link" href={localePath(locale, "/claim-business")}>
          {dictionary.nav.claim}
        </Link>
      </div>
    </header>
  );
}
