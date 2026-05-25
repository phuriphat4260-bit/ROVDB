const https = require('https');
const fs = require('fs');

function downloadHtml(url, filename) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                fs.writeFileSync(filename, data);
                console.log('Saved', filename);
                resolve();
            });
        }).on('error', reject);
    });
}

async function main() {
    await downloadHtml('https://arena-of-valor.fandom.com/th/wiki/%E0%B8%9E%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B9%81%E0%B8%9D%E0%B8%87', 'fandom_enchants.html');
    await downloadHtml('https://realm-of-valor.fandom.com/th/wiki/%E0%B8%AA%E0%B8%81%E0%B8%B4%E0%B8%A5%E0%B8%8A%E0%B8%B2%E0%B9%80%E0%B8%A5%E0%B8%99%E0%B9%80%E0%B8%88%E0%B8%AD%E0%B8%A3%E0%B9%8C', 'fandom_spells.html');
    await downloadHtml('https://arena-of-valor.fandom.com/th/wiki/%E0%B9%84%E0%B8%AD%E0%B9%80%E0%B8%97%E0%B8%A1', 'fandom_items.html');
    await downloadHtml('https://arena-of-valor.fandom.com/th/wiki/%E0%B8%A3%E0%B8%B9%E0%B8%99', 'fandom_runes.html');
}

main();
