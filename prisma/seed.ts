import "dotenv/config";
import { PrismaClient } from "../generated/prisma-client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

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

  // Hash password for admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Check if admin user exists and delete it first to avoid constraint issues
  const existingUser = await prisma.user.findUnique({
    where: { phoneNumber: "01234567890" },
  });

  if (existingUser) {
    console.log("🔄 Found existing admin user, deleting...");
    await prisma.user.delete({
      where: { phoneNumber: "01234567890" },
    });
    console.log("✅ Deleted existing admin user");
  }

  // Create default admin user
  const adminUser = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      username: "Admin User",
      phoneNumber: "01234567890",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Created admin user:", adminUser);
  console.log("👤 Name: Admin User");
  console.log("📧 Username: Admin User");
  console.log("📱 Phone Number: 01234567890");
  console.log("🔑 Role: ADMIN");
  console.log("🔒 Password: admin123 (default)");

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
