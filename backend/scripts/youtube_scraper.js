const puppeteer = require('puppeteer');

async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://youtu.be/Vk63jJf8-u8?si=36_rJxr70xFQsVlS', { waitUntil: 'networkidle2' });

  const title = await page.title();
  
  // Wait for the description to be available and click 'show more' if needed, or just grab the meta description
  const description = await page.$eval('meta[name="description"]', el => el.content).catch(() => 'No meta description');

  console.log('Title:', title);
  console.log('Description:', description);
  
  await browser.close();
}

scrape().catch(console.error);
