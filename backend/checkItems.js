const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hero = await prisma.hero.findFirst({
    where: { recommendedItems: { not: null } }
  });
  if (hero) {
    console.log('Hero:', hero.name);
    console.log('Items:', JSON.stringify(hero.recommendedItems, null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
