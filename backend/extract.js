const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('C:/Users/ASUS/.gemini/antigravity-ide/brain/5860e9cd-5bd0-48a4-8bab-0abe11d1b449/.system_generated/steps/121/content.md', 'utf-8');
const $ = cheerio.load(html);
const headings = $('h2, h3').map((i, el) => $(el).text()).get().filter(t => t.trim().length > 0);
console.log(headings);
const texts = $('h3, p').map((i, el) => $(el).text()).get().filter(t => t.trim().length > 0);
console.log(texts.slice(0, 50).join('\n'));
