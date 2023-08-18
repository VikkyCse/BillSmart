const { Op } = require('sequelize');
const User = require('../models/User');
const Naturals = require('../models/Naturals');

const createNaturalsEntry = async (req, res) => {
  try {
    const { user_id, time, amount } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isHosteller !== 1) {
      return res.status(400).json({ message: 'Not a Hosteller' });
    }

    if (user.gender === 0) {
      if (user.amount < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      const updatedUser = await user.decrement('amount', { by: amount });
      await Naturals.create({ user_id, time });
      return res.status(201).json({ message: 'Naturals entry created', user: updatedUser });
    } else {
      const currentDate = new Date();
      const lastEntry = await Naturals.findOne({
        where: {
          user_id,
          time: {
            [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
          },
        },
      });

      if (!lastEntry) {
        await Naturals.create({ user_id, time });
        return res.status(201).json({ message: 'Entry created for the boy' });
      } else {
        return res.status(400).json({ message: 'Boys can only have one entry per month' });
      }
    }
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'An error occurred' });
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
