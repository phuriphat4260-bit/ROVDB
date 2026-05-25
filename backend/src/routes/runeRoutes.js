const express = require('express');
const { getAllRunes, getRuneBySlug, getRuneByName } = require('../controllers/runeController');

const router = express.Router();

router.get('/', getAllRunes);
router.get('/:slug', getRuneBySlug);
router.get('/by-name/:name', getRuneByName);

module.exports = router;
