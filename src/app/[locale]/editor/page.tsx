import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncAuthUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";
import { StatusToast } from "@/components/StatusToast";
import { TranslationForm } from "@/components/TranslationForm";
import { getDirection, isLocale, localePath, type Locale } from "@/lib/i18n";

const copy = {
  fa: {
    title: "مرکز محتوا",
    body: "موارد بدون ترجمه را بررسی کنید و محتوا را کامل کنید.",
    businesses: "کسب‌وکارهای بدون ترجمه",
    categories: "دسته‌های بدون ترجمه",
    products: "محصولات بدون ترجمه",
    empty: "موردی برای بررسی نیست.",
    view: "مشاهده",
    nameLabel: "نام",
    descriptionLabel: "توضیحات",
    save: "ذخیره ترجمه",
    toastSaved: "ترجمه ذخیره شد.",
    toastMissing: "نام را وارد کنید و دوباره تلاش کنید.",
    requiredText: "ضروری",
    maxHintLabel: "حداکثر"
  },
  ps: {
    title: "د منځپانګې مرکز",
    body: "بې ژباړې توکي وګورئ او محتوا بشپړ کړئ.",
    businesses: "بې ژباړې کاروبارونه",
    categories: "بې ژباړې کټګورۍ",
    products: "بې ژباړې محصولات",
    empty: "اوس کوم مورد نه شته.",
    view: "کتل",
    nameLabel: "نوم",
    descriptionLabel: "تشریح",
    save: "ژباړه خوندي کړئ",
    toastSaved: "ژباړه خوندي شوه.",
    toastMissing: "نوم وليکئ او بيا هڅه وکړئ.",
    requiredText: "اړين",
    maxHintLabel: "اعظمي"
  },
  en: {
    title: "Content center",
    body: "Review missing translations and complete localized content.",
    businesses: "Businesses missing translations",
    categories: "Categories missing translations",
    products: "Products missing translations",
    empty: "Nothing to review right now.",
    view: "View",
    nameLabel: "Name",
    descriptionLabel: "Description",
    save: "Save translation",
    toastSaved: "Translation saved.",
    toastMissing: "Please enter a name and try again.",
    requiredText: "Required",
    maxHintLabel: "Max"
  }
} as const;

async function requireEditor(locale: Locale) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect(localePath(locale, "/login"));

  await syncAuthUser(user);

  const role = await prisma.userRole.findFirst({
    where: {
      userId: user.id,
      role: { key: "editor" }
    }
  });

  if (!role) redirect(localePath(locale, "/dashboard"));

  return user;
}

async function saveBusinessTranslationAction(formData: FormData) {
  "use server";
  const locale = String(formData.get("locale") ?? "fa") as Locale;
  const businessId = String(formData.get("businessId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const nextAnchor = String(formData.get("nextAnchor") ?? "");

  const basePath = localePath(locale, "/editor");
  const nextHash = nextAnchor ? `#${nextAnchor}` : "";

  if (!businessId || !name) {
    redirect(`${basePath}?status=missing_name${nextHash}`);
  }

  await requireEditor(locale);

  await prisma.businessTranslation.upsert({
    where: {
      businessId_locale: {
        businessId,
        locale
      }
    },
    update: {
      name,
      description: description.length ? description : null
    },
    create: {
      businessId,
      locale,
      name,
      description: description.length ? description : null
    }
  });

  revalidatePath(basePath);
  redirect(`${basePath}?status=saved${nextHash}`);
}

async function saveCategoryTranslationAction(formData: FormData) {
  "use server";
  const locale = String(formData.get("locale") ?? "fa") as Locale;
  const categoryId = String(formData.get("categoryId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const nextAnchor = String(formData.get("nextAnchor") ?? "");

  const basePath = localePath(locale, "/editor");
  const nextHash = nextAnchor ? `#${nextAnchor}` : "";

  if (!categoryId || !name) {
    redirect(`${basePath}?status=missing_name${nextHash}`);
  }

  await requireEditor(locale);

  await prisma.categoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId,
        locale
      }
    },
    update: {
      name,
      description: description.length ? description : null
    },
    create: {
      categoryId,
      locale,
      name,
      description: description.length ? description : null
    }
  });

  revalidatePath(basePath);
  redirect(`${basePath}?status=saved${nextHash}`);
}

