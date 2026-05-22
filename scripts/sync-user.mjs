import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });

const userId = process.argv[2]?.trim();
const email = process.argv[3]?.trim().toLowerCase();

if (!userId || !email) {
  console.error("Usage: node scripts/sync-user.mjs <supabase-uid> <email>");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {
      email
    },
    create: {
      id: userId,
      email,
      role: "user"
    }
  });

  console.log(`Synced user: ${user.email} (${user.id})`);
} finally {
  await prisma.$disconnect();
}
