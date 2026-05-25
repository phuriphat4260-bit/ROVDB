const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const heroesData = [
  {
    slug: 'murad',
    name: 'Murad',
    avatar: 'https://cdn.discordapp.com/attachments/111/murad_avatar.jpg', // placeholders
    splashArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDmgzuRQPnkOqD8SLrGG1HNQSMRvjy_YLGPLLJRRzxnT9mNLWSwsh9Cc2ZaZMCE-95My6fwQdK4Srh8X7e6wUCzKvy8iVe5Lr1D0T9E_HZ-wJrD7tKvTh72N5oYfBhUTCqw8wESEzHjfoxOgLIlAmLfTktrBsEkK-zux2p9DmPUJpzA_ewuior1cIB6Px1hXKlBDiBOGskGddGPkK90zq_e-bz0YQ0yhcfABdXoJCE2Sj7eWDY1UcHKi1B0pkYdswl2N6ayj-CfSs',
    classes: ['Assassin'],
    survivability: 3,
    attackDamage: 8,
    skillEffect: 7,
    difficulty: 9,
    skills: {
      create: [
        { name: 'Rift', icon: 'passive_icon_url', description: 'Murad gains a stack of Rift on every 4th normal attack.', type: 'Passive' },
        { name: 'Thorn of Time', icon: 'skill1_icon', description: 'Murad dashes forward, dealing physical damage.', cooldown: '10/9.6/9.2/8.8/8.4/8', manaCost: '60/65/70/75/80/85', type: 'Skill 1' },
        { name: 'Another Dimension', icon: 'skill2_icon', description: 'Murad creates a spatial rift, dealing damage.', cooldown: '12/11.4/10.8/10.2/9.6/9', manaCost: '60/65/70/75/80/85', type: 'Skill 2' },
        { name: 'Temporal Dictation', icon: 'ultimate_icon', description: 'Murad unleashes 5 attacks in an area.', cooldown: '12', manaCost: '120/135/150', type: 'Ultimate' }
      ]
    }
  },
  {
    slug: 'thane',
    name: 'Thane',
    avatar: 'https://cdn.discordapp.com/attachments/111/thane_avatar.jpg',
    splashArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5at14g5EN2N7knHoMBuYp9pYlZntQ-t-0CmrnPeyQav_bj2xcbQPc245TZEf73h6XQ7Qdx7D7d9DXvl72iQyOHULusov9K2ZI9fCmZRKCYUWlQ0D6WeZJJRF4vCDve1_S85AM6yhCOuMccYuUod6kMceLf8O2LFAipkSYHJWBW0K_4a3ytGTB47w2O5X0Y-HlCXn5h79JGCF6qiuECtY4b8G94Xb9rJnS_H6eb7kx6xr_5rzy7h7I6UsMuWtOiiWz_CRjWDpl_uc',
    classes: ['Tank', 'Support'],
    survivability: 10,
    attackDamage: 3,
    skillEffect: 5,
    difficulty: 3,
    skills: {
      create: [
        { name: 'Royal Power', icon: 'passive_icon', description: 'When HP falls below 30%, recovers HP.', type: 'Passive' },
        { name: 'Valiant Charge', icon: 'skill1_icon', description: 'Thane charges forward, knocking back enemies.', cooldown: '12/11.2/10.4/9.6/8.8/8', manaCost: '60/65/70/75/80/85', type: 'Skill 1' },
        { name: 'Avalon\'s Fury', icon: 'skill2_icon', description: 'Thane strikes the ground, knocking up enemies.', cooldown: '10/9.4/8.8/8.2/7.6/7', manaCost: '60/65/70/75/80/85', type: 'Skill 2' },
        { name: 'Excalibur', icon: 'ultimate_icon', description: 'Thane charges up and unleashes a powerful blow.', cooldown: '40/35/30', manaCost: '150/165/180', type: 'Ultimate' }
      ]
    }
  },
  {
    slug: 'tulen',
    name: 'Tulen',
    avatar: 'https://cdn.discordapp.com/attachments/111/tulen_avatar.jpg',
    splashArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR_m8WLuYEKk3kaS-t8gok2jhRF8BDGJj6P830Y7nM_5fnpqFCr55xo7X9FlyHLmZ2F3HEwaJ2nqsb2k_yJxknf9QOHqfg9QsoWgVTP7WgxrFkmI-wEjZ8nXwWJMHZnkkKmpodr4rk5ik44CRgRxrB5AFko-k2LKAmTkER9UVennaiU-YXEccgmkNpgtR2TG9uHAuE3dqJvPIeKmFCmh1T4ZrMGPgozpxOZL90uQHrEA8wyWlq85IUvBRbxZFsMNQrOe16UPBDGAY',
    classes: ['Mage'],
    survivability: 3,
    attackDamage: 4,
    skillEffect: 9,
    difficulty: 6,
    skills: {
      create: [
        { name: 'Thunderclap', icon: 'passive', description: 'Hits with skills grant a stack. At 5 stacks, summons lightning.', type: 'Passive' },
        { name: 'Ion Cannon', icon: 'skill1', description: 'Fires 3 ion blasts.', cooldown: '8/7.6/7.2/6.8/6.4/6', manaCost: '50/55/60/65/70/75', type: 'Skill 1' },
        { name: 'Lightning Strike', icon: 'skill2', description: 'Dashes and deals damage in a small area.', cooldown: '2', manaCost: '50', type: 'Skill 2' },
        { name: 'Thunderbird', icon: 'ultimate', description: 'Summons a thunderbird to attack target.', cooldown: '35/30/25', manaCost: '120', type: 'Ultimate' }
      ]
    }
  },
  {
    slug: 'yorn',
    name: 'Yorn',
    avatar: 'https://cdn.discordapp.com/attachments/111/yorn_avatar.jpg',
    splashArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWCIHvM-WgfYU4VkYf8JRwgvzRsUsULuTJy2U2K3sK5S9zyOLDKOEz74j2KUTZ-JcU7WMNLIEx2mFRrbAChfvcuBGO_ZBhj7a2oYqpFOa6Nr8ukqK1U2CcupfYFhFYXJ3k3Jx0i29ZDOB4Uoy7CUN4OmA2gnhpaojwTEuFr3IN2NA9jECfWaawtD-mk37V3tbEDk37mUB5e9KsssO7yyKz7nhqiP8yfXT_uEA0QM9WmkxnqXofuDXBpM4LZGtxml_WteR5ZycbzXk',
    classes: ['Marksman'],
    survivability: 2,
    attackDamage: 9,
    skillEffect: 4,
    difficulty: 4,
    skills: {
      create: [
        { name: 'Fierce Shot', icon: 'passive', description: 'Every 5th normal attack fires a volley of arrows.', type: 'Passive' },
        { name: 'Explosive Arrow', icon: 'skill1', description: 'Fires an explosive arrow dealing physical damage.', cooldown: '9/8.4/7.8/7.2/6.6/6', manaCost: '70', type: 'Skill 1' },
        { name: 'Heavenly Barrage', icon: 'skill2', description: 'Calls down a barrage of arrows.', cooldown: '14/13/12/11/10/9', manaCost: '70', type: 'Skill 2' },
        { name: 'Heart Shot', icon: 'ultimate', description: 'Fires a global arrow that deals damage based on missing HP.', cooldown: '20/17/14', manaCost: '100', type: 'Ultimate' }
      ]
    }
  },
  {
    slug: 'alice',
    name: 'Alice',
    avatar: 'https://cdn.discordapp.com/attachments/111/alice_avatar.jpg',
    splashArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdYm8WnbC2BEb_LO0JIafWXYrtpU9nPIhJH_IsCIj9J7wC7DKhMzTSJy3LGsHSKKKfi1-pVHbUb8_mkZaFLMwh5H_uqsVzcw1_P4nMwG5mE8us7ZdK0zGk066_afz0n7K_e4IfugoekKSTdocAcpLqKLXQ6FQzhxL7B_v9N58Z562cZHIm9ye_6jMXNoxcIJK15awiaJQfQxhkqfwsEO9uJPBLysCPuqV_msXonevM5q_qyNIt628t7OhOuU7woJJO5C84ywA9PSA',
    classes: ['Support'],
    survivability: 4,
    attackDamage: 2,
    skillEffect: 8,
    difficulty: 5,
    skills: {
      create: [
        { name: 'Trot', icon: 'passive', description: 'Casting a skill increases movement speed by 20% for 1 sec.', type: 'Passive' },
        { name: 'Sunshine', icon: 'skill1', description: 'Deals magic damage and stuns enemies.', cooldown: '9/8.4/7.8/7.2/6.6/6', manaCost: '60', type: 'Skill 1' },
        { name: 'Friendship', icon: 'skill2', description: 'Shields nearby allies and increases their movement speed.', cooldown: '14/12.8/11.6/10.4/9.2/8', manaCost: '60', type: 'Skill 2' },
        { name: 'Hissy Fit', icon: 'ultimate', description: 'Creates a magical area reducing enemy magic defense and silencing them.', cooldown: '30/25/20', manaCost: '100', type: 'Ultimate' }
      ]
    }
  }
];

async function main() {
  console.log('Start seeding...');
  await prisma.hero.deleteMany({}); // clear existing
  
  for (const h of heroesData) {
    const hero = await prisma.hero.create({
      data: h,
    });
    console.log(`Created hero with id: ${hero.id} (${hero.name})`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
