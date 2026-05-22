import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncAuthUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";
import { getDirection, isLocale, localePath, type Locale } from "@/lib/i18n";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

const copy = {
  fa: {
    title: "داشبورد شما",
    body: "همه کارهای مهم شما اینجاست؛ از مدیریت کسب‌وکار تا بررسی نظرها.",
    overview: "نمای کلی",
    roles: "نقش‌های شما",
    noRoles: "نقشی هنوز ثبت نشده است.",
    quick: "کارهای سریع",
    claim: "درخواست مالکیت کسب‌وکار",
    addBusiness: "ثبت کسب‌وکار جدید",
    findBusiness: "جستجوی کسب‌وکارها",
    admin: "مرکز مدیریت",
    moderatorCenter: "مرکز ناظر",
    editorCenter: "مرکز محتوا",
    userSection: "پنل کاربر",
    ownerSection: "پنل مالک کسب‌وکار",
    moderatorSection: "پنل ناظر",
    editorSection: "پنل محتوا",
    adminSection: "پنل مدیر ارشد",
    yourBusinesses: "کسب‌وکارهای شما",
    emptyBusinesses: "هنوز کسب‌وکاری ندارید. یکی را ثبت یا مالکیتش را درخواست کنید.",
    view: "مشاهده",
    verified: "تایید شده",
    queue: "صف کار",
    queueEmpty: "موردی برای بررسی نیست.",
    queueReviews: "نظرهای تازه",
    queueClaims: "درخواست‌های مالکیت",
    queueBusinesses: "کسب‌وکارهای در انتظار",
    queueTranslations: "موارد بدون ترجمه",
    queueBusinessesShort: "کسب‌وکارها",
    queueCategories: "دسته‌ها",
    queueProducts: "محصولات",
    stats: {
      reviews: "نظرها",
      orders: "سفارش‌ها",
      claims: "درخواست‌ها",
      businesses: "کسب‌وکارها",
      categories: "دسته‌ها",
      products: "محصولات",
      newLeads: "لیدهای جدید",
      pendingOrders: "سفارش‌های در انتظار",
      pendingReviews: "نظرهای در انتظار",
      pendingClaims: "درخواست‌های باز",
      pendingBusinesses: "کسب‌وکارهای در انتظار",
      users: "کاربران",
      allBusinesses: "همه کسب‌وکارها",
      allReviews: "همه نظرها",
      allOrders: "همه سفارش‌ها",
      translations: "ترجمه‌های این زبان"
    }
  },
  ps: {
    title: "ستاسو ډشبورډ",
    body: "دلته ستاسې مهم کارونه ښکاري، له کاروبار مدیریت نه تر نظرونو پورې.",
    overview: "لنډیز",
    roles: "رولونه",
    noRoles: "تر اوسه رول نشته.",
    quick: "چټک کارونه",
    claim: "د کاروبار مالکیت وغواړئ",
    addBusiness: "نوی کاروبار ثبت کړئ",
    findBusiness: "کاروبارونه وپلټئ",
    admin: "د مدیریت مرکز",
    moderatorCenter: "د ناظر مرکز",
    editorCenter: "د منځپانګې مرکز",
    userSection: "د کارن پینل",
    ownerSection: "د مالک پینل",
    moderatorSection: "د ناظر پینل",
    editorSection: "د منځپانګې پینل",
    adminSection: "د مدیر پینل",
    yourBusinesses: "ستاسې کاروبارونه",
    emptyBusinesses: "تر اوسه کاروبار نه لرئ. یو ثبت یا یې مالکیت وغواړئ.",
    view: "کتل",
    verified: "تایید شوی",
    queue: "د کار لېست",
    queueEmpty: "اوس کوم مورد نه شته.",
    queueReviews: "نوې نظرونه",
    queueClaims: "د مالکیت غوښتنې",
    queueBusinesses: "په تمه کاروبارونه",
    queueTranslations: "بې ژباړې توکي",
    queueBusinessesShort: "کاروبارونه",
    queueCategories: "کټګورۍ",
    queueProducts: "محصولات",
    stats: {
      reviews: "نظرونه",
      orders: "سفارشونه",
      claims: "غوښتنې",
      businesses: "کاروبارونه",
      categories: "کټګورۍ",
      products: "محصولات",
      newLeads: "نوي اړیکې",
      pendingOrders: "په تمه سفارشونه",
      pendingReviews: "په تمه نظرونه",
      pendingClaims: "پرانیستي غوښتنې",
      pendingBusinesses: "په تمه کاروبارونه",
      users: "کاروونکي",
      allBusinesses: "ټول کاروبارونه",
      allReviews: "ټول نظرونه",
      allOrders: "ټول سفارشونه",
      translations: "د دې ژبې ژباړې"
    }
  },
  en: {
    title: "Your dashboard",
    body: "Everything that matters to you, from business control to review quality.",
    overview: "Overview",
    roles: "Your roles",
    noRoles: "No roles assigned yet.",
    quick: "Quick actions",
    claim: "Claim a business",
    addBusiness: "Add a business",
    findBusiness: "Find businesses",
    admin: "Admin center",
    moderatorCenter: "Moderator center",
    editorCenter: "Content center",
    userSection: "Member console",
    ownerSection: "Business owner console",
    moderatorSection: "Moderator console",
    editorSection: "Content console",
    adminSection: "Super admin console",
    yourBusinesses: "Your businesses",
    emptyBusinesses: "No businesses yet. Add one or claim ownership.",
    view: "View",
    verified: "Verified",
    queue: "Work queue",
    queueEmpty: "Nothing to review right now.",
    queueReviews: "Recent reviews",
    queueClaims: "Ownership claims",
    queueBusinesses: "Pending businesses",
    queueTranslations: "Missing translations",
    queueBusinessesShort: "Businesses",
    queueCategories: "Categories",
    queueProducts: "Products",
    stats: {
      reviews: "Reviews",
      orders: "Orders",
      claims: "Claims",
      businesses: "Businesses",
      categories: "Categories",
      products: "Products",
      newLeads: "New leads",
      pendingOrders: "Orders in progress",
      pendingReviews: "Pending reviews",
      pendingClaims: "Open claims",
      pendingBusinesses: "Pending businesses",
      users: "Users",
      allBusinesses: "All businesses",
      allReviews: "All reviews",
      allOrders: "All orders",
      translations: "Translations in this locale"
    }
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
  const roleSet = new Set(roles);
  const isAdmin = roleSet.has("admin");
  const isModerator = roleSet.has("moderator");
  const isEditor = roleSet.has("editor");
  const isOwner = roleSet.has("business_owner");
  const isUser = roleSet.has("user") || roles.length === 0;

  const userStats = isUser
    ? await Promise.all([
        prisma.review.count({ where: { userId: user.id } }),
        prisma.order.count({ where: { userId: user.id } }),
        prisma.businessClaim.count({ where: { userId: user.id } })
      ])
    : null;

  const ownerBusinesses = isOwner
    ? await prisma.business.findMany({
        where: { ownerId: user.id },
        select: {
          id: true,
          slug: true,
          status: true,
          verified: true,
          city: { select: { slug: true } },
          translations: { where: { locale }, select: { name: true } }
        }
      })
    : [];

  const memberBusinesses = isOwner
    ? await prisma.businessMember.findMany({
        where: { userId: user.id },
        select: {
          business: {
            select: {
              id: true,
              slug: true,
              status: true,
              verified: true,
              city: { select: { slug: true } },
              translations: { where: { locale }, select: { name: true } }
            }
          }
        }
      })
    : [];

  const ownerBusinessList = isOwner
    ? Array.from(
        new Map(
          [...ownerBusinesses, ...memberBusinesses.map((item) => item.business)].map((business) => [business.id, business])
        ).values()
      )
    : [];

  const ownerBusinessIds = ownerBusinessList.map((business) => business.id);

  const ownerStats = isOwner && ownerBusinessIds.length
    ? await Promise.all([
        prisma.lead.count({ where: { businessId: { in: ownerBusinessIds }, status: "new" } }),
        prisma.order.count({
          where: {
            businessId: { in: ownerBusinessIds },
            status: { in: ["pending", "confirmed", "preparing"] }
          }
        }),
        prisma.review.count({ where: { businessId: { in: ownerBusinessIds }, approved: false } })
      ])
    : null;

  const moderatorStats = isModerator
    ? await Promise.all([
        prisma.review.count({ where: { approved: false } }),
        prisma.businessClaim.count({ where: { status: "pending" } }),
        prisma.business.count({ where: { status: "pending" } })
      ])
    : null;

  const moderatorQueues = isModerator
    ? await Promise.all([
        prisma.review.findMany({
          where: { approved: false },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            rating: true,
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
          take: 5,
          select: {
            id: true,
            ownerName: true,
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
          take: 5,
          select: {
            id: true,
            slug: true,
            city: { select: { slug: true } },
            translations: { where: { locale }, select: { name: true } }
          }
        })
      ])
    : null;

  const editorStats = isEditor
    ? await Promise.all([
        prisma.businessTranslation.count({ where: { locale } }),
        prisma.categoryTranslation.count({ where: { locale } }),
        prisma.productTranslation.count({ where: { locale } }),
        prisma.business.count(),
        prisma.category.count(),
        prisma.product.count()
      ])
    : null;

  const editorQueues = isEditor
    ? await Promise.all([
        prisma.business.findMany({
          where: { translations: { none: { locale } } },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            slug: true,
            city: { select: { slug: true } }
          }
        }),
        prisma.category.findMany({
          where: { translations: { none: { locale } } },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            slug: true
          }
        }),
        prisma.product.findMany({
          where: { translations: { none: { locale } } },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            slug: true,
            business: {
              select: {
                slug: true,
                city: { select: { slug: true } }
              }
            }
          }
        })
      ])
    : null;

  const adminStats = isAdmin
    ? await Promise.all([
        prisma.user.count(),
        prisma.business.count(),
        prisma.review.count(),
        prisma.order.count()
      ])
    : null;

  const roleLabels: Record<string, string> = {
    user: t.userSection,
    business_owner: t.ownerSection,
    moderator: t.moderatorSection,
    editor: t.editorSection,
    admin: t.adminSection
  };

  const orderedRoles = ["admin", "moderator", "editor", "business_owner", "user"].filter(
    (role) => roleSet.has(role) || (role === "user" && isUser)
  );

  return (
    <section className="dashboard-page" dir={getDirection(locale)}>
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-profile">
            <p className="eyebrow">Paidaco</p>
            <h1>{t.title}</h1>
            <p>{t.body}</p>
            <div className="profile-meta">
              <strong>{user.email}</strong>
              <span>{profile?.name ?? ""}</span>
            </div>
          </div>
          <div className="dashboard-card">
            <h2>{t.roles}</h2>
            {orderedRoles.length ? (
              <div className="role-list">
                {orderedRoles.map((role) => (
                  <span key={role}>{roleLabels[role]}</span>
                ))}
              </div>
            ) : (
              <p>{t.noRoles}</p>
            )}
          </div>
          <div className="dashboard-card">
            <h2>{t.quick}</h2>
            <div className="dashboard-actions">
              <Link href={localePath(locale, "/claim-business")}>{t.claim}</Link>
              <Link href={localePath(locale, "/add-business")}>{t.addBusiness}</Link>
              <Link href={localePath(locale, "/search")}>{t.findBusiness}</Link>
              {isModerator ? <Link href={localePath(locale, "/moderator")}>{t.moderatorCenter}</Link> : null}
              {isEditor ? <Link href={localePath(locale, "/editor")}>{t.editorCenter}</Link> : null}
              {isAdmin ? <Link href={localePath(locale, "/admin")}>{t.admin}</Link> : null}
            </div>
          </div>
        </aside>

        <div className="dashboard-main">
          <section className="dashboard-hero">
            <div>
              <p className="eyebrow">{t.overview}</p>
              <h2>{t.title}</h2>
              <p>{t.body}</p>
            </div>
            <div className="dashboard-hero-card">
              <span>{t.roles}</span>
              <div className="role-list">
                {orderedRoles.map((role) => (
                  <span key={role}>{roleLabels[role]}</span>
                ))}
              </div>
            </div>
          </section>

          {isUser && userStats ? (
            <section className="dashboard-section">
              <div className="section-head">
                <h3>{t.userSection}</h3>
              </div>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <strong>{userStats[0]}</strong>
                  <span>{t.stats.reviews}</span>
                </div>
                <div className="kpi-card">
                  <strong>{userStats[1]}</strong>
                  <span>{t.stats.orders}</span>
                </div>
                <div className="kpi-card">
                  <strong>{userStats[2]}</strong>
                  <span>{t.stats.claims}</span>
                </div>
              </div>
            </section>
          ) : null}

          {isOwner ? (
            <section className="dashboard-section">
              <div className="section-head">
                <h3>{t.ownerSection}</h3>
                <span className="section-note">{t.yourBusinesses}</span>
              </div>
              {ownerStats ? (
                <div className="kpi-grid">
                  <div className="kpi-card">
                    <strong>{ownerStats[0]}</strong>
                    <span>{t.stats.newLeads}</span>
                  </div>
                  <div className="kpi-card">
                    <strong>{ownerStats[1]}</strong>
                    <span>{t.stats.pendingOrders}</span>
                  </div>
                  <div className="kpi-card">
                    <strong>{ownerStats[2]}</strong>
                    <span>{t.stats.pendingReviews}</span>
                  </div>
                </div>
              ) : null}
              <div className="business-list">
                {ownerBusinessList.length ? (
                  ownerBusinessList.map((business) => (
                    <div className="business-row" key={business.id}>
                      <div>
                        <strong>{business.translations[0]?.name ?? business.slug}</strong>
                        <span className="muted">{business.slug}</span>
                      </div>
                      <div className="business-tags">
                        <span className={`status-pill status-${business.status}`}>{business.status}</span>
                        {business.verified ? <span className="status-pill status-verified">{t.verified}</span> : null}
                        <Link className="inline-link" href={localePath(locale, `/business/${business.city.slug}/${business.slug}`)}>
                          {t.view}
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <strong>{t.emptyBusinesses}</strong>
                  </div>
                )}
              </div>
            </section>
          ) : null}

          {isModerator && moderatorStats ? (
            <section className="dashboard-section">
              <div className="section-head">
                <h3>{t.moderatorSection}</h3>
                <span className="section-note">{t.queue}</span>
              </div>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <strong>{moderatorStats[0]}</strong>
                  <span>{t.stats.pendingReviews}</span>
                </div>
                <div className="kpi-card">
                  <strong>{moderatorStats[1]}</strong>
                  <span>{t.stats.pendingClaims}</span>
                </div>
                <div className="kpi-card">
                  <strong>{moderatorStats[2]}</strong>
                  <span>{t.stats.pendingBusinesses}</span>
                </div>
              </div>
              {moderatorQueues ? (
                <div className="queue-grid">
                  <div className="queue-card">
                    <div className="queue-head">
                      <h4>{t.queueReviews}</h4>
                      <span className="queue-count">{moderatorStats[0]}</span>
                    </div>
                    <div className="queue-list">
                      {moderatorQueues[0].length ? (
                        moderatorQueues[0].map((review) => (
                          <div className="queue-item" key={review.id}>
                            <div>
                              <strong>{review.business.translations[0]?.name ?? review.business.slug}</strong>
                              <span className="queue-meta">{t.stats.reviews} · {review.rating}/5</span>
                            </div>
                            <Link
                              className="inline-link"
                              href={localePath(locale, `/business/${review.business.city.slug}/${review.business.slug}`)}
                            >
                              {t.view}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="empty-note">{t.queueEmpty}</p>
                      )}
                    </div>
                  </div>
                  <div className="queue-card">
                    <div className="queue-head">
                      <h4>{t.queueClaims}</h4>
                      <span className="queue-count">{moderatorStats[1]}</span>
                    </div>
                    <div className="queue-list">
                      {moderatorQueues[1].length ? (
                        moderatorQueues[1].map((claim) => (
                          <div className="queue-item" key={claim.id}>
                            <div>
                              <strong>{claim.business.translations[0]?.name ?? claim.business.slug}</strong>
                              <span className="queue-meta">{claim.ownerName}</span>
                            </div>
                            <Link
                              className="inline-link"
                              href={localePath(locale, `/business/${claim.business.city.slug}/${claim.business.slug}`)}
                            >
                              {t.view}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="empty-note">{t.queueEmpty}</p>
                      )}
                    </div>
                  </div>
                  <div className="queue-card">
                    <div className="queue-head">
                      <h4>{t.queueBusinesses}</h4>
                      <span className="queue-count">{moderatorStats[2]}</span>
                    </div>
                    <div className="queue-list">
                      {moderatorQueues[2].length ? (
                        moderatorQueues[2].map((business) => (
                          <div className="queue-item" key={business.id}>
                            <div>
                              <strong>{business.translations[0]?.name ?? business.slug}</strong>
                              <span className="queue-meta">{business.slug}</span>
                            </div>
                            <Link
                              className="inline-link"
                              href={localePath(locale, `/business/${business.city.slug}/${business.slug}`)}
                            >
                              {t.view}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="empty-note">{t.queueEmpty}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {isEditor && editorStats ? (
            <section className="dashboard-section">
              <div className="section-head">
                <h3>{t.editorSection}</h3>
                <span className="section-note">{t.stats.translations}</span>
              </div>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <strong>{editorStats[0]}</strong>
                  <span>{t.stats.businesses}</span>
                </div>
                <div className="kpi-card">
                  <strong>{editorStats[1]}</strong>
                  <span>{t.stats.categories}</span>
                </div>
                <div className="kpi-card">
                  <strong>{editorStats[2]}</strong>
                  <span>{t.stats.products}</span>
                </div>
              </div>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <strong>{editorStats[3]}</strong>
                  <span>{t.stats.allBusinesses}</span>
                </div>
                <div className="kpi-card">
                  <strong>{editorStats[4]}</strong>
                  <span>{t.stats.categories}</span>
                </div>
                <div className="kpi-card">
                  <strong>{editorStats[5]}</strong>
                  <span>{t.stats.products}</span>
                </div>
              </div>
              {editorQueues ? (
                <div className="queue-grid">
                  <div className="queue-card">
                    <div className="queue-head">
                      <h4>{t.queueBusinessesShort}</h4>
                      <span className="queue-count">{editorQueues[0].length}</span>
                    </div>
                    <div className="queue-list">
                      {editorQueues[0].length ? (
                        editorQueues[0].map((business) => (
                          <div className="queue-item" key={business.id}>
                            <div>
                              <strong>{business.slug}</strong>
                              <span className="queue-meta">{t.queueTranslations}</span>
                            </div>
                            <Link
                              className="inline-link"
                              href={localePath(locale, `/business/${business.city.slug}/${business.slug}`)}
                            >
                              {t.view}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="empty-note">{t.queueEmpty}</p>
                      )}
                    </div>
                  </div>
                  <div className="queue-card">
                    <div className="queue-head">
                      <h4>{t.queueCategories}</h4>
                      <span className="queue-count">{editorQueues[1].length}</span>
                    </div>
                    <div className="queue-list">
                      {editorQueues[1].length ? (
                        editorQueues[1].map((category) => (
                          <div className="queue-item" key={category.id}>
                            <div>
                              <strong>{category.slug}</strong>
                              <span className="queue-meta">{t.queueTranslations}</span>
                            </div>
                            <Link className="inline-link" href={localePath(locale, `/category/${category.slug}`)}>
                              {t.view}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="empty-note">{t.queueEmpty}</p>
                      )}
                    </div>
                  </div>
                  <div className="queue-card">
                    <div className="queue-head">
                      <h4>{t.queueProducts}</h4>
                      <span className="queue-count">{editorQueues[2].length}</span>
                    </div>
                    <div className="queue-list">
                      {editorQueues[2].length ? (
                        editorQueues[2].map((product) => (
                          <div className="queue-item" key={product.id}>
                            <div>
                              <strong>{product.slug}</strong>
                              <span className="queue-meta">{product.business.slug}</span>
                            </div>
                            <Link
                              className="inline-link"
                              href={localePath(locale, `/business/${product.business.city.slug}/${product.business.slug}`)}
                            >
                              {t.view}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="empty-note">{t.queueEmpty}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {isAdmin && adminStats ? (
            <section className="dashboard-section">
              <div className="section-head">
                <h3>{t.adminSection}</h3>
              </div>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <strong>{adminStats[0]}</strong>
                  <span>{t.stats.users}</span>
                </div>
                <div className="kpi-card">
                  <strong>{adminStats[1]}</strong>
                  <span>{t.stats.allBusinesses}</span>
                </div>
                <div className="kpi-card">
                  <strong>{adminStats[2]}</strong>
                  <span>{t.stats.allReviews}</span>
                </div>
                <div className="kpi-card">
                  <strong>{adminStats[3]}</strong>
                  <span>{t.stats.allOrders}</span>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}
