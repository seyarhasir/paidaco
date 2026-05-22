import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: npm run admin:grant -- user@example.com");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error(`No Paidaco user found for ${email}. Ask them to register/login first.`);
    process.exit(1);
  }

  const adminRole = await prisma.role.upsert({
    where: { key: "admin" },
    update: {
      name: "Admin",
      description: "Full platform access"
    },
    create: {
      key: "admin",
      name: "Admin",
      description: "Full platform access",
      isSystem: true
    }
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: adminRole.id
      }
    },
    update: {},
    create: {
      userId: user.id,
      roleId: adminRole.id
    }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "admin" }
  });

  console.log(`${email} is now an admin.`);
} finally {
  await prisma.$disconnect();
}
