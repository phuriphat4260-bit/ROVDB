const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const data = JSON.parse(fs.readFileSync('wiki_images_api.json', 'utf8'));
    
    const items = await prisma.item.findMany();
    let itemsUpdated = 0;

    for (const item of items) {
        let name = item.name;
        if (!name && item.imageFile && item.imageFile.endsWith('.png')) {
            name = item.imageFile.replace('.png', '');
        }

        let cleanName = name.replace(/\[\[ไฟล์:(.*?)\.png.*\]\]/, '$1').trim().toLowerCase();
        // Handle special apostrophes
        cleanName = cleanName.replace(/’/g, "'");
        // Handle typos
        if (cleanName === 'ascentral glory') cleanName = 'ancestral glory';
        if (cleanName === 'asvestral glory') cleanName = 'ancestral glory';
        if (cleanName === 'glided greaves') cleanName = 'gilded greaves';
        if (cleanName === 'broken spear') cleanName = 'broken spears';
        if (cleanName === 'blitz blades') cleanName = 'blitz blade';
        if (cleanName === 'soul strom badge') cleanName = 'soul storm badge';

        let found = data.items[cleanName];

        if (!found) {
            // try exact match without spaces/punctuation
            const compact = cleanName.replace(/['\-\s]/g, '');
            for (const key in data.items) {
                if (key.replace(/['\-\s]/g, '') === compact) {
                    found = data.items[key];
                    break;
                }
            }
        }

        if (!found) {
             // Let's hardcode some well known ones that failed
             if (cleanName.includes('barrier')) found = 'https://static.wikia.nocookie.net/arena-of-valor/images/a/ae/Mother_Earth_Barrier.png';
             if (cleanName.includes('eradicate')) found = 'https://static.wikia.nocookie.net/arena-of-valor/images/2/22/Mother_Earth_Eradicate.png';
             if (cleanName.includes('cleansing')) found = 'https://static.wikia.nocookie.net/arena-of-valor/images/4/4f/Mother_Earth_Cleansing.png';
             if (cleanName.includes('magic eye')) found = 'https://static.wikia.nocookie.net/arena-of-valor/images/d/df/Mother_Earth_Magic_Eye.png';
             if (cleanName.includes('genesis')) found = 'https://static.wikia.nocookie.net/arena-of-valor/images/8/8d/Mother_Earth_Genesis.png';
             if (cleanName === 'phoenix tear') found = data.items["phoenix's tear"];
             if (cleanName === 'spring bracer') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/5/52/Spring_Bracer.png';
             if (cleanName === 'crystal badge') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/7/75/Crystal_Badge.png';
             if (cleanName === 'ring of terror') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/b/bd/Ring_of_Terror.png';
             if (cleanName === 'poseidon emblem') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/7/7e/Poseidon_Emblem.png';
             if (cleanName === 'bracer of purification') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/1/17/Bracer_of_Purification.png';
             if (cleanName === 'storm blaster') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/3/3d/Storm_Blaster.png';
             if (cleanName === 'storm tracker') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/7/76/Storm_Tracker.png';
             if (cleanName === 'water stone') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/e/ed/Water_Stone.png';
             if (cleanName === 'fire gem') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/7/75/Fire_Gem.png';
             if (cleanName === 'earth gem') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/2/23/Earth_Gem.png';
             if (cleanName === 'soul storm badge') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/a/ab/Soul_Storm_Badge.png';
             if (cleanName === 'the diminisher') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/3/30/The_Diminisher.png';
        }

        if (found) {
            await prisma.item.update({
                where: { id: item.id },
                data: { imageFile: found }
            });
            itemsUpdated++;
        }
    }
    console.log(`Updated ${itemsUpdated} missed Items.`);

    // Runes
    const runes = await prisma.rune.findMany();
    let runesUpdated = 0;
    for (const rune of runes) {
        let nameLower = rune.name.toLowerCase();
        const cleanName = nameLower.replace(/lv\s*[1-3]:\s*/i, '').trim();
        let found = data.runes[cleanName];
        
        if (!found) {
            const compact = cleanName.replace(/['\-\s]/g, '');
            for (const key in data.runes) {
                if (key.replace(/['\-\s]/g, '') === compact) {
                    found = data.runes[key];
                    break;
                }
            }
        }
        
        if (!found) {
            // Some names differ on Fandom vs DB
            if (cleanName === 'mob') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/c/c3/Mob_Rune.png';
            if (cleanName === 'atrocity') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/d/df/Atrocity_Rune.png';
            if (cleanName === 'revelation') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/6/6f/Revelation_Rune.png';
            if (cleanName === 'pestilence') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/f/ff/Pestilence_Rune.png';
            if (cleanName === 'secret incantation') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/2/2d/Secret_Incantation_Rune.png';
            if (cleanName === 'corrosion') found = 'https://static.wikia.nocookie.net/arena-of-valor/images/c/ca/Corrosion_Rune.png';
        }

        if (found) {
            await prisma.rune.update({
                where: { id: rune.id },
                data: { imageFile: found }
            });
            runesUpdated++;
        }
    }
    console.log(`Updated ${runesUpdated} missed Runes.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
