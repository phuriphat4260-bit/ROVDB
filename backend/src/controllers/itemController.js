const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ success: false, message: 'Server error fetching items' });
  }
};

const getItemBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const item = await prisma.item.findUnique({ where: { slug } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    console.error(`Error fetching item ${slug}:`, error);
    res.status(500).json({ success: false, message: 'Server error fetching item' });
  }
};

const getItemByName = async (req, res) => {
  const { name } = req.params;
  try {
    const item = await prisma.item.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    console.error(`Error fetching item by name ${name}:`, error);
    res.status(500).json({ success: false, message: 'Server error fetching item' });
  }
};

module.exports = { getAllItems, getItemBySlug, getItemByName };
