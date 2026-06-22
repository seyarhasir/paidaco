import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";
import { getDirection, isLocale, localePath, type Locale } from "@/lib/i18n";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ error?: string }>;
};

const copy = {
  fa: {
    title: "ورود به پیدا کو",
    body: "برای ثبت نظر، ذخیره مکان‌ها و مدیریت کسب‌وکار وارد شوید.",
    email: "ایمیل",
    password: "رمز عبور",
    submit: "ورود",
    noAccount: "حساب ندارید؟",
    register: "ثبت نام کنید",
    error: "ایمیل یا رمز عبور درست نیست."
  },
  ps: {
    title: "پیدا کو ته ننوتل",
    body: "د نظر لیکلو، ځایونو ساتلو او کاروبار مدیریت لپاره ننوځئ.",
    email: "ایمیل",
    password: "پټنوم",
    submit: "ننوتل",
    noAccount: "حساب نه لرئ؟",
    register: "ثبت نام وکړئ",
    error: "ایمیل یا پټنوم سم نه دی."
  },
  en: {
    title: "Sign in to Paidaco",
    body: "Sign in to review, save places, and manage your business.",
    email: "Email",
    password: "Password",
    submit: "Sign In",
    noAccount: "No account?",
    register: "Register",
    error: "Email or password is incorrect."
  }
} as const;

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) redirect("/fa/login");

  const locale = rawLocale as Locale;
  const user = await getCurrentUser("login page auth");
  if (user) redirect(localePath(locale, "/dashboard"));

  const search = (await searchParams) ?? {};
  const t = copy[locale];
  const errorMessage = search.error ? decodeURIComponent(search.error) : null;

  return (
    <section className="auth-page" dir={getDirection(locale)}>
      <form className="auth-card" action={loginAction}>
        <input type="hidden" name="locale" value={locale} />
        <div>
          <p className="eyebrow">Paidaco</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
        {errorMessage ? <div className="auth-error">{errorMessage === "invalid_credentials" ? t.error : errorMessage}</div> : null}
        <label>
          <span>{t.email}</span>
          <input name="email" type="email" required />
        </label>
        <label>
          <span>{t.password}</span>
          <input name="password" type="password" required minLength={6} />
        </label>
        <button type="submit">{t.submit}</button>
        <p className="auth-switch">
          {t.noAccount} <Link href={localePath(locale, "/register")}>{t.register}</Link>
        </p>
      </form>
    </section>
  );
}
