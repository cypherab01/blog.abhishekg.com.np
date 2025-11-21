import "dotenv/config";
import { PrismaClient, RoleName, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const count = await prisma.role.count();
  if (count === 0) {
    await prisma.role.createMany({
      data: [{ name: RoleName.ADMIN }, { name: RoleName.BLOGGER }],
      skipDuplicates: true,
    });
  }
}

main();
