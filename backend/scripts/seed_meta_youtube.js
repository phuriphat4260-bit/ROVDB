const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const youtubeMetaHeroes = [
  { hero: 'Nakroth', tier: 'SS Tier' },
  { hero: 'Astrid', tier: 'SS Tier' },
  { hero: 'Paine', tier: 'SS Tier' },
  { hero: 'Y\'bneth', tier: 'SS Tier' },
  { hero: 'Arduin', tier: 'SS Tier' },
  { hero: 'Violet', tier: 'SS Tier' },
  { hero: 'Laville', tier: 'SS Tier' }
];

// Richmanshop missing heroes from earlier that might need another check
const extraMetaHeroes = [
  { hero: 'Joker', tier: 'SS Tier' }, // Stuart
  { hero: 'Eland\'orr', tier: 'SS Tier' } // Erin
];

async function main() {
  const allHeroes = [...youtubeMetaHeroes, ...extraMetaHeroes];
  
  for (const { hero, tier } of allHeroes) {
    const dbHero = await prisma.hero.findFirst({
      where: {
        name: {
          equals: hero,
          mode: 'insensitive',
        }
      }
    });

    if (dbHero) {
      await prisma.hero.update({
        where: { id: dbHero.id },
        data: { metaTier: tier }
      });
      console.log(`Updated ${hero} to ${tier}`);
    } else {
      console.log(`Hero not found: ${hero}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
