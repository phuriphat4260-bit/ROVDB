const express = require('express');
const router = express.Router();
const { getCustomBuild, updateCustomBuild } = require('../controllers/buildController');
const { protect } = require('../controllers/authController');

router.get('/:heroSlug', protect, getCustomBuild);
router.put('/:heroSlug', protect, updateCustomBuild);

module.exports = router;
