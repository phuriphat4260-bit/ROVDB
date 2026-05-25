const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.hero.count();
    console.log('Hero count:', count);
    if (count > 0) {
      const first = await prisma.hero.findFirst();
      console.log('First hero:', JSON.stringify(first, null, 2));
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
