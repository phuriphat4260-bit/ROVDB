const fs = require('fs');

const data = JSON.parse(fs.readFileSync('wiki_images_api.json', 'utf8'));

// Enchantments
const enchantIcons = {
    "sacred bead": data.enchants["sacred bead"],
    "holy verdict": data.enchants["holy verdict"],
    "sacred protection": data.enchants["sacred protection"],
    "river treader": data.enchants["river treader"],
    "mark of frost": data.enchants["mark of frost"],
    "regrowth": data.enchants["regrowth"],
    "nature_s rage": data.enchants["nature's rage"],
    "arcane whisper": data.enchants["arcane whisper"],
    "shadow blade": data.enchants["shadow blade"],
    "deadly claw": data.enchants["deadly claw"],
    "curse of death": data.enchants["curse of death"],
    "axe of sacrifice": data.enchants["axe of sacrifice"],
    "desperate duel": data.enchants["desperate duel"],
    "gunslinger": data.enchants["gunslinger"],
    "reging inferno": data.enchants["raging inferno"],
    "holy thunder": data.enchants["holy thunder"],
    "reaper_s blessing": data.enchants["reaper's blessing"],
    "devourer": data.enchants["devourer"],
    "minion kill": data.enchants["minion kill"],
    "visceral boost": data.enchants["visceral boost"],
    "tower blessing": data.enchants["tower blessing"],
    "nature_s gift": data.enchants["nature's gift"],
    "explosive shield": data.enchants["explosive shield"],
    "devil_s awakening": data.enchants["devil's awakening"],
    "blessing": data.enchants["blessing"],
    "bone cutter": data.enchants["bone cutter"],
    "mana refill": data.enchants["mana refill"],
    "forest wanderer": data.enchants["forest wanderer"],
    "backstabbing": data.enchants["backstabbing"],
    "holy summoner": data.enchants["holy summoner"],
    "endless cycle": data.enchants["endless cycle"]
};

let enchantStr = '  const enchantIcons: Record<string, string> = {\n';
for (const key in enchantIcons) {
    enchantStr += `    "${key}": "${enchantIcons[key] || 'https://via.placeholder.com/64?text=' + encodeURIComponent(key)}",\n`;
}
enchantStr = enchantStr.slice(0, -2) + '\n  };';

let enchantFile = fs.readFileSync('../frontend/src/components/EnchantmentSelectorModal.tsx', 'utf8');
enchantFile = enchantFile.replace(/const enchantIcons: Record<string, string> = \{[\s\S]*?\};\n/, enchantStr + '\n');
fs.writeFileSync('../frontend/src/components/EnchantmentSelectorModal.tsx', enchantFile);
console.log('Updated EnchantmentSelectorModal.tsx');

const specificData = JSON.parse(fs.readFileSync('specific_images.json', 'utf8'));

// Spells
const spellIcons = {
    "Sprint": specificData['Sprint.png'],
    "Execute": specificData['Execute.png'],
    "Punish": specificData['Punish.png'],
    "Frostbite": specificData['Frostbite.png'],
    "Roar": specificData['Roar.png'],
    "Heal": specificData['Heal.png'],
    "Disturb": specificData['Disturb.png'],
    "Dazed": specificData['Dazed.png'],
    "Purify": specificData['Purify.png'],
    "Flicker": specificData['Flicker.png']
};

let spellStr = '  const spellIcons: Record<string, string> = {\n';
for (const key in spellIcons) {
    spellStr += `    "${key}": "${spellIcons[key]}",\n`;
}
spellStr = spellStr.slice(0, -2) + '\n  };';

let spellFile = fs.readFileSync('../frontend/src/components/SpellSelectorModal.tsx', 'utf8');
spellFile = spellFile.replace(/const spellIcons: Record<string, string> = \{[\s\S]*?\};\n/, spellStr + '\n');
fs.writeFileSync('../frontend/src/components/SpellSelectorModal.tsx', spellFile);
console.log('Updated SpellSelectorModal.tsx');
