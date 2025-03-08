const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// Route to block a card
router.post('/block', cardController.blockCard);

// Route to reissue a card
router.post('/reissue', cardController.reissueCard);

module.exports = router;