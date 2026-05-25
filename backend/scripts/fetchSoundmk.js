const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const { data } = await axios.get('https://soundmk.com/rov/item');
  const $ = cheerio.load(data);
  const items = [];
  
  $('.card').each((i, el) => {
    const name = $(el).find('.card-title').text().trim();
    const img = $(el).find('img').attr('src');
    if (name && img) {
      items.push({ name, img });
    }
  });

  console.log(`Found ${items.length} items from soundmk.com`);
  
  // Update DB
  let updatedCount = 0;
  for (const item of items) {
    const dbItem = await prisma.item.findFirst({
      where: { name: { equals: item.name, mode: 'insensitive' } }
    });
    
    if (dbItem) {
      await prisma.item.update({
        where: { id: dbItem.id },
        data: { imageFile: item.img }
      });
      updatedCount++;
    }
  }
  
  console.log(`Updated ${updatedCount} items in database!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
