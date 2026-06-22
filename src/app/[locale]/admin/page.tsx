import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { syncAuthUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { AdminDashboardShell } from "@/components/AdminDashboardShell";

async function requireAdmin(locale: Locale) {
  const user = await getCurrentUser("admin auth");

  if (!user) redirect(localePath(locale, "/login"));

  await syncAuthUser(user);

  const role = await prisma.userRole.findFirst({
    where: {
      userId: user.id,
      role: { key: "admin" }
    }
  });

  if (!role) redirect(localePath(locale, "/dashboard"));
  return user;
}

export default async function AdminPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) redirect("/fa/admin");

  const locale = rawLocale as Locale;
  await requireAdmin(locale);

  // Fetch all registered users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      userRoles: {
        include: {
          role: true
        }
      }
    }
  });

  // Fetch count statistics
  const [businessesCount, reviewsCount, ordersCount, businessPhotosCount, productPhotosCount, dbSettings] = await Promise.all([
    prisma.business.count(),
    prisma.review.count(),
    prisma.order.count(),
    prisma.businessPhoto.count(),
    prisma.productPhoto.count(),
    prisma.systemSetting.findMany()
  ]);

  const totalPhotosCount = businessPhotosCount + productPhotosCount;

  // Map settings to dynamic feature flags with database state
  const defaultFlags = [
    { key: "allow_reg", name: "Allow New Registrations", enabled: true, desc: "Enable standard email/social signups." },
    { key: "review_mod", name: "Require Review Approval", enabled: true, desc: "Reviews must be moderated before showing." },
    { key: "ai_translate", name: "AI Translation Preview", enabled: false, desc: "Show machine translations for missing items." }
  ];

  const initialFeatureFlags = defaultFlags.map((flag) => {
    const matched = dbSettings.find((s) => s.key === flag.key);
    return {
      ...flag,
      enabled: matched ? matched.value === "true" : flag.enabled
    };
  });

  // Real Database Latency Check
  const latencyStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {}
  const dbLatency = `${Date.now() - latencyStart}ms`;

  // Fetch Count of Premium (Featured or Verified) Listings
  const premiumCount = await prisma.business.count({
    where: {
      OR: [
        { featured: true },
        { verified: true }
      ]
    }
  });

  // Fetch 5 Most Recent Users
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });

  // Fetch 5 Most Recent Reviews
  const recentReviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: true,
      business: {
        include: {
          translations: {
            where: { locale }
          }
        }
      }
    }
  });

  // Fetch 5 Most Recent Businesses
  const recentBusinesses = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      translations: {
        where: { locale }
      }
    }
  });

  // Server Action: Update user roles
  const handleUpdateUserRole = async (userId: string, newRoleKeys: string[]) => {
    "use server";
    // Delete all current roles
    await prisma.userRole.deleteMany({
      where: { userId }
    });

    // Create the new ones
    for (const key of newRoleKeys) {
      const roleRecord = await prisma.role.findUnique({
        where: { key }
      });
      if (roleRecord) {
        await prisma.userRole.create({
          data: {
            userId,
            roleId: roleRecord.id
          }
        });
      }
    }

    revalidatePath("/[locale]/admin", "page");
  };

  // Server Action: Toggle User ban status (Since there is no ban column, we clear all roles as a warning)
  const handleToggleUserBan = async (userId: string) => {
    "use server";
    await prisma.userRole.deleteMany({
      where: { userId }
    });
    revalidatePath("/[locale]/admin", "page");
  };

  // Server Action: Toggle Feature Flag in database
  const handleToggleFeatureFlag = async (key: string, enabled: boolean) => {
    "use server";
    await prisma.systemSetting.upsert({
      where: { key },
      update: { value: enabled ? "true" : "false" },
      create: { key, value: enabled ? "true" : "false" }
    });
    revalidatePath("/[locale]/admin", "page");
  };

  return (
    <section className="dashboard-page">
      <div className="container">
        <AdminDashboardShell
          locale={locale}
          users={users}
          businessesCount={businessesCount}
          reviewsCount={reviewsCount}
          ordersCount={ordersCount}
          recentUsers={recentUsers}
          recentReviews={recentReviews}
          recentBusinesses={recentBusinesses}
          dbLatency={dbLatency}
          premiumCount={premiumCount}
          initialFeatureFlags={initialFeatureFlags}
          totalPhotosCount={totalPhotosCount}
          onUpdateUserRole={handleUpdateUserRole}
          onToggleUserBan={handleToggleUserBan}
          onToggleFeatureFlag={handleToggleFeatureFlag}
        />
      </div>
    </section>
  );
}
