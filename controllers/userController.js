const User = require('../models/User');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { User_name, rfid, name, amount, usertype, gender, isHosteller, natural_amt, rollNo, password } = req.body;
    const user = await User.create({ User_name, rfid, name, amount, usertype, gender, isHosteller, natural_amt, rollNo, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the user' });
  }
};

// Read all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Read a specific user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user by ID' });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { User_name, rfid, name, amount, usertype, gender, isHosteller, natural_amt, rollNo, password } = req.body;
    const updatedUser = await User.update(
      { User_name, rfid, name, amount, usertype, gender, isHosteller, natural_amt, rollNo, password },
      { where: { id: userId } }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the user' });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the user' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
