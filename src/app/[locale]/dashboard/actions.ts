"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { LeadStatus, Locale } from "@prisma/client";

export async function deleteReviewAction(id: string) {
  await prisma.review.delete({
    where: { id }
  });
  revalidatePath("/[locale]/dashboard", "page");
}

export async function updateProfileAction(userId: string, data: { name: string; phone: string }) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone
    }
  });
  revalidatePath("/[locale]/dashboard", "page");
}

export async function updateListingAction(businessId: string, data: any, locale: Locale) {
  const latitude = Number(data.latitude);
  const longitude = Number(data.longitude);

  await prisma.business.update({
    where: { id: businessId },
    data: {
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      address: data.address || null,
      latitude: Number.isFinite(latitude) ? latitude : null,
      longitude: Number.isFinite(longitude) ? longitude : null,
      priceRange: data.priceRange || null
    }
  });

  const existingTranslation = await prisma.businessTranslation.findFirst({
    where: { businessId, locale }
  });

  if (existingTranslation) {
    await prisma.businessTranslation.update({
      where: { id: existingTranslation.id },
      data: {
        name: data.name,
        description: data.description || null
      }
    });
  } else {
    await prisma.businessTranslation.create({
      data: {
        businessId,
        locale,
        name: data.name,
        description: data.description || null
      }
    });
  }
  revalidatePath("/[locale]/dashboard", "page");
}

export async function updateLeadStatusAction(leadId: string, status: string) {
  let dbStatus: LeadStatus = "new";
  if (status === "contacted") {
    dbStatus = "contacted";
  } else if (status === "closed" || status === "won") {
    dbStatus = "won";
  } else if (status === "lost") {
    dbStatus = "lost";
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { status: dbStatus }
  });
  revalidatePath("/[locale]/dashboard", "page");
}
