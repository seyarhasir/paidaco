import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { syncAuthUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";
import { getDirection, isLocale, localePath, type Locale } from "@/lib/i18n";
import { UserDashboardShell } from "@/components/UserDashboardShell";
import { OwnerDashboardShell } from "@/components/OwnerDashboardShell";
import {
  deleteReviewAction,
  updateProfileAction,
  updateListingAction,
  updateLeadStatusAction
} from "./actions";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ view?: string }>;
};

export default async function DashboardPage({ params, searchParams }: DashboardPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) redirect("/fa/dashboard");

  const locale = rawLocale as Locale;
  const viewParam = (await searchParams)?.view;

  const user = await getCurrentUser("dashboard auth");

  if (!user) redirect(localePath(locale, "/login"));

  const dbUser = await syncAuthUser(user);
  if (!dbUser) redirect(localePath(locale, "/login"));

  const profile = await prisma.user.findUnique({
    where: { id: dbUser.id },
    include: {
      userRoles: {
        include: {
          role: true
        }
      }
    }
  });

  const roles = profile?.userRoles.map((item) => item.role.key) ?? [];

  if (roles.includes("admin")) {
    redirect(localePath(locale, "/admin"));
  }
  if (roles.includes("moderator") && !roles.includes("business_owner") && !roles.includes("user")) {
    redirect(localePath(locale, "/moderator"));
  }
  if (roles.includes("editor") && !roles.includes("business_owner") && !roles.includes("user")) {
    redirect(localePath(locale, "/editor"));
  }

  const isOwner = roles.includes("business_owner");
  const isUser = roles.includes("user") || roles.length === 0;

  // Decide active view
  let activeView = "user";
  if (isOwner && !isUser) {
    activeView = "owner";
  } else if (isOwner && isUser) {
    activeView = viewParam === "owner" ? "owner" : "user";
  }

  // Bind server actions
  const handleDeleteReview = async (id: string) => {
    "use server";
    await deleteReviewAction(id);
  };

  const handleUpdateProfile = async (data: { name: string; phone: string }) => {
    "use server";
    await updateProfileAction(dbUser.id, data);
  };

  const handleUpdateListing = async (businessId: string, updates: any) => {
    "use server";
    await updateListingAction(businessId, updates, locale as any);
  };

  const handleUpdateLeadStatus = async (leadId: string, status: string) => {
    "use server";
    await updateLeadStatusAction(leadId, status);
  };

  // Fetch data at top level depending on view
  let userReviews: any[] = [];
  let userQuotes: any[] = [];
  let combinedBusinesses: any[] = [];
  let leads: any[] = [];
  let reviews: any[] = [];

  if (activeView === "owner") {
    const ownerBusinesses = await prisma.business.findMany({
      where: { ownerId: dbUser.id },
      include: {
        city: true,
        area: true,
        translations: true
      }
    });

    const memberBusinesses = await prisma.businessMember.findMany({
      where: { userId: dbUser.id },
      select: {
        business: {
          include: {
            city: true,
            area: true,
            translations: true
          }
        }
      }
    });

    combinedBusinesses = Array.from(
      new Map(
        [...ownerBusinesses, ...memberBusinesses.map((m) => m.business)].map((b) => [b.id, b])
      ).values()
    ).map((business) => ({
      ...business,
      latitude: business.latitude ? Number(business.latitude) : null,
      longitude: business.longitude ? Number(business.longitude) : null
    }));

    const businessIds = combinedBusinesses.map((b) => b.id);

    leads = await prisma.lead.findMany({
      where: { businessId: { in: businessIds } },
      orderBy: { createdAt: "desc" }
    });

    reviews = await prisma.review.findMany({
      where: { businessId: { in: businessIds } },
      orderBy: { createdAt: "desc" }
    });
  } else {
    userReviews = await prisma.review.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      include: {
        business: {
          include: {
            city: true,
            translations: { where: { locale } }
          }
        }
      }
    });

    userQuotes = await prisma.lead.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      include: {
        business: {
          include: {
            city: true,
            translations: { where: { locale } }
          }
        }
      }
    });
  }

  return (
    <section className="dashboard-page" dir={getDirection(locale)}>
      <div className="container" style={{ display: "grid", gap: "16px" }}>
        {/* Switcher panel if user has multiple roles */}
        {isOwner && isUser && (
          <div className="role-header-switcher">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <strong style={{ fontSize: "14px" }}>
                {locale === "en" ? "Dashboard Console:" : locale === "ps" ? "ډشبورډ کنسول:" : "کنسول داشبورد:"}
              </strong>
              <Link
                href="?view=user"
                className={`role-switch-btn ${activeView === "user" ? "active" : ""}`}
              >
                {locale === "en" ? "Member Panel" : locale === "ps" ? "د غړي پینل" : "پنل عضو"}
              </Link>
              <Link
                href="?view=owner"
                className={`role-switch-btn ${activeView === "owner" ? "active" : ""}`}
              >
                {locale === "en" ? "Business Owner" : locale === "ps" ? "کاروبار مالک" : "مالک کسب‌وکار"}
              </Link>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {roles.includes("moderator") && (
                <Link href={localePath(locale, "/moderator")} className="role-switch-btn">
                  {locale === "en" ? "Moderator Queue" : "صف ناظر"}
                </Link>
              )}
              {roles.includes("editor") && (
                <Link href={localePath(locale, "/editor")} className="role-switch-btn">
                  {locale === "en" ? "SEO Editor" : "ویرایشگر محتوا"}
                </Link>
              )}
              {roles.includes("admin") && (
                <Link href={localePath(locale, "/admin")} className="role-switch-btn">
                  {locale === "en" ? "Super Admin" : "مدیر ارشد"}
                </Link>
              )}
            </div>
          </div>
        )}

        {activeView === "owner" ? (
          <OwnerDashboardShell
            locale={locale}
            businesses={combinedBusinesses}
            initialLeads={leads}
            initialReviews={reviews}
            onUpdateListing={handleUpdateListing}
            onUpdateLeadStatus={handleUpdateLeadStatus}
          />
        ) : (
          <UserDashboardShell
            locale={locale}
            profile={{
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              phone: dbUser.phone,
              roles: roles
            }}
            reviews={userReviews}
            quoteRequests={userQuotes}
            onDeleteReview={handleDeleteReview}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </div>
    </section>
  );
}
