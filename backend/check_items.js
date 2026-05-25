const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkItemMatches() {
  const heroes = await prisma.hero.findMany({ select: { name: true, recommendedItems: true } });
  let totalItems = 0;
  let matchedItems = 0;
  let missingNames = new Set();

  for (const hero of heroes) {
    if (hero.recommendedItems) {
      for (const recItem of hero.recommendedItems) {
        totalItems++;
        
        // Find matching item by slug
        const slug = recItem.name.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const item = await prisma.item.findUnique({ where: { slug } });
        
        if (item) {
          matchedItems++;
        } else {
          missingNames.add(recItem.name);
        }
      }
    }
  }

  console.log(`Matched: ${matchedItems} / ${totalItems}`);
  console.log(`Missing unique items (${missingNames.size}):`);
  Array.from(missingNames).sort().forEach(name => console.log(` - ${name}`));
}

checkItemMatches().finally(() => prisma.$disconnect());
