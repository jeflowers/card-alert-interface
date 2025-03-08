/**
 * Alert Routes - Defines API endpoints for alerts
 */

const express = require('express');
const alertController = require('../controllers/alertController');

const router = express.Router();

// Get all alerts
router.get('/', alertController.getAllAlerts);

// Get a single alert by ID
router.get('/:id', alertController.getAlertById);

// Create a case from an alert
router.post('/:alertId/case', alertController.createCaseFromAlert);

module.exports = router;