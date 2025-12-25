import "dotenv/config";
import { PrismaClient } from "../generated/prisma-client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ Error: DATABASE_URL environment variable is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { phoneNumber: "01234567890" },
    update: {
      username: "admin",
      role: "ADMIN",
    },
    create: {
      username: "admin",
      phoneNumber: "01234567890",
      role: "ADMIN",
    },
  });

  console.log("✅ Created admin user:", adminUser);
  console.log("📧 Username: admin");
  console.log("📱 Phone Number: 01234567890");
  console.log("🔑 Role: ADMIN");

  console.log("✨ Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
