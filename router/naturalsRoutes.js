const express = require('express');
const router = express.Router();
const naturalsController = require('../controllers/naturalsController');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new naturals entry
router.post('/naturals', naturalsController.createNaturalsEntry);

// Read all naturals entries
// router.get('/naturals', naturalsController.getAllNaturalsEntries);

// Read a specific naturals entry by ID
router.get('/naturals/:id', naturalsController.getNaturalsEntryByUserId);

// Update a naturals entry by ID
// router.put('/naturals/:id', naturalsController.updateNaturalsEntry);

// Delete a naturals entry by ID
// router.delete('/naturals/:id', naturalsController.deleteNaturalsEntry);

module.exports = router;
