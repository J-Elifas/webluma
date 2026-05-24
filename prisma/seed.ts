import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hash } from "bcryptjs";

config({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL");
}

const adapter = new PrismaMariaDb(databaseUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await hash("test123", 12);

    await prisma.user.upsert({
        where: {
            email: "demo@example.com",
        },
        update: {
            password: hashedPassword,
        },
        create: {
            name: "Demo User",
            email: "demo@example.com",
            password: hashedPassword,
            role: "USER",
        },
    });

    console.log("Seed completed");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
