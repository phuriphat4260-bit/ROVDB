const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();

function fetchWikitext() {
  return new Promise((resolve, reject) => {
    const url = 'https://arena-of-valor.fandom.com/th/api.php?action=parse&page=%E0%B9%84%E0%B8%AD%E0%B9%80%E0%B8%97%E0%B8%A1&prop=wikitext&format=json';
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ItemScraper/1.0)',
        'Accept': 'application/json',
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.parse.wikitext['*']);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const CATEGORY_MAP = {
  'โจมตี': 'Attack',
  'เวท': 'Magic',
  'ป้องกัน': 'Defense',
  'รองเท้า': 'Boots',
  'เคลื่อนที่': 'Boots',
  'ป่า': 'Jungle',
  'สนับสนุน': 'Support',
  'ไอเทมที่ถูกนำออก': 'Removed',
};

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\{\{โกลด์\}\}/g, 'Gold')
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/rowspan="[0-9]+" \| ?-?/g, '')
    .replace(/\[\[[^\]]+\]\]/g, '')
    .replace(/'''([^']+)'''/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/^\s*-\s*$/, '')
    .trim();
}

function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseItemsFromWikitext(wikitext) {
  const items = [];
  const seen = new Set();

  // Split into sections
  const sectionRegex = /==([^=\n]+)==/g;
  let sectionMatches = [];
  let m;
  while ((m = sectionRegex.exec(wikitext)) !== null) {
    sectionMatches.push({ index: m.index, name: m[1].trim(), end: m.index + m[0].length });
  }

  // Process each section
  for (let si = 0; si < sectionMatches.length; si++) {
    const section = sectionMatches[si];
    const nextSection = sectionMatches[si + 1];
    const sectionText = wikitext.slice(section.end, nextSection ? nextSection.index : undefined);
    const category = CATEGORY_MAP[section.name] || section.name;

    // Split into table rows
    const rows = sectionText.split(/^\|-$/m);

    for (const row of rows) {
      // Find item image file
      const fileMatch = row.match(/\[\[ไฟล์:([^\]]+\.png)\]\]/i);
      // Find item name - must be in ''' ''' but NOT be an image link
      // Handle apostrophes in names like "Fenrir's Tooth" using lazy match
      const nameMatch = row.match(/'''(?!\[\[)((?:[^']|'(?!''))+)'''/);
      if (!fileMatch || !nameMatch) continue;

      const imageFile = fileMatch[1].trim();
      const name = nameMatch[1].trim();

      if (seen.has(name)) continue;
      seen.add(name);

      const slug = nameToSlug(name);

      // Parse price
      const priceMatch = row.match(/\{\{โกลด์\}\}\s*([0-9,]+)/);
      const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;

      // Split by pipe-newline to get table cells
      // Row structure: |item|price|stats|passive|components
      const lines = row.split('\n');
      const cells = [];
      let currentCell = null;

      for (const line of lines) {
        if (line.startsWith('|') && !line.startsWith('|-')) {
          if (currentCell !== null) cells.push(currentCell);
          currentCell = line.slice(1);
        } else if (line.startsWith('*') || line.startsWith(' *')) {
          currentCell = (currentCell || '') + '\n' + line;
        } else if (currentCell !== null) {
          currentCell += (currentCell ? '\n' : '') + line;
        }
      }
      if (currentCell !== null) cells.push(currentCell);

      // Find stats (คุณสมบัติ) and passive (สกิลติดตัว) and components (ส่วนผสม)
      // Usually: cell[0]=image+name, cell[1]=price, cell[2]=stats, cell[3]=passive, cell[4]=components
      let stats = '';
      let passive = '';
      const components = [];

      // Try to find stats - it's after the price cell
      let cellIdx = 0;
      for (let ci = 0; ci < cells.length; ci++) {
        const cell = cells[ci].trim();
        if (cell.includes('โกลด์') || cell.match(/^\d+$/)) {
          cellIdx = ci;
          break;
        }
      }

      // Stats is next cell after price
      if (cells[cellIdx + 1] !== undefined) {
        const rawStats = cells[cellIdx + 1];
        if (!rawStats.match(/rowspan|^-\s*$/)) {
          stats = cleanText(rawStats);
        }
      }

      // Passive
      if (cells[cellIdx + 2] !== undefined) {
        const rawPassive = cells[cellIdx + 2];
        if (!rawPassive.match(/rowspan|^\s*-\s*$/)) {
          passive = cleanText(rawPassive);
        }
      }

      // Components
      if (cells[cellIdx + 3] !== undefined) {
        const compText = cells[cellIdx + 3];
        const compMatches = [...compText.matchAll(/\{\{ไอคอน\|([^|}]+)\}\}\s*x\s*(\d+)/g)];
        for (const cm of compMatches) {
          components.push(`${cm[1].trim()} x${cm[2]}`);
        }
      }

      items.push({
        name,
        slug,
        imageFile,
        price,
        stats: stats || null,
        passive: passive || null,
        components,
        category,
      });
    }
  }

  return items;
}

async function main() {
  console.log('📡 Fetching wikitext from Fandom API...');
  let wikitext;
  try {
    wikitext = await fetchWikitext();
    console.log(`✅ Got ${wikitext.length} chars of wikitext`);
  } catch (e) {
    console.error('❌ Failed to fetch:', e.message);
    process.exit(1);
  }

  console.log('🔍 Parsing items...');
  const items = parseItemsFromWikitext(wikitext);
  console.log(`📦 Found ${items.length} items`);

  console.log('💾 Pushing schema...');
  console.log('🌱 Seeding items to database...');
  let count = 0;
  let errors = 0;

  for (const item of items) {
    try {
      await prisma.item.upsert({
        where: { slug: item.slug },
        update: item,
        create: item,
      });
      count++;
      if (count % 20 === 0) console.log(`  Seeded ${count}/${items.length}...`);
    } catch (e) {
      console.error(`  ❌ Failed "${item.name}" (slug: ${item.slug}): ${e.message}`);
      errors++;
    }
  }

  console.log(`\n✅ Seeded ${count} items successfully`);
  if (errors > 0) console.log(`⚠️  ${errors} items failed`);

  // Show sample
  const sample = await prisma.item.findFirst({ where: { name: "Fenrir's Tooth" } });
  if (sample) {
    console.log('\nSample item (Fenrir\'s Tooth):');
    console.log(JSON.stringify(sample, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
