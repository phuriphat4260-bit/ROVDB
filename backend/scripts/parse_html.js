const fs = require('fs');
const cheerio = require('cheerio');

function extractImages(filename) {
    const html = fs.readFileSync(filename, 'utf-8');
    const $ = cheerio.load(html);
    const results = {};
    $('img').each((i, el) => {
        let src = $(el).attr('data-src') || $(el).attr('src');
        let alt = $(el).attr('alt');
        if (src && alt && src.includes('nocookie.net')) {
            let cleanSrc = src.split('/scale-to-width-down')[0];
            if (cleanSrc.includes('/revision/latest')) {
                cleanSrc = cleanSrc.substring(0, cleanSrc.indexOf('/revision/latest') + '/revision/latest'.length);
            }
            let name = alt.replace(/\.png|\.jpg|\.jpeg/gi, '').trim();
            if (name && !results[name.toLowerCase()]) {
                results[name.toLowerCase()] = cleanSrc;
            }
        }
    });
    return results;
}

const enchants = extractImages('fandom_enchants.html');
const spells = extractImages('fandom_spells.html');
const items = extractImages('fandom_items.html');
const runes = extractImages('fandom_runes.html');

fs.writeFileSync('wiki_images.json', JSON.stringify({ enchants, spells, items, runes }, null, 2));
console.log('Saved extracted images to wiki_images.json');
