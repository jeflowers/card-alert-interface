const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

// Route to create a new case
router.post('/', caseController.createCase);

// Route to update an existing case
router.put('/:caseId', caseController.updateCase);

// Route to get all cases
router.get('/', caseController.getCases);

module.exports = router;