const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllRunes = async (req, res) => {
  try {
    const runes = await prisma.rune.findMany();
    res.json({ success: true, data: runes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRuneBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const rune = await prisma.rune.findUnique({ where: { slug } });
    if (!rune) return res.status(404).json({ success: false, message: 'Rune not found' });
    res.json({ success: true, data: rune });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRuneByName = async (req, res) => {
  const { name } = req.params;
  try {
    const rune = await prisma.rune.findFirst({
      where: { name: { contains: name, mode: 'insensitive' } },
      orderBy: { level: 'desc' }
    });
    if (!rune) return res.status(404).json({ success: false, message: 'Rune not found' });
    res.json({ success: true, data: rune });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllRunes, getRuneBySlug, getRuneByName };
