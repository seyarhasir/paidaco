import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { syncAuthUser } from "@/lib/auth/user";
import { assignRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import { getDirection, isLocale, localePath, type Locale } from "@/lib/i18n";

const copy = {
  fa: {
    title: "مرکز ناظر",
    body: "نظرها، درخواست‌های مالکیت و کسب‌وکارهای در انتظار را مدیریت کنید.",
    reviews: "نظرهای در انتظار",
    claims: "درخواست‌های مالکیت",
    businesses: "کسب‌وکارهای در انتظار",
    approve: "تایید",
    reject: "رد",
    publish: "انتشار",
    suspend: "تعلیق",
    empty: "موردی برای بررسی نیست.",
    rating: "امتیاز",
    view: "مشاهده"
  },
  ps: {
    title: "د ناظر مرکز",
    body: "نظرونه، د مالکیت غوښتنې او په تمه کاروبارونه اداره کړئ.",
    reviews: "په تمه نظرونه",
    claims: "د مالکیت غوښتنې",
    businesses: "په تمه کاروبارونه",
    approve: "تایید",
    reject: "رد",
    publish: "خپرول",
    suspend: "ځنډول",
    empty: "اوس کوم مورد نه شته.",
    rating: "امتیاز",
    view: "کتل"
  },
  en: {
    title: "Moderator center",
    body: "Review pending reviews, ownership claims, and business submissions.",
    reviews: "Pending reviews",
    claims: "Ownership claims",
    businesses: "Pending businesses",
    approve: "Approve",
    reject: "Reject",
    publish: "Publish",
    suspend: "Suspend",
    empty: "Nothing to review right now.",
    rating: "Rating",
    view: "View"
  }
} as const;

async function requireModerator(locale: Locale) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

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

async function approveReviewAction(formData: FormData) {
  "use server";
  const locale = String(formData.get("locale") ?? "fa") as Locale;
  const reviewId = String(formData.get("reviewId") ?? "");
  if (!reviewId) return;

  await requireModerator(locale);

  await prisma.review.update({
    where: { id: reviewId },
    data: { approved: true }
  });

  revalidatePath(localePath(locale, "/moderator"));
}

async function rejectReviewAction(formData: FormData) {
  "use server";
  const locale = String(formData.get("locale") ?? "fa") as Locale;
  const reviewId = String(formData.get("reviewId") ?? "");
  if (!reviewId) return;

  await requireModerator(locale);

  await prisma.review.delete({
    where: { id: reviewId }
  });

  revalidatePath(localePath(locale, "/moderator"));
}

async function approveClaimAction(formData: FormData) {
  "use server";
  const locale = String(formData.get("locale") ?? "fa") as Locale;
  const claimId = String(formData.get("claimId") ?? "");
  if (!claimId) return;

  await requireModerator(locale);

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

  revalidatePath(localePath(locale, "/moderator"));
}

async function rejectClaimAction(formData: FormData) {
  "use server";
  const locale = String(formData.get("locale") ?? "fa") as Locale;
  const claimId = String(formData.get("claimId") ?? "");
  if (!claimId) return;

  await requireModerator(locale);

  await prisma.businessClaim.update({
    where: { id: claimId },
    data: {
      status: "rejected",
      reviewedAt: new Date()
    }
  });

  revalidatePath(localePath(locale, "/moderator"));
}

async function publishBusinessAction(formData: FormData) {
  "use server";
  const locale = String(formData.get("locale") ?? "fa") as Locale;
  const businessId = String(formData.get("businessId") ?? "");
  if (!businessId) return;

  await requireModerator(locale);

  await prisma.business.update({
    where: { id: businessId },
    data: {
      status: "published",
      publishedAt: new Date()
    }
  });

  revalidatePath(localePath(locale, "/moderator"));
}

async function suspendBusinessAction(formData: FormData) {
  "use server";
  const locale = String(formData.get("locale") ?? "fa") as Locale;
  const businessId = String(formData.get("businessId") ?? "");
  if (!businessId) return;

  await requireModerator(locale);

  await prisma.business.update({
    where: { id: businessId },
    data: { status: "suspended" }
  });

  revalidatePath(localePath(locale, "/moderator"));
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

  const [reviews, claims, businesses] = await Promise.all([
    prisma.review.findMany({
      where: { approved: false },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        rating: true,
        comment: true,
        business: {
          select: {
            slug: true,
            city: { select: { slug: true } },
            translations: { where: { locale }, select: { name: true } }
          }
        }
      }
    }),
    prisma.businessClaim.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        ownerName: true,
        phone: true,
        business: {
          select: {
            slug: true,
            city: { select: { slug: true } },
            translations: { where: { locale }, select: { name: true } }
          }
        }
      }
    }),
    prisma.business.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        slug: true,
        city: { select: { slug: true } },
        translations: { where: { locale }, select: { name: true } }
      }
    })
  ]);

  const t = copy[locale];

  return (
    <section className="dashboard-page" dir={getDirection(locale)}>
      <div className="moderation-shell">
        <header className="moderation-hero">
          <p className="eyebrow">Paidaco</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </header>

        <section className="moderation-section">
          <div className="section-head">
            <h2>{t.reviews}</h2>
          </div>
          {reviews.length ? (
            <div className="moderation-list">
              {reviews.map((review) => (
                <div className="moderation-row" key={review.id}>
                  <div>
                    <strong>{review.business.translations[0]?.name ?? review.business.slug}</strong>
                    <span className="queue-meta">
                      {t.rating}: {review.rating}/5
                    </span>
                    {review.comment ? <p className="row-note">{review.comment}</p> : null}
                  </div>
                  <div className="moderation-actions">
                    <Link
                      className="inline-link"
                      href={localePath(locale, `/business/${review.business.city.slug}/${review.business.slug}`)}
                    >
                      {t.view}
                    </Link>
                    <form action={approveReviewAction}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="reviewId" value={review.id} />
                      <button className="action-button" type="submit">
                        {t.approve}
                      </button>
                    </form>
                    <form action={rejectReviewAction}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="reviewId" value={review.id} />
                      <button className="action-button ghost" type="submit">
                        {t.reject}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-note">{t.empty}</p>
          )}
        </section>

        <section className="moderation-section">
          <div className="section-head">
            <h2>{t.claims}</h2>
          </div>
          {claims.length ? (
            <div className="moderation-list">
              {claims.map((claim) => (
                <div className="moderation-row" key={claim.id}>
                  <div>
                    <strong>{claim.business.translations[0]?.name ?? claim.business.slug}</strong>
                    <span className="queue-meta">{claim.ownerName} · {claim.phone}</span>
                  </div>
                  <div className="moderation-actions">
                    <Link
                      className="inline-link"
                      href={localePath(locale, `/business/${claim.business.city.slug}/${claim.business.slug}`)}
                    >
                      {t.view}
                    </Link>
                    <form action={approveClaimAction}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="claimId" value={claim.id} />
                      <button className="action-button" type="submit">
                        {t.approve}
                      </button>
                    </form>
                    <form action={rejectClaimAction}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="claimId" value={claim.id} />
                      <button className="action-button ghost" type="submit">
                        {t.reject}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-note">{t.empty}</p>
          )}
        </section>

        <section className="moderation-section">
          <div className="section-head">
            <h2>{t.businesses}</h2>
          </div>
          {businesses.length ? (
            <div className="moderation-list">
              {businesses.map((business) => (
                <div className="moderation-row" key={business.id}>
                  <div>
                    <strong>{business.translations[0]?.name ?? business.slug}</strong>
                    <span className="queue-meta">{business.slug}</span>
                  </div>
                  <div className="moderation-actions">
                    <Link
                      className="inline-link"
                      href={localePath(locale, `/business/${business.city.slug}/${business.slug}`)}
                    >
                      {t.view}
                    </Link>
                    <form action={publishBusinessAction}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="businessId" value={business.id} />
                      <button className="action-button" type="submit">
                        {t.publish}
                      </button>
                    </form>
                    <form action={suspendBusinessAction}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="businessId" value={business.id} />
                      <button className="action-button ghost" type="submit">
                        {t.suspend}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-note">{t.empty}</p>
          )}
        </section>
      </div>
    </section>
  );
}