async function saveProductTranslationAction(formData: FormData) {
  "use server";
  const locale = String(formData.get("locale") ?? "fa") as Locale;
  const productId = String(formData.get("productId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const nextAnchor = String(formData.get("nextAnchor") ?? "");

  const basePath = localePath(locale, "/editor");
  const nextHash = nextAnchor ? `#${nextAnchor}` : "";

  if (!productId || !name) {
    redirect(`${basePath}?status=missing_name${nextHash}`);
  }

  await requireEditor(locale);

  await prisma.productTranslation.upsert({
    where: {
      productId_locale: {
        productId,
        locale
      }
    },
    update: {
      name,
      description: description.length ? description : null
    },
    create: {
      productId,
      locale,
      name,
      description: description.length ? description : null
    }
  });

  revalidatePath(basePath);
  redirect(`${basePath}?status=saved${nextHash}`);
}

export default async function EditorPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ status?: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) redirect("/fa/editor");

  const locale = rawLocale as Locale;
  await requireEditor(locale);

  const [businesses, categories, products] = await Promise.all([
    prisma.business.findMany({
      where: { translations: { none: { locale } } },
      orderBy: { createdAt: "desc" },
      take: 16,
      select: {
        id: true,
        slug: true,
        city: { select: { slug: true } }
      }
    }),
    prisma.category.findMany({
      where: { translations: { none: { locale } } },
      orderBy: { createdAt: "desc" },
      take: 16,
      select: {
        id: true,
        slug: true
      }
    }),
    prisma.product.findMany({
      where: { translations: { none: { locale } } },
      orderBy: { createdAt: "desc" },
      take: 16,
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
  ]);

  const t = copy[locale];
  const status = (await searchParams)?.status ?? null;

  return (
    <section className="dashboard-page" dir={getDirection(locale)}>
      <div className="moderation-shell">
        <header className="moderation-hero">
          <p className="eyebrow">Paidaco</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </header>
        <StatusToast status={status} savedText={t.toastSaved} missingText={t.toastMissing} />

        <section className="moderation-section">
          <div className="section-head">
            <h2>{t.businesses}</h2>
          </div>
          {businesses.length ? (
            <div className="moderation-list">
              {businesses.map((business, index) => {
                const nextAnchor = businesses[index + 1] ? `business-${businesses[index + 1].id}` : null;
                return (
                <div className="moderation-row" key={business.id} id={`business-${business.id}`}>
                  <div>
                    <strong>{business.slug}</strong>
                    <span className="queue-meta">{business.slug}</span>
                  </div>
                  <div className="moderation-actions">
                    <Link
                      className="inline-link"
                      href={localePath(locale, `/business/${business.city.slug}/${business.slug}`)}
                    >
                      {t.view}
                    </Link>
                  </div>
                  <TranslationForm
                    action={saveBusinessTranslationAction}
                    locale={locale}
                    entityId={business.id}
                    entityField="businessId"
                    nameLabel={t.nameLabel}
                    descriptionLabel={t.descriptionLabel}
                    saveLabel={t.save}
                    requiredText={t.requiredText}
                    maxHintLabel={t.maxHintLabel}
                    nextAnchor={nextAnchor}
                  />
                </div>
              );
              })}
            </div>
          ) : (
            <p className="empty-note">{t.empty}</p>
          )}
        </section>

        <section className="moderation-section">
          <div className="section-head">
            <h2>{t.categories}</h2>
          </div>
          {categories.length ? (
            <div className="moderation-list">
              {categories.map((category, index) => {
                const nextAnchor = categories[index + 1] ? `category-${categories[index + 1].id}` : null;
                return (
                <div className="moderation-row" key={category.id} id={`category-${category.id}`}>
                  <div>
                    <strong>{category.slug}</strong>
                    <span className="queue-meta">{category.slug}</span>
                  </div>
                  <div className="moderation-actions">
                    <Link className="inline-link" href={localePath(locale, `/category/${category.slug}`)}>
                      {t.view}
                    </Link>
                  </div>
                  <TranslationForm
                    action={saveCategoryTranslationAction}
                    locale={locale}
                    entityId={category.id}
                    entityField="categoryId"
                    nameLabel={t.nameLabel}
                    descriptionLabel={t.descriptionLabel}
                    saveLabel={t.save}
                    requiredText={t.requiredText}
                    maxHintLabel={t.maxHintLabel}
                    nextAnchor={nextAnchor}
                  />
                </div>
              );
              })}
            </div>
          ) : (
            <p className="empty-note">{t.empty}</p>
          )}
        </section>

        <section className="moderation-section">
          <div className="section-head">
            <h2>{t.products}</h2>
          </div>
          {products.length ? (
            <div className="moderation-list">
              {products.map((product, index) => {
                const nextAnchor = products[index + 1] ? `product-${products[index + 1].id}` : null;
                return (
                <div className="moderation-row" key={product.id} id={`product-${product.id}`}>
                  <div>
                    <strong>{product.slug}</strong>
                    <span className="queue-meta">{product.business.slug}</span>
                  </div>
                  <div className="moderation-actions">
                    <Link
                      className="inline-link"
                      href={localePath(locale, `/business/${product.business.city.slug}/${product.business.slug}`)}
                    >
                      {t.view}
                    </Link>
                  </div>
                  <TranslationForm
                    action={saveProductTranslationAction}
                    locale={locale}
                    entityId={product.id}
                    entityField="productId"
                    nameLabel={t.nameLabel}
                    descriptionLabel={t.descriptionLabel}
                    saveLabel={t.save}
                    requiredText={t.requiredText}
                    maxHintLabel={t.maxHintLabel}
                    nextAnchor={nextAnchor}
                  />
                </div>
              );
              })}
            </div>
          ) : (
            <p className="empty-note">{t.empty}</p>
          )}
        </section>
      </div>
    </section>
  );
}
