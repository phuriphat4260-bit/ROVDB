const fs = require('fs');

function extractFromMd(filename) {
    const md = fs.readFileSync(filename, 'utf-8');
    const regex = /!\[([^\]]*)\]\((https:\/\/static\.wikia\.nocookie\.net[^\)]+)\)/g;
    const results = {};
    let match;
    while ((match = regex.exec(md)) !== null) {
        let alt = match[1].trim();
        let src = match[2].trim();
        
        let cleanSrc = src.split('/scale-to-width-down')[0];
        if (cleanSrc.includes('/revision/latest')) {
            cleanSrc = cleanSrc.substring(0, cleanSrc.indexOf('/revision/latest') + '/revision/latest'.length);
        }
        
        // Sometimes Fandom adds "Item " prefix or removes spaces, but let's just clean common things
        let name = alt.replace(/\.png|\.jpg|\.jpeg/gi, '').trim();
        if (name && !results[name.toLowerCase()]) {
            results[name.toLowerCase()] = cleanSrc;
        }
    }
    return results;
}

const enchants = extractFromMd('C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\03aecdca-7b96-450f-aa23-c9f0f5f1bf08\\.system_generated\\steps\\155\\content.md');

fs.writeFileSync('wiki_images_md.json', JSON.stringify({ enchants }, null, 2));
console.log('Saved to wiki_images_md.json', Object.keys(enchants).length, 'enchants found');
