const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://content.richmanshop.com/rov-characters/', { waitUntil: 'networkidle2' });

  // Extract all hero names if they are formatted like "HeroName (Tier)"
  const data = await page.evaluate(() => {
    const textNodes = Array.from(document.querySelectorAll('*'))
      .map(el => el.innerText)
      .filter(t => t && t.includes('Tier'));
    return [...new Set(textNodes)];
  });

  fs.writeFileSync('richmanshop_full.json', JSON.stringify(data, null, 2));
  console.log('Saved richmanshop_full.json');
  await browser.close();
}

scrape().catch(console.error);
