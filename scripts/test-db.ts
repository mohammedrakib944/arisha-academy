import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
    console.log("Testing database connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    try {
        await prisma.$connect();
        console.log("Successfully connected to database!");

        const userCount = await prisma.user.count();
        console.log(`Found ${userCount} users.`);

    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
