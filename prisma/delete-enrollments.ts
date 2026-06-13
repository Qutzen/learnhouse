import "dotenv/config";
import { prisma } from "../lib/db";

async function main() {
  const result = await prisma.enrollment.deleteMany();

  console.log(`Deleted ${result.count} enrollments`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
