const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const metaHeroes = [
  { hero: 'Iggy', tier: 'SS Tier' },
  { hero: 'Liliana', tier: 'SS Tier' },
  { hero: 'Krixi', tier: 'SS Tier' },
  { hero: 'Raz', tier: 'SS Tier' },
  { hero: 'Aleister', tier: 'A Tier' },
  { hero: 'Yena', tier: 'SS Tier' },
  { hero: 'Bijan', tier: 'SS Tier' },
  { hero: 'Florentino', tier: 'SS Tier' },
  { hero: 'Yan', tier: 'SS Tier' },
  { hero: 'Richter', tier: 'A Tier' },
  { hero: 'Slimz', tier: 'SS Tier' },
  { hero: 'Stuart', tier: 'SS Tier' },
  { hero: 'Violet', tier: 'SS Tier' },
  { hero: 'Erin', tier: 'SS Tier' },
  { hero: 'Zip', tier: 'SS Tier' },
  { hero: 'Aya', tier: 'SS Tier' },
  { hero: 'Xeniel', tier: 'SS Tier' },
  { hero: 'Baldum', tier: 'SS Tier' },
  { hero: 'Nakroth', tier: 'SS Tier' },
  { hero: 'Tulen', tier: 'SS Tier' }
];

async function main() {
  for (const { hero, tier } of metaHeroes) {
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
