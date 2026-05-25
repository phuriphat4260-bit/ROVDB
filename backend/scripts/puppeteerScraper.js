const puppeteer = require('puppeteer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function runScraper() {
  console.log('Starting full automated scraping...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
      req.continue();
    } else {
      req.continue();
    }
  });

  console.log('Clearing existing database to ensure clean data...');
  await prisma.skill.deleteMany({});
  await prisma.hero.deleteMany({});

  console.log('Navigating to https://rov.in.th/hero ...');
  await page.goto('https://rov.in.th/hero', { waitUntil: 'networkidle2' });

  const heroesList = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/hero/"]')).map(a => ({
      link: a.href,
      name: a.innerText.trim(),
      avatar: a.querySelector('img')?.src || ''
    })).filter(h => h.name && h.avatar);
  });

  const uniqueLinks = [];
  const seen = new Set();
  for (const l of heroesList) {
    if (!seen.has(l.name)) {
      seen.add(l.name);
      uniqueLinks.push(l);
    }
  }

  console.log(`Found ${uniqueLinks.length} unique heroes.`);

  for (let i = 0; i < uniqueLinks.length; i++) {
    const h = uniqueLinks[i];
    const slug = h.link.split('/hero/')[1].split('?')[0];

    console.log(`[${i+1}/${uniqueLinks.length}] Scraping detailed data for ${h.name} (${slug})...`);
    
    try {
      await page.goto(h.link, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const details = await page.evaluate(() => {
        const roles = [document.querySelector('.overviewRole__info--role')?.innerText?.trim()].filter(Boolean);
        
        const skills = Array.from(document.querySelectorAll('.overviewList__wrapper')).map(el => ({
          name: el.querySelector('.text--yellow')?.innerText?.trim() || 'Unknown Skill',
          description: el.querySelector('.overviewList__info p')?.innerText?.trim() || '',
          icon: el.querySelector('img')?.src || ''
        }));

        const recommendedItems = Array.from(document.querySelectorAll('.recommendItems__column img')).map(img => ({
          name: img.alt || 'Item',
          icon: img.src
        }));

        const runes = Array.from(document.querySelectorAll('.recommendRune__column')).map(el => ({
          name: el.querySelector('h3')?.innerText?.trim() || 'Rune',
          icon: el.querySelector('.rune-icon img')?.src || el.querySelector('img')?.src || ''
        }));

        const challengerSkillEl = document.querySelector('.recommendSpell__column img');
        const challengerSkill = challengerSkillEl ? {
          name: challengerSkillEl.alt || 'Spell',
          icon: challengerSkillEl.src
        } : null;

        const enchantMain = Array.from(document.querySelectorAll('.tree-main img')).map(img => img.src);
        const enchantSub = Array.from(document.querySelectorAll('.tree-sub img')).map(img => img.src);

        // Try to get story
        const storyP = Array.from(document.querySelectorAll('.storyContent p, #story p')).map(p => p.innerText.trim()).filter(Boolean);
        const story = storyP.join('\n\n');

        return {
          roles: roles.length ? roles : ['Unknown'],
          skills,
          recommendedItems: recommendedItems.length ? recommendedItems : null,
          runes: runes.length ? runes : null,
          challengerSkill,
          enchantments: enchantMain.length ? { main: enchantMain, sub: enchantSub } : null,
          story: story || null
        };
      });

      await prisma.hero.create({
        data: {
          slug: slug,
          name: h.name,
          avatar: h.avatar,
          splashArt: h.avatar, // We will use avatar as splash art but styled with object-cover
          classes: details.roles,
          survivability: 5,
          attackDamage: 5,
          skillEffect: 5,
          difficulty: 5,
          story: details.story,
          recommendedItems: details.recommendedItems,
          runes: details.runes,
          challengerSkill: details.challengerSkill,
          enchantments: details.enchantments,
          skills: {
            create: details.skills.length ? details.skills.map((s, idx) => ({
              name: s.name,
              description: s.description,
              type: idx === 0 ? 'Passive' : (idx === 3 ? 'Ultimate' : 'Skill'),
              icon: s.icon
            })) : []
          }
        }
      });
      console.log(`✅ Saved ${h.name}`);
    } catch (err) {
      console.error(`❌ Failed to scrape ${h.name}:`, err.message);
    }
  }

  await browser.close();
  await prisma.$disconnect();
  console.log('Automated scraping complete!');
}

runScraper();
