const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeWiki(browser, url) {
    try {
        console.log(`Fetching ${url}...`);
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        const results = await page.evaluate(() => {
            const res = {};
            document.querySelectorAll('img').forEach((img) => {
                let src = img.getAttribute('data-src') || img.src;
                let alt = img.alt;
                if (src && alt && src.includes('nocookie.net')) {
                    let cleanSrc = src.split('/scale-to-width-down')[0];
                    if (cleanSrc.includes('/revision/latest')) {
                        cleanSrc = cleanSrc.substring(0, cleanSrc.indexOf('/revision/latest') + '/revision/latest'.length);
                    }
                    
                    let name = alt.replace(/\.png|\.jpg|\.jpeg/gi, '').trim();
                    if (name && !res[name.toLowerCase()]) {
                        res[name.toLowerCase()] = cleanSrc;
                    }
                }
            });
            return res;
        });
        await page.close();
        return results;
    } catch (e) {
        console.error('Error fetching ' + url, e.message);
        return {};
    }
}

async function main() {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    
    const enchants = await scrapeWiki(browser, 'https://arena-of-valor.fandom.com/th/wiki/%E0%B8%9E%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B9%81%E0%B8%9D%E0%B8%87');
    const spells = await scrapeWiki(browser, 'https://realm-of-valor.fandom.com/th/wiki/%E0%B8%AA%E0%B8%81%E0%B8%B4%E0%B8%A5%E0%B8%8A%E0%B8%B2%E0%B9%80%E0%B8%A5%E0%B8%99%E0%B9%80%E0%B8%88%E0%B8%AD%E0%B8%A3%E0%B9%8C');
    const items = await scrapeWiki(browser, 'https://arena-of-valor.fandom.com/th/wiki/%E0%B9%84%E0%B8%AD%E0%B9%80%E0%B8%97%E0%B8%A1');
    const runes = await scrapeWiki(browser, 'https://arena-of-valor.fandom.com/th/wiki/%E0%B8%A3%E0%B8%B9%E0%B8%99');

    await browser.close();

    fs.writeFileSync('wiki_images.json', JSON.stringify({
        enchants, spells, items, runes
    }, null, 2));
    console.log('Saved to wiki_images.json');
}

main();
