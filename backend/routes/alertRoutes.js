const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// Route to process a transaction
router.post('/process', alertController.processTransaction);

// Route to get all alerts
router.get('/', alertController.getAlerts);

module.exports = router;