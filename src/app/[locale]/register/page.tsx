import Link from "next/link";
import { redirect } from "next/navigation";
import { registerAction } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { getDirection, isLocale, localePath, type Locale } from "@/lib/i18n";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ error?: string }>;
};

const copy = {
  fa: {
    title: "ثبت نام در پیدا کو",
    body: "حساب بسازید تا نظر بدهید، مکان‌ها را ذخیره کنید و کسب‌وکار خود را مدیریت کنید.",
    name: "نام",
    email: "ایمیل",
    password: "رمز عبور",
    emailHint: "از ایمیل واقعی مثل Gmail یا ایمیل شخصی استفاده کنید. ایمیل‌های نمونه ممکن است رد شوند.",
    submit: "ثبت نام",
    hasAccount: "حساب دارید؟",
    login: "وارد شوید",
    error: "ثبت نام انجام نشد. لطفا دوباره تلاش کنید."
  },
  ps: {
    title: "په پیدا کو کې ثبت نام",
    body: "حساب جوړ کړئ چې نظر ولیکئ، ځایونه وساتئ او خپل کاروبار مدیریت کړئ.",
    name: "نوم",
    email: "ایمیل",
    password: "پټنوم",
    emailHint: "اصلي ایمیل لکه Gmail یا خپل شخصي ایمیل وکاروئ. نمونوي ایمیلونه کېدای شي رد شي.",
    submit: "ثبت نام",
    hasAccount: "حساب لرئ؟",
    login: "ننوځئ",
    error: "ثبت نام ونه شو. بیا هڅه وکړئ."
  },
  en: {
    title: "Create your Paidaco account",
    body: "Create an account to review, save places, and manage your business.",
    name: "Name",
    email: "Email",
    password: "Password",
    emailHint: "Use a real email address like Gmail or your own email. Example/test domains may be rejected.",
    submit: "Register",
    hasAccount: "Already have an account?",
    login: "Sign in",
    error: "Registration failed. Please try again."
  }
} as const;

export default async function RegisterPage({ params, searchParams }: RegisterPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) redirect("/fa/register");

  const locale = rawLocale as Locale;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (user) redirect(localePath(locale, "/dashboard"));

  const search = (await searchParams) ?? {};
  const t = copy[locale];
  const errorMessage = search.error ? decodeURIComponent(search.error) : null;

  return (
    <section className="auth-page" dir={getDirection(locale)}>
      <form className="auth-card" action={registerAction}>
        <input type="hidden" name="locale" value={locale} />
        <div>
          <p className="eyebrow">Paidaco</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
        {errorMessage ? <div className="auth-error">{errorMessage === "signup_failed" ? t.error : errorMessage}</div> : null}
        <label>
          <span>{t.name}</span>
          <input name="name" required />
        </label>
        <label>
          <span>{t.email}</span>
          <input name="email" type="email" required />
          <small>{t.emailHint}</small>
        </label>
        <label>
          <span>{t.password}</span>
          <input name="password" type="password" required minLength={6} />
        </label>
        <button type="submit">{t.submit}</button>
        <p className="auth-switch">
          {t.hasAccount} <Link href={localePath(locale, "/login")}>{t.login}</Link>
        </p>
      </form>
    </section>
  );
}
