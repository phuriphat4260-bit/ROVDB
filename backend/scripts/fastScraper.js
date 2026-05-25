const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runScraper() {
  console.log('Fetching hero list from DB...');
  const heroes = await prisma.hero.findMany({ select: { slug: true, name: true } });
  console.log(`Found ${heroes.length} heroes from DB.`);

  for (let i = 0; i < heroes.length; i++) {
    const heroInfo = heroes[i];
    const slug = heroInfo.slug;
    
    console.log(`[${i+1}/${heroes.length}] Fetching data for ${heroInfo.name} (${slug})...`);
    
    try {
      const resDetail = await fetch(`https://rov.in.th/hero/${slug}`);
      const detailHtml = await resDetail.text();
      const $detail = cheerio.load(detailHtml);
      const detailScript = $detail('#__NEXT_DATA__').html();
      const detailData = JSON.parse(detailScript);
      const content = detailData.props.initialProps.pageProps.content.data;

      // Extract skills
      const skillsToCreate = (content.skills || []).map((s, idx) => ({
        name: s.name,
        description: s.description?.replace(/<[^>]*>?/gm, '') || '', // remove HTML tags
        type: idx === 0 ? 'Passive' : (idx === 3 ? 'Ultimate' : 'Skill'),
        icon: s.icon || s.image
      }));

      // Extract items
      let recommendedItems = [];
      if (content.itemsets && content.itemsets.length > 0) {
        // Take the first recommended itemset
        recommendedItems = (content.itemsets[0].items || []).map(item => ({
          name: item.name || 'Item',
          icon: item.icon || item.image
        }));
      } else if (content.suggestion && content.suggestion.items) {
         recommendedItems = content.suggestion.items.map(item => ({
            name: item.name || 'Item',
            icon: item.icon || item.image
         }));
      }

      // Extract runes
      const runes = (content.runes || []).map(r => r[0] ? {
        name: r[0].name || 'Rune',
        icon: r[0].icon || r[0].image
      } : null).filter(Boolean);

      // Extract spell
      const challengerSkill = content.spell ? {
        name: content.spell.name || 'Spell',
        icon: content.spell.icon || content.spell.image
      } : null;

      // Extract enchantments
      let enchantments = null;
      if (content.enchantments) {
        const main = content.enchantments['1'] ? content.enchantments['1'].slice(1).map(e => e.icon || e.image) : [];
        const sub = [
          ...(content.enchantments['2'] ? content.enchantments['2'].slice(1).map(e => e.icon || e.image) : []),
          ...(content.enchantments['3'] ? content.enchantments['3'].slice(1).map(e => e.icon || e.image) : [])
        ];
        enchantments = { main, sub };
      }

      // Update Database
      await prisma.hero.updateMany({
        where: { slug: slug },
        data: {
          story: content.story || null,
          recommendedItems: recommendedItems.length ? recommendedItems : null,
          runes: runes.length ? runes : null,
          challengerSkill: challengerSkill,
          enchantments: enchantments,
          skins: content.skins || null
        }
      });
      
      // Update skills - delete existing and recreate to be safe
      const heroDb = await prisma.hero.findFirst({ where: { slug } });
      if (heroDb) {
         await prisma.skill.deleteMany({ where: { heroId: heroDb.id } });
         for (const s of skillsToCreate) {
             await prisma.skill.create({
                 data: {
                     ...s,
                     heroId: heroDb.id
                 }
             });
         }
      }
      
      console.log(`✅ Updated ${heroInfo.name} with story, skills, runes, items, enchantments!`);
    } catch (err) {
      console.error(`❌ Failed to update ${heroInfo.name}:`, err.message);
    }
  }

  console.log('Fast Scraping Complete!');
  await prisma.$disconnect();
}

runScraper();
