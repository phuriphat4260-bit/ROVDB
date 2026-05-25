const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeWiki(browser, url) {
    try {
        console.log(`Fetching ${url}...`);
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        const results = await page.evaluate(() => {
            const res = [];
            document.querySelectorAll('img').forEach((img) => {
                let src = img.getAttribute('data-src') || img.src;
                let alt = img.alt || '';
                res.push({ src, alt });
            });
            return res;
        });
        await page.close();
        return results;
    } catch (e) {
        console.error('Error fetching ' + url, e.message);
        return [];
    }
}

async function main() {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    
    const enchants = await scrapeWiki(browser, 'https://arena-of-valor.fandom.com/th/wiki/%E0%B8%9E%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B9%81%E0%B8%9D%E0%B8%87');
    
    await browser.close();

    fs.writeFileSync('test_images.json', JSON.stringify({
        enchants
    }, null, 2));
    console.log('Saved to test_images.json');
}

main();
