/**
 * Card Routes - Defines API endpoints for cards
 */

const express = require('express');
const cardController = require('../controllers/cardController');

const router = express.Router();

// Get all blocked cards
router.get('/blocked', cardController.getAllBlockedCards);

// Block a card
router.post('/:cardNumber/block', cardController.blockCard);

// Reissue a card
router.post('/:cardNumber/reissue', cardController.reissueCard);

module.exports = router;