import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { syncAuthUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";
import { getDirection, isLocale, localePath, type Locale } from "@/lib/i18n";
import { EditorDashboardShell } from "@/components/EditorDashboardShell";

async function requireEditor(locale: Locale) {
  const user = await getCurrentUser("editor auth");

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

export default async function EditorPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) redirect("/fa/editor");

  const locale = rawLocale as Locale;
  await requireEditor(locale);

  // Fetch items missing translation in the current locale
  const businesses = await prisma.business.findMany({
    where: { translations: { none: { locale } } },
    orderBy: { createdAt: "desc" },
    take: 16,
    select: {
      id: true,
      slug: true,
      city: { select: { slug: true } }
    }
  });

  const categories = await prisma.category.findMany({
    where: { translations: { none: { locale } } },
    orderBy: { createdAt: "desc" },
    take: 16,
    select: {
      id: true,
      slug: true
    }
  });

  const products = await prisma.product.findMany({
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
  });

  // Actions for translations
  const handleSaveBusinessTranslation = async (formData: FormData) => {
    "use server";
    const businessId = String(formData.get("businessId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!businessId || !name) return;

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

    revalidatePath("/[locale]/editor", "page");
  };

  const handleSaveCategoryTranslation = async (formData: FormData) => {
    "use server";
    const categoryId = String(formData.get("categoryId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!categoryId || !name) return;

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

    revalidatePath("/[locale]/editor", "page");
  };

  const handleSaveProductTranslation = async (formData: FormData) => {
    "use server";
    const productId = String(formData.get("productId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!productId || !name) return;

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

    revalidatePath("/[locale]/editor", "page");
  };

  return (
    <section className="dashboard-page" dir={getDirection(locale)}>
      <div className="container">
        <EditorDashboardShell
          locale={locale}
          businesses={businesses}
          categories={categories}
          products={products}
          saveBusinessTranslation={handleSaveBusinessTranslation}
          saveCategoryTranslation={handleSaveCategoryTranslation}
          saveProductTranslation={handleSaveProductTranslation}
        />
      </div>
    </section>
  );
}
