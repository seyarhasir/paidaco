import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { assignRole, ensureDefaultRoles } from "@/lib/auth/roles";

export async function syncAuthUser(user: SupabaseUser) {
  const email = user.email;
  if (!email) return null;

  await ensureDefaultRoles();

  const profile = await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email,
      name:
        typeof user.user_metadata?.name === "string"
          ? user.user_metadata.name
          : typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : undefined
    },
    create: {
      id: user.id,
      email,
      name:
        typeof user.user_metadata?.name === "string"
          ? user.user_metadata.name
          : typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : null,
      role: "user"
    }
  });

  const userRoles = await prisma.userRole.findMany({
    where: { userId: profile.id },
    include: { role: true }
  });

  const roleKeys = userRoles.map((ur) => ur.role.key);

  if (roleKeys.length === 0) {
    await assignRole(profile.id, "user");
  } else if (roleKeys.includes("admin") || roleKeys.includes("editor") || roleKeys.includes("moderator")) {
    if (roleKeys.includes("user")) {
      const userRoleRecord = userRoles.find((ur) => ur.role.key === "user");
      if (userRoleRecord) {
        await prisma.userRole.delete({
          where: {
            userId_roleId: {
              userId: profile.id,
              roleId: userRoleRecord.roleId
            }
          }
        });
      }
    }
  }

  return profile;
}
