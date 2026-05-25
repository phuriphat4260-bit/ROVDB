const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchRuneWikitext() {
  console.log('📡 Fetching wikitext from Fandom API...');
  const res = await axios.get('https://arena-of-valor.fandom.com/th/api.php?action=parse&page=%E0%B8%A3%E0%B8%B9%E0%B8%99&prop=wikitext&format=json');
  const wikitext = res.data.parse.wikitext['*'];
  return wikitext;
}

function parseRunes(wikitext) {
  const runes = [];
  
  const colors = [
    { regex: /==\s*สีแดง\s*==([\s\S]*?)==\s*สีม่วง\s*==/, name: 'red' },
    { regex: /==\s*สีม่วง\s*==([\s\S]*?)==\s*สีเขียว\s*==/, name: 'purple' },
    { regex: /==\s*สีเขียว\s*==([\s\S]*?)==\s*เซ็ตรูนแนะนำ\s*==/, name: 'green' },
  ];

  for (const color of colors) {
    const match = wikitext.match(color.regex);
    if (!match) continue;
    
    const section = match[1];
    const imageMap = new Map();
    
    // Parse image mappings
    // Usually the wiki has images listed first: |[[ไฟล์:Sage.png]]
    const imgMatches = [...section.matchAll(/\|\[\[ไฟล์:([^\]]+\.png)\]\]/g)];
    
    // The items are mapped in order of images usually, but the text is often split.
    // Instead, let's parse the entries like |'''LV 3: Sage'''
    const entryMatches = [...section.matchAll(/\|'''(LV\s*([123]):\s*(.*?))'''\n([\s\S]*?)(?=\n\|'''LV\s*[123]:|$|\n\|-)/g)];
    
    // We can assume image files are just `<name>.png`
    
    for (const em of entryMatches) {
      const title = em[1].trim(); // LV 3: Sage
      const level = parseInt(em[2].trim());
      const rawName = em[3].trim(); // Sage
      
      const stats = em[4]
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('|-'))
        .join('\n');
      
      const imageFile = rawName + '.png';

      runes.push({
        name: title,
        slug: nameToSlug(title),
        level: level,
        color: color.name,
        stats: stats,
        imageFile: imageFile
      });
    }
  }

  return runes;
}

async function seedRunes() {
  const wikitext = await fetchRuneWikitext();
  const runes = parseRunes(wikitext);
  
  console.log(`📦 Found ${runes.length} runes`);
  console.log('🌱 Seeding runes to database...');

  let count = 0;
  for (const rune of runes) {
    await prisma.rune.upsert({
      where: { slug: rune.slug },
      update: rune,
      create: rune,
    });
    count++;
    if (count % 20 === 0) console.log(`  Seeded ${count}/${runes.length}...`);
  }

  console.log(`✅ Seeded ${runes.length} runes successfully`);
  
  if (runes.length > 0) {
    console.log('\nSample rune (Sage):');
    console.log(JSON.stringify(runes.find(r => r.name.includes('Sage')), null, 2));
  }
}

seedRunes().catch(console.error).finally(() => prisma.$disconnect());
