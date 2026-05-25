const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get custom build for a user and a hero
exports.getCustomBuild = async (req, res) => {
  try {
    const { heroSlug } = req.params;
    const userId = req.user.id;

    const hero = await prisma.hero.findUnique({ where: { slug: heroSlug } });
    if (!hero) {
      return res.status(404).json({ success: false, message: 'Hero not found' });
    }

    const build = await prisma.customBuild.findUnique({
      where: {
        userId_heroId: {
          userId,
          heroId: hero.id
        }
      }
    });

    res.json({ success: true, data: build });
  } catch (error) {
    console.error('getCustomBuild error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update custom build
exports.updateCustomBuild = async (req, res) => {
  try {
    const { heroSlug } = req.params;
    const userId = req.user.id;
    const { recommendedItems, runes, enchantments, challengerSkill } = req.body;

    const hero = await prisma.hero.findUnique({ where: { slug: heroSlug } });
    if (!hero) {
      return res.status(404).json({ success: false, message: 'Hero not found' });
    }

    const build = await prisma.customBuild.upsert({
      where: {
        userId_heroId: {
          userId,
          heroId: hero.id
        }
      },
      update: {
        recommendedItems: recommendedItems !== undefined ? recommendedItems : undefined,
        runes: runes !== undefined ? runes : undefined,
        enchantments: enchantments !== undefined ? enchantments : undefined,
        challengerSkill: challengerSkill !== undefined ? challengerSkill : undefined,
      },
      create: {
        userId,
        heroId: hero.id,
        recommendedItems: recommendedItems || null,
        runes: runes || null,
        enchantments: enchantments || null,
        challengerSkill: challengerSkill || null
      }
    });

    res.json({ success: true, data: build });
  } catch (error) {
    console.error('updateCustomBuild error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
