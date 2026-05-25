const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function scrapeSoundMk() {
  console.log('Fetching soundmk.com/rov/item ...');
  const res = await axios.get('https://soundmk.com/rov/item');
  const $ = cheerio.load(res.data);
  
  const items = [];
  $('table.table-bordered tr').each((i, el) => {
    if (i === 0) return; // skip header
    const tds = $(el).find('td');
    if (tds.length < 4) return;
    
    // Column 1: Image, Name, Price
    const col1 = $(tds[0]);
    const img = col1.find('img').attr('src');
    const nameMatch = col1.html().match(/<br>([^<]+)/);
    const name = nameMatch ? nameMatch[1].trim() : '';
    const priceMatch = col1.html().match(/<hr[^>]*>([0-9,]+)/);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;
    
    // Column 2: Category, Level
    const col2 = $(tds[1]);
    const category = col2.find('b').text().trim();
    
    // Column 3: Components
    const col3 = $(tds[2]);
    const components = [];
    col3.find('div.col-sm-2').each((j, cel) => {
      const cnameMatch = $(cel).html().match(/<br>([^<]+)/);
      if (cnameMatch && cnameMatch[1].trim() && cnameMatch[1].trim() !== name) {
        components.push(cnameMatch[1].trim() + ' x1');
      }
    });
    
    // Column 4: Stats / Passive
    const col4 = $(tds[3]);
    let stats = '';
    let passive = '';
    
    const lines = col4.html().split(/<br\s*\/?>|<hr[^>]*>/).map(s => s.trim().replace(/<[^>]+>/g, '')).filter(Boolean);
    
    // Typically the first line is the category again in bold, skip it
    let startIndex = 0;
    if (lines.length > 0 && lines[0] === category) startIndex = 1;
    
    for (let j = startIndex; j < lines.length; j++) {
      if (lines[j].includes('สกิลติดตัว')) {
        passive += lines[j] + '\n';
      } else if (lines[j].includes('กดใช้')) {
        passive += lines[j] + '\n';
      } else {
        stats += lines[j] + '\n';
      }
    }
    
    if (name) {
      items.push({
        name,
        slug: nameToSlug(name),
        imageFile: img,
        price,
        stats: stats.trim() || null,
        passive: passive.trim() || null,
        components: components.length > 0 ? components : [],
        category: category
      });
    }
  });
  
  console.log(`Found ${items.length} items from SoundMk`);
  
  // Also we want to map typos for missing items
  const aliases = [
    { from: 'Blitz Blades', to: 'Blitz Blade' },
    { from: 'Broken Spear', to: 'Broken Spears' },
    { from: 'Glided Greaves', to: 'Gilded Greaves' },
    { from: 'Soul Strom Badge', to: 'Soul Storm Badge' } // Assuming this might be it
  ];
  
  let added = 0;
  for (const item of items) {
    try {
      const existing = await prisma.item.findUnique({ where: { slug: item.slug } });
      if (!existing) {
        await prisma.item.create({ data: item });
        added++;
        console.log(`Added missing item: ${item.name}`);
      } else {
        // Update image if it's full url
        if (item.imageFile && item.imageFile.startsWith('http')) {
          await prisma.item.update({
            where: { slug: item.slug },
            data: { imageFile: item.imageFile }
          });
        }
      }
    } catch(e) {
      console.log(`Error on ${item.name}: ${e.message}`);
    }
  }
  
  // Handle aliases
  for (const alias of aliases) {
    const slugAlias = nameToSlug(alias.from);
    const slugReal = nameToSlug(alias.to);
    
    const realItem = await prisma.item.findUnique({ where: { slug: slugReal } });
    if (realItem) {
      // create a duplicate entry for the alias slug if not exists
      const existingAlias = await prisma.item.findUnique({ where: { slug: slugAlias } });
      if (!existingAlias) {
        const copy = { ...realItem };
        delete copy.id;
        copy.name = alias.from;
        copy.slug = slugAlias;
        await prisma.item.create({ data: copy });
        console.log(`Added alias: ${alias.from} -> ${alias.to}`);
        added++;
      }
    }
  }
  
  console.log(`Finished processing. Added ${added} items/aliases.`);
}

scrapeSoundMk().catch(console.error).finally(() => prisma.$disconnect());
