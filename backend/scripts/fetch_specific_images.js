const https = require('https');
const fs = require('fs');

const missingTitles = [
    // Spells
    'Sprint.png', 'Execute.png', 'Punish.png', 'Frostbite.png', 'Roar.png', 
    'Heal.png', 'Disturb.png', 'Dazed.png', 'Purify.png', 'Flicker.png',
    // Items
    'Spring_Bracer.png', 'Crystal_Badge.png', 'Ring_of_Terror.png', 
    'Poseidon_Emblem.png', 'Bracer_of_Purification.png', 'Storm_Blaster.png', 
    'Storm_Tracker.png', 'Water_Stone.png', 'Fire_Gem.png', 'Earth_Gem.png', 
    'Soul_Storm_Badge.png', 'The_Diminisher.png', 'Mother_Earth_Barrier.png',
    'Mother_Earth_Eradicate.png', 'Mother_Earth_Cleansing.png', 
    'Mother_Earth_Magic_Eye.png', 'Mother_Earth_Genesis.png'
];

async function getUrl(title) {
    return new Promise((resolve) => {
        const query = encodeURIComponent(`ไฟล์:${title}`);
        https.get(`https://arena-of-valor.fandom.com/th/api.php?action=query&prop=imageinfo&iiprop=url&titles=${query}&format=json`, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try {
                    const data = JSON.parse(d);
                    const pages = data.query?.pages;
                    if (pages) {
                        for (let key in pages) {
                            if (pages[key].imageinfo && pages[key].imageinfo[0].url) {
                                return resolve(pages[key].imageinfo[0].url);
                            }
                        }
                    }
                } catch(e) {}
                resolve(null);
            });
        }).on('error', () => resolve(null));
    });
}

async function main() {
    let results = {};
    for (let title of missingTitles) {
        console.log("Fetching", title);
        let url = await getUrl(title);
        if (!url) {
            // try without "ไฟล์:"
            url = await new Promise((resolve) => {
                const query2 = encodeURIComponent(`File:${title}`);
                https.get(`https://arena-of-valor.fandom.com/api.php?action=query&prop=imageinfo&iiprop=url&titles=${query2}&format=json`, res => {
                    let d = ''; res.on('data', c => d += c);
                    res.on('end', () => {
                        try {
                            const data = JSON.parse(d);
                            const pages = data.query?.pages;
                            if (pages) {
                                for (let key in pages) {
                                    if (pages[key].imageinfo && pages[key].imageinfo[0].url) return resolve(pages[key].imageinfo[0].url);
                                }
                            }
                        } catch(e) {}
                        resolve(null);
                    });
                });
            });
        }
        if (url) {
            results[title] = url;
            console.log("Found:", url);
        } else {
            console.log("NOT FOUND:", title);
        }
    }
    fs.writeFileSync('specific_images.json', JSON.stringify(results, null, 2));
}

main();
