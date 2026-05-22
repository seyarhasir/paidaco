import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncAuthUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

const copy = {
  fa: {
    title: "مدیریت پیدا کو",
    body: "این صفحه فقط برای ادمین‌ها است.",
    users: "کاربران",
    businesses: "کسب‌وکارها",
    reviews: "نظرها",
    orders: "سفارش‌ها"
  },
  ps: {
    title: "د پیدا کو مدیریت",
    body: "دا پاڼه یوازې د اډمین لپاره ده.",
    users: "کاروونکي",
    businesses: "کاروبارونه",
    reviews: "نظرونه",
    orders: "سفارشونه"
  },
  en: {
    title: "Paidaco Admin",
    body: "This page is only for admins.",
    users: "Users",
    businesses: "Businesses",
    reviews: "Reviews",
    orders: "Orders"
  }
} as const;

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) redirect("/fa/admin");

  const locale = rawLocale as Locale;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect(localePath(locale, "/login"));

  await syncAuthUser(user);

  const adminRole = await prisma.userRole.findFirst({
    where: {
      userId: user.id,
      role: {
        key: "admin"
      }
    }
  });

  if (!adminRole) redirect(localePath(locale, "/dashboard"));

  const [users, businesses, reviews, orders] = await Promise.all([
    prisma.user.count(),
    prisma.business.count(),
    prisma.review.count(),
    prisma.order.count()
  ]);

  const t = copy[locale];
  const stats = [
    { label: t.users, value: users },
    { label: t.businesses, value: businesses },
    { label: t.reviews, value: reviews },
    { label: t.orders, value: orders }
  ];

  return (
    <section className="dashboard-page">
      <div className="dashboard-panel">
        <p className="eyebrow">Admin</p>
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <div className="stats-grid admin-stats">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
