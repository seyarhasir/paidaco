import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });

const prisma = new PrismaClient();

const roles = [
  { key: "user", name: "User", description: "Normal signed-in user" },
  { key: "business_owner", name: "Business Owner", description: "Can manage claimed businesses" },
  { key: "moderator", name: "Moderator", description: "Can moderate listings, reviews, and reports" },
  { key: "editor", name: "Editor", description: "Can manage blogs, guides, SEO pages, and translations" },
  { key: "admin", name: "Admin", description: "Full platform access" }
];

try {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: role,
      create: role
    });
  }
  console.log(`Seeded ${roles.length} roles.`);
} finally {
  await prisma.$disconnect();
}
