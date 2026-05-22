import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncAuthUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

const copy = {
  fa: {
    title: "داشبورد شما",
    body: "اینجا مرکز حساب، نظرها، کسب‌وکارها و سفارش‌های شما خواهد بود.",
    roles: "نقش‌ها",
    noRoles: "نقشی هنوز ثبت نشده است.",
    admin: "رفتن به مدیریت",
    claim: "درخواست مالکیت کسب‌وکار"
  },
  ps: {
    title: "ستاسو ډشبورډ",
    body: "دلته به ستاسو حساب، نظرونه، کاروبارونه او سفارشونه مدیریت کېږي.",
    roles: "رولونه",
    noRoles: "تر اوسه رول نشته.",
    admin: "مدیریت ته لاړ شئ",
    claim: "د کاروبار مالکیت واخلئ"
  },
  en: {
    title: "Your dashboard",
    body: "This will become the home for your account, reviews, businesses, and orders.",
    roles: "Roles",
    noRoles: "No roles assigned yet.",
    admin: "Go to admin",
    claim: "Claim a business"
  }
} as const;

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) redirect("/fa/dashboard");

  const locale = rawLocale as Locale;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect(localePath(locale, "/login"));

  await syncAuthUser(user);

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      userRoles: {
        include: {
          role: true
        }
      },
      memberships: {
        include: {
          business: {
            include: {
              translations: true
            }
          }
        }
      }
    }
  });

  const t = copy[locale];
  const roles = profile?.userRoles.map((item) => item.role.key) ?? [];
  const isAdmin = roles.includes("admin");

  return (
    <section className="dashboard-page">
      <div className="dashboard-panel">
        <p className="eyebrow">Paidaco</p>
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <div className="dashboard-card">
          <strong>{user.email}</strong>
          <span>{profile?.name}</span>
        </div>
        <div className="dashboard-card">
          <h2>{t.roles}</h2>
          {roles.length ? (
            <div className="role-list">
              {roles.map((role) => (
                <span key={role}>{role}</span>
              ))}
            </div>
          ) : (
            <p>{t.noRoles}</p>
          )}
        </div>
        <div className="actions-row prominent">
          <Link href={localePath(locale, "/claim-business")}>{t.claim}</Link>
          {isAdmin ? <Link href={localePath(locale, "/admin")}>{t.admin}</Link> : null}
        </div>
      </div>
    </section>
  );
}
