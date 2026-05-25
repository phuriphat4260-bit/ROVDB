const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateClasses() {
  console.log('Fetching hero list from official ROV API...');
  try {
    const { data } = await axios.get('https://rov.in.th/api/v2/getHeroList');
    
    if (data.status && data.data && data.data.heroes) {
      const heroes = data.data.heroes;
      console.log(`Found ${heroes.length} heroes from API. Updating database...`);
      
      let updatedCount = 0;
      for (const hero of heroes) {
        const classes = [hero.role_text, hero.role_second_text].filter(Boolean);
        
        const dbHero = await prisma.hero.findFirst({
          where: { slug: hero.slug }
        });
        
        if (dbHero) {
          await prisma.hero.update({
            where: { id: dbHero.id },
            data: { classes: classes }
          });
          updatedCount++;
        } else {
           // Fallback to searching by case-insensitive name just in case slug differs
           const altHero = await prisma.hero.findFirst({
              where: { name: { equals: hero.name, mode: 'insensitive' } }
           });
           if (altHero) {
              await prisma.hero.update({
                 where: { id: altHero.id },
                 data: { classes: classes }
              });
              updatedCount++;
           }
        }
      }
      
      console.log(`Successfully updated classes for ${updatedCount} heroes!`);
    } else {
      console.log('Failed to parse API response structure.');
    }
  } catch (err) {
    console.error('Error updating classes:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateClasses();
