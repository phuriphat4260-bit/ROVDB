const https = require('https');
const fs = require('fs');

function fetchApi(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function getImagesForPage(title) {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://arena-of-valor.fandom.com/th/api.php?action=query&prop=imageinfo&iiprop=url&generator=images&titles=${encodedTitle}&gimlimit=500&format=json`;
    const data = await fetchApi(url);
    const results = {};
    if (data.query && data.query.pages) {
        for (const key in data.query.pages) {
            const page = data.query.pages[key];
            if (page.imageinfo && page.imageinfo[0]) {
                const imgUrl = page.imageinfo[0].url;
                let cleanTitle = page.title.replace('ไฟล์:', '').replace('File:', '').replace(/\.png|\.jpg|\.jpeg/gi, '').trim();
                // Fandom titles might have suffixes like " (พลังแฝง)"
                cleanTitle = cleanTitle.replace(/\s*\(.*?\)/g, '');
                results[cleanTitle.toLowerCase()] = imgUrl;
            }
        }
    }
    return results;
}

// Realm of Valor has its own API endpoint
async function getImagesForRealmPage(title) {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://realm-of-valor.fandom.com/th/api.php?action=query&prop=imageinfo&iiprop=url&generator=images&titles=${encodedTitle}&gimlimit=500&format=json`;
    const data = await fetchApi(url);
    const results = {};
    if (data.query && data.query.pages) {
        for (const key in data.query.pages) {
            const page = data.query.pages[key];
            if (page.imageinfo && page.imageinfo[0]) {
                const imgUrl = page.imageinfo[0].url;
                let cleanTitle = page.title.replace('ไฟล์:', '').replace('File:', '').replace(/\.png|\.jpg|\.jpeg/gi, '').trim();
                cleanTitle = cleanTitle.replace(/\s*\(.*?\)/g, '');
                results[cleanTitle.toLowerCase()] = imgUrl.split('/revision/latest')[0];
            }
        }
    }
    return results;
}

async function main() {
    console.log('Fetching Enchants...');
    const enchants = await getImagesForPage('พลังแฝง');
    
    console.log('Fetching Items...');
    const items = await getImagesForPage('ไอเทม');
    
    console.log('Fetching Runes...');
    // Try arena of valor first, then realm of valor
    let runes = await getImagesForPage('รูน');
    if (Object.keys(runes).length === 0) {
        runes = await getImagesForRealmPage('รูน');
    }
    
    console.log('Fetching Spells...');
    const spells = await getImagesForRealmPage('สกิลชาเลนจ์เจอร์');

    fs.writeFileSync('wiki_images_api.json', JSON.stringify({ enchants, items, runes, spells }, null, 2));
    console.log('Saved to wiki_images_api.json');
}

main().catch(console.error);
