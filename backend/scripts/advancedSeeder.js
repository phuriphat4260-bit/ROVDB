const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function populateAdvancedData() {
  console.log('Injecting Advanced Gameplay Data...');
  
  // Create Airi with exact data from screenshot
  const airi = {
    slug: 'airi',
    name: 'Airi',
    avatar: 'https://cdn.discordapp.com/attachments/111/airi.png', // Fallback or accurate
    splashArt: 'https://lienquan.garena.vn/wp-content/uploads/2021/01/Airi.png', // Airi splash
    classes: ['Assassin', 'Fighter'],
    survivability: 4,
    attackDamage: 8,
    skillEffect: 7,
    difficulty: 6,
    recommendedItems: [
      { name: "Gilded Greaves", icon: "https://lienquan.garena.vn/wp-content/uploads/2016/11/Gilded-Greaves.png" },
      { name: "Spear of Longinus", icon: "https://lienquan.garena.vn/wp-content/uploads/2016/11/Spear-of-Longinus.png" },
      { name: "Omni Arms", icon: "https://lienquan.garena.vn/wp-content/uploads/2016/11/Omni-Arms.png" },
      { name: "Muramasa", icon: "https://lienquan.garena.vn/wp-content/uploads/2016/11/Muramasa.png" },
      { name: "Fenrir's Tooth", icon: "https://lienquan.garena.vn/wp-content/uploads/2016/11/Fenrirs-Tooth.png" },
      { name: "Blade of Eternity", icon: "https://lienquan.garena.vn/wp-content/uploads/2016/11/Blade-of-Eternity.png" }
    ],
    runes: [
      { name: "Onslaught", icon: "https://lienquan.garena.vn/wp-content/uploads/2017/04/Onslaught.png" },
      { name: "Spirit", icon: "https://lienquan.garena.vn/wp-content/uploads/2017/04/Spirit.png" },
      { name: "Dragon's Claw", icon: "https://lienquan.garena.vn/wp-content/uploads/2017/04/Dragons-Claw.png" }
    ],
    challengerSkill: { name: "Flicker", icon: "https://lienquan.garena.vn/wp-content/uploads/2016/11/Flicker.png" },
    enchantments: {
      main: [
        "https://lienquan.garena.vn/wp-content/uploads/2019/07/Veda.png",
        "https://lienquan.garena.vn/wp-content/uploads/2019/07/Desperate-Duel.png"
      ],
      sub: [
        "https://lienquan.garena.vn/wp-content/uploads/2019/07/Lokheim.png",
        "https://lienquan.garena.vn/wp-content/uploads/2019/07/Devourer.png"
      ]
    }
  };

  const otherHeroes = [
    { name: 'Krixi', slug: 'krixi', avatar: 'https://ui-avatars.com/api/?name=Krixi', classes: ['Mage'], survivability: 3, attackDamage: 4, skillEffect: 9, difficulty: 4 },
    { name: 'Valhein', slug: 'valhein', avatar: 'https://ui-avatars.com/api/?name=Valhein', classes: ['Carry'], survivability: 4, attackDamage: 8, skillEffect: 5, difficulty: 3 },
    { name: 'Zanis', slug: 'zanis', avatar: 'https://ui-avatars.com/api/?name=Zanis', classes: ['Assassin'], survivability: 5, attackDamage: 8, skillEffect: 4, difficulty: 6 },
    { name: 'Arthur', slug: 'arthur', avatar: 'https://ui-avatars.com/api/?name=Arthur', classes: ['Tank', 'Fighter'], survivability: 8, attackDamage: 6, skillEffect: 5, difficulty: 3 },
    { name: 'Butterfly', slug: 'butterfly', avatar: 'https://ui-avatars.com/api/?name=Butterfly', classes: ['Assassin'], survivability: 4, attackDamage: 9, skillEffect: 3, difficulty: 5 },
    { name: 'Alice', slug: 'alice', avatar: 'https://ui-avatars.com/api/?name=Alice', classes: ['Support'], survivability: 5, attackDamage: 3, skillEffect: 8, difficulty: 5 }
  ];

  const allHeroes = [airi, ...otherHeroes];

  for (const hero of allHeroes) {
    await prisma.hero.upsert({
      where: { slug: hero.slug },
      update: {
        classes: hero.classes,
        recommendedItems: hero.recommendedItems || null,
        runes: hero.runes || null,
        challengerSkill: hero.challengerSkill || null,
        enchantments: hero.enchantments || null
      },
      create: {
        slug: hero.slug,
        name: hero.name,
        avatar: hero.avatar || `https://ui-avatars.com/api/?name=${hero.name}`,
        splashArt: hero.splashArt || `https://ui-avatars.com/api/?name=${hero.name}`,
        classes: hero.classes,
        survivability: hero.survivability,
        attackDamage: hero.attackDamage,
        skillEffect: hero.skillEffect,
        difficulty: hero.difficulty,
        recommendedItems: hero.recommendedItems || null,
        runes: hero.runes || null,
        challengerSkill: hero.challengerSkill || null,
        enchantments: hero.enchantments || null,
        skills: {
          create: [
            { name: 'Auto Attack', description: 'Deals basic physical damage to enemies.', type: 'Normal' }
          ]
        }
      }
    });
  }

  console.log('✅ Advanced Database successfully populated!');
  await prisma.$disconnect();
}

populateAdvancedData();
