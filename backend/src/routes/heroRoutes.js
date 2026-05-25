const express = require('express');
const router = express.Router();
const { getHeroes, getHeroBySlug } = require('../controllers/heroController');

// Route to get all heroes
router.get('/', getHeroes);

// Route to get a specific hero by slug
router.get('/:slug', getHeroBySlug);

module.exports = router;
