/**
 * Case Routes - Defines API endpoints for cases
 */

const express = require('express');
const caseController = require('../controllers/caseController');

const router = express.Router();

// Get all cases
router.get('/', caseController.getAllCases);

// Get a single case by ID
router.get('/:id', caseController.getCaseById);

// Update case status
router.put('/:id/status', caseController.updateCaseStatus);

// Generate daily fraud cases file
router.post('/generate-fraud-file', caseController.generateFraudCasesFile);

module.exports = router;