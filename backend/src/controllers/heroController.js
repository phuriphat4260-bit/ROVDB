const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all heroes
const getHeroes = async (req, res) => {
  try {
    const heroes = await prisma.hero.findMany({
      include: {
        skills: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    res.json({ success: true, data: heroes });
  } catch (error) {
    console.error('Error fetching heroes:', error);
    res.status(500).json({ success: false, message: 'Server error fetching heroes' });
  }
};

// Get single hero by slug
const getHeroBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const hero = await prisma.hero.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        skills: true
      }
    });

    if (!hero) {
      return res.status(404).json({ success: false, message: 'Hero not found' });
    }

    res.json({ success: true, data: hero });
  } catch (error) {
    console.error(`Error fetching hero ${slug}:`, error);
    res.status(500).json({ success: false, message: 'Server error fetching hero' });
  }
};

module.exports = {
  getHeroes,
  getHeroBySlug
};
