const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const heroes = await prisma.hero.findMany();
  
  const itemIcons = {};
  const runeIcons = {};
  const spellIcons = {};
  const enchantIcons = {};

  for (const hero of heroes) {
    // Collect Items
    if (hero.recommendedItems && Array.isArray(hero.recommendedItems)) {
      for (const item of hero.recommendedItems) {
        if (item.name && item.icon) itemIcons[item.name.toLowerCase()] = item.icon;
      }
    }
    
    // Collect Runes
    if (hero.runes && Array.isArray(hero.runes)) {
      for (const rune of hero.runes) {
        if (rune.name && rune.icon) runeIcons[rune.name.toLowerCase()] = rune.icon;
      }
    }
    
    // Collect Spells
    if (hero.challengerSkill && hero.challengerSkill.name && hero.challengerSkill.icon) {
      spellIcons[hero.challengerSkill.name] = hero.challengerSkill.icon;
    }
    
    // Collect Enchantments (parse name from URL)
    if (hero.enchantments) {
      const allUrls = [...(hero.enchantments.main || []), ...(hero.enchantments.sub || [])];
      for (const url of allUrls) {
        const match = url.match(/\/([^/]+)\.png$/);
        if (match) {
          const name = match[1].replace(/-/g, ' ');
          enchantIcons[name.toLowerCase()] = url;
        }
      }
    }
  }

  // Update Item Table
  const dbItems = await prisma.item.findMany();
  let itemsUpdated = 0;
  for (const dbItem of dbItems) {
    const icon = itemIcons[dbItem.name.toLowerCase()];
    if (icon) {
      await prisma.item.update({ where: { id: dbItem.id }, data: { imageFile: icon } });
      itemsUpdated++;
    } else {
      // Try to guess Garena URL
      const cat = dbItem.category === 'Attack' ? 'Attack' : 
                  dbItem.category === 'Magic' ? 'Magic' : 
                  dbItem.category === 'Defense' ? 'Defense' : 
                  dbItem.category === 'Boots' ? 'BOOT' : 
                  dbItem.category === 'Jungle' ? 'Jungle' : 'Support';
      const guessed = `https://cdn-webth.garenanow.com/webth/rov/mainsite/v2/hero/Item/${cat}/${dbItem.name.replace(/ /g, '_').replace(/'/g, '_')}.png`;
      await prisma.item.update({ where: { id: dbItem.id }, data: { imageFile: guessed } });
      itemsUpdated++;
    }
  }

  // Update Rune Table
  const dbRunes = await prisma.rune.findMany();
  let runesUpdated = 0;
  for (const dbRune of dbRunes) {
    const icon = runeIcons[dbRune.name.toLowerCase()];
    if (icon) {
      await prisma.rune.update({ where: { id: dbRune.id }, data: { imageFile: icon } });
      runesUpdated++;
    } else {
       // Guess Rune URL
       const colorMap = { 'red': 'red', 'green': 'green', 'purple': 'purple', 'yellow': 'purple' };
       const c = colorMap[dbRune.color?.toLowerCase()] || 'red';
       const n = dbRune.name.replace(/^LV [123]: /, '').replace(/ /g, '%20');
       const guessed = `https://cdn-webth.garenanow.com/webth/rov/mainsite/v2/hero/Rune/${c}/${n}.png`;
       await prisma.rune.update({ where: { id: dbRune.id }, data: { imageFile: guessed } });
       runesUpdated++;
    }
  }

  console.log(`Updated ${itemsUpdated} Items and ${runesUpdated} Runes in DB.`);
  console.log('Spells:', Object.keys(spellIcons).length);
  console.log('Enchantments:', Object.keys(enchantIcons).length);
  
  fs.writeFileSync('extracted_icons.json', JSON.stringify({ spellIcons, enchantIcons }, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
