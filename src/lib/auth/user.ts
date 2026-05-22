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

  await assignRole(profile.id, "user");

  return profile;
}
