const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Show all attack items
  const attack = await prisma.item.findMany({ where: { category: 'Attack' }, orderBy: { name: 'asc' } });
  console.log('Attack items slugs:');
  attack.forEach(i => console.log(`  "${i.name}" -> "${i.slug}"`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
