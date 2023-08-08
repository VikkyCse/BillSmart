const Naturals = require('../models/Naturals');

// Create a new naturals entry
const createNaturalsEntry = async (req, res) => {
  try {
    const { user_id, time } = req.body;
    const naturalsEntry = await Naturals.create({ user_id, time });
    res.status(201).json(naturalsEntry);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the naturals entry' });
  }
};

// Read all naturals entries
const getAllNaturalsEntries = async (req, res) => {
  try {
    const naturalsEntries = await Naturals.findAll();
    res.status(200).json(naturalsEntries);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching naturals entries' });
  }
};

// Read a specific naturals entry by ID
const getNaturalsEntryById = async (req, res) => {
  try {
    const naturalsEntryId = req.params.id;
    const naturalsEntry = await Naturals.findByPk(naturalsEntryId);
    if (!naturalsEntry) {
      return res.status(404).json({ message: 'Naturals entry not found' });
    }
    res.status(200).json(naturalsEntry);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching naturals entry by ID' });
  }
};

// Update a naturals entry by ID
const updateNaturalsEntry = async (req, res) => {
  try {
    const naturalsEntryId = req.params.id;
    const { user_id, time } = req.body;
    const updatedNaturalsEntry = await Naturals.update(
      { user_id, time },
      { where: { id: naturalsEntryId } }
    );
    res.status(200).json(updatedNaturalsEntry);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the naturals entry' });
  }
};

// Delete a naturals entry by ID
const deleteNaturalsEntry = async (req, res) => {
  try {
    const naturalsEntryId = req.params.id;
    await Naturals.destroy({ where: { id: naturalsEntryId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the naturals entry' });
  }
};

module.exports = {
  createNaturalsEntry,
  getAllNaturalsEntries,
  getNaturalsEntryById,
  updateNaturalsEntry,
  deleteNaturalsEntry,
};
