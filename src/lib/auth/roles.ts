import { prisma } from "@/lib/prisma";

export const defaultRoles = [
  { key: "user", name: "User", description: "Normal signed-in user" },
  { key: "business_owner", name: "Business Owner", description: "Can manage claimed businesses" },
  { key: "moderator", name: "Moderator", description: "Can moderate listings, reviews, and reports" },
  { key: "editor", name: "Editor", description: "Can manage blogs, guides, SEO pages, and translations" },
  { key: "admin", name: "Admin", description: "Full platform access" }
];

export async function ensureDefaultRoles() {
  await Promise.all(
    defaultRoles.map((role) =>
      prisma.role.upsert({
        where: { key: role.key },
        update: role,
        create: role
      })
    )
  );
}

export async function assignRole(userId: string, roleKey: string) {
  const role = await prisma.role.upsert({
    where: { key: roleKey },
    update: {},
    create: {
      key: roleKey,
      name: roleKey
        .split("_")
        .map((part) => part[0]?.toUpperCase() + part.slice(1))
        .join(" "),
      isSystem: true
    }
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id
      }
    },
    update: {},
    create: {
      userId,
      roleId: role.id
    }
  });

  return role;
}

export async function userHasRole(userId: string, roleKey: string) {
  const count = await prisma.userRole.count({
    where: {
      userId,
      role: {
        key: roleKey
      }
    }
  });

  return count > 0;
}
