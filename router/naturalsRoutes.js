const express = require('express');
const router = express.Router();
const naturalsController = require('../controllers/naturalsController');

// Create a new naturals entry
router.post('/naturals', naturalsController.createNaturalsEntry);

// Read all naturals entries
router.get('/naturals', naturalsController.getAllNaturalsEntries);

// Read a specific naturals entry by ID
router.get('/naturals/:id', naturalsController.getNaturalsEntryById);

// Update a naturals entry by ID
router.put('/naturals/:id', naturalsController.updateNaturalsEntry);

// Delete a naturals entry by ID
router.delete('/naturals/:id', naturalsController.deleteNaturalsEntry);

module.exports = router;