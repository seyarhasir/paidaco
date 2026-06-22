import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { syncAuthUser } from "@/lib/auth/user";
import { assignRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import { getDirection, isLocale, localePath, type Locale } from "@/lib/i18n";
import { ModeratorDashboardShell } from "@/components/ModeratorDashboardShell";

async function requireModerator(locale: Locale) {
  const user = await getCurrentUser("moderator auth");

  if (!user) redirect(localePath(locale, "/login"));

  await syncAuthUser(user);

  const role = await prisma.userRole.findFirst({
    where: {
      userId: user.id,
      role: { key: "moderator" }
    }
  });

  if (!role) redirect(localePath(locale, "/dashboard"));
  return user;
}

export default async function ModeratorPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) redirect("/fa/moderator");

  const locale = rawLocale as Locale;
  await requireModerator(locale);

  // Fetch pending review items
  const reviews = await prisma.review.findMany({
    where: { approved: false },
    orderBy: { createdAt: "asc" }, // oldest first
    include: {
      business: {
        include: {
          city: true,
          translations: { where: { locale } }
        }
      }
    }
  });

  // Fetch pending claims
  const claims = await prisma.businessClaim.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    include: {
      business: {
        include: {
          city: true,
          translations: { where: { locale } }
        }
      }
    }
  });

  // Fetch pending business submissions
  const businesses = await prisma.business.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    include: {
      city: true,
      translations: { where: { locale } }
    }
  });

  // Inline Server Actions to pass down
  const handleApproveReview = async (reviewId: string) => {
    "use server";
    await prisma.review.update({
      where: { id: reviewId },
      data: { approved: true }
    });
    revalidatePath("/[locale]/moderator", "page");
  };

  const handleRejectReview = async (reviewId: string, reason?: string) => {
    "use server";
    // For safety, delete review if rejected, or update status if columns existed
    await prisma.review.delete({
      where: { id: reviewId }
    });
    revalidatePath("/[locale]/moderator", "page");
  };

  const handleApproveClaim = async (claimId: string) => {
    "use server";
    const claim = await prisma.businessClaim.findUnique({
      where: { id: claimId }
    });
    if (!claim) return;

    await prisma.businessClaim.update({
      where: { id: claimId },
      data: {
        status: "approved",
        reviewedAt: new Date()
      }
    });

    if (claim.userId) {
      await prisma.business.update({
        where: { id: claim.businessId },
        data: { ownerId: claim.userId }
      });
      await assignRole(claim.userId, "business_owner");
    }
    revalidatePath("/[locale]/moderator", "page");
  };

  const handleRejectClaim = async (claimId: string) => {
    "use server";
    await prisma.businessClaim.update({
      where: { id: claimId },
      data: {
        status: "rejected",
        reviewedAt: new Date()
      }
    });
    revalidatePath("/[locale]/moderator", "page");
  };

  const handlePublishBusiness = async (businessId: string) => {
    "use server";
    await prisma.business.update({
      where: { id: businessId },
      data: {
        status: "published",
        publishedAt: new Date()
      }
    });
    revalidatePath("/[locale]/moderator", "page");
  };

  const handleSuspendBusiness = async (businessId: string) => {
    "use server";
    await prisma.business.update({
      where: { id: businessId },
      data: { status: "suspended" }
    });
    revalidatePath("/[locale]/moderator", "page");
  };

  return (
    <section className="dashboard-page" dir={getDirection(locale)}>
      <div className="container">
        <ModeratorDashboardShell
          locale={locale}
          initialReviews={reviews}
          initialClaims={claims}
          initialBusinesses={businesses}
          onApproveReview={handleApproveReview}
          onRejectReview={handleRejectReview}
          onApproveClaim={handleApproveClaim}
          onRejectClaim={handleRejectClaim}
          onPublishBusiness={handlePublishBusiness}
          onSuspendBusiness={handleSuspendBusiness}
        />
      </div>
    </section>
  );
}
