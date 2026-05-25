const express = require('express');
const router = express.Router();
const { getAllItems, getItemBySlug, getItemByName } = require('../controllers/itemController');

router.get('/', getAllItems);
router.get('/by-name/:name', getItemByName);
router.get('/:slug', getItemBySlug);

module.exports = router;
