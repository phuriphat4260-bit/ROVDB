const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://youtu.be/KzJBw94Etus?si=VBtIDYv9YrjZWgF8', {waitUntil: 'networkidle2'});
  
  // Try to get channel name
  const channelName = await page.$eval('ytd-channel-name yt-formatted-string a', el => el.textContent).catch(() => 'Unknown Channel');
  const title = await page.title();
  
  console.log('Channel:', channelName);
  console.log('Title:', title);
  
  await browser.close();
}
run().catch(console.error);
