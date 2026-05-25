const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('.json') || response.headers()['content-type']?.includes('application/json')) {
      if (!url.includes('google') && !url.includes('facebook')) {
        try {
          const text = await response.text();
          if (text.includes('Airi') || text.includes('airi')) {
            console.log('Found in:', url);
            console.log(text.substring(0, 500));
          }
        } catch(e) {}
      }
    }
  });

  await page.goto('https://rov.in.th/hero', {waitUntil: 'networkidle0'});
  await browser.close();
})();
