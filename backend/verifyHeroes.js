const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

prisma.hero.findMany({ include: { skills: true } }).then(heroes => { 
  const missingSkills = heroes.filter(h => h.skills.length === 0); 
  const missingItems = heroes.filter(h => !h.recommendedItems || h.recommendedItems.length === 0); 
  console.log(`Total heroes: ${heroes.length}`); 
  console.log(`Heroes missing skills: ${missingSkills.length}`);
  if (missingSkills.length > 0) console.log(missingSkills.map(h => h.name).join(', '));
  console.log(`Heroes missing items: ${missingItems.length}`);
  if (missingItems.length > 0) console.log(missingItems.map(h => h.name).join(', '));
  process.exit(0); 
});
