const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const data = JSON.parse(fs.readFileSync('wiki_images_api.json', 'utf8'));
    
    // Update Items
    const items = await prisma.item.findMany();
    let itemsUpdated = 0;
    for (const item of items) {
        let nameLower = item.name.toLowerCase();
        // Sometimes names have 's instead of %27s etc, let's normalize
        let found = data.items[nameLower];
        if (!found) {
            // try removing punctuation
            const cleanName = nameLower.replace(/['\-]/g, '');
            for (const key in data.items) {
                if (key.replace(/['\-]/g, '') === cleanName) {
                    found = data.items[key];
                    break;
                }
            }
        }
        
        if (found) {
            await prisma.item.update({
                where: { id: item.id },
                data: { imageFile: found }
            });
            itemsUpdated++;
        } else {
            console.log('No Fandom image found for Item:', item.name);
            // Fallback placeholder to prevent broken icon
            await prisma.item.update({
                where: { id: item.id },
                data: { imageFile: 'https://via.placeholder.com/64?text=' + encodeURIComponent(item.name) }
            });
        }
    }
    console.log(`Updated ${itemsUpdated} Items.`);

    // Update Runes
    const runes = await prisma.rune.findMany();
    let runesUpdated = 0;
    for (const rune of runes) {
        let nameLower = rune.name.toLowerCase();
        // The rune names in DB often have "LV 3: Desolate" etc. Let's strip "LV 3: "
        const cleanName = nameLower.replace(/lv\s*[1-3]:\s*/i, '').trim();
        let found = data.runes[cleanName];
        if (found) {
            await prisma.rune.update({
                where: { id: rune.id },
                data: { imageFile: found }
            });
            runesUpdated++;
        } else {
            console.log('No Fandom image found for Rune:', rune.name, 'cleaned as:', cleanName);
            await prisma.rune.update({
                where: { id: rune.id },
                data: { imageFile: 'https://via.placeholder.com/64?text=' + encodeURIComponent(cleanName) }
            });
        }
    }
    console.log(`Updated ${runesUpdated} Runes.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
