const User = require('../models/User');

const { validationResult } = require('express-validator');



// Create a new user
const createUser = async (req, res) => {
  try {
    const { User_name, rfid, name, amount, usertype, gender, isHosteller, natural_amt, rollNo, password } = req.body;
    const user = await User.create({ User_name, rfid, name, amount, usertype, gender, isHosteller, natural_amt, rollNo, password });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the user' ,err});
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

const updateUserPassword = async (req, res) => {
  try {
    const userId = req.params.id; // Extract user ID from the request parameters
    const { password, newpassword } = req.body; // Extract password and new password from the request body
    
    // Find the user by their ID
    const user1 = await User.findByPk(userId);
    
    // Check if the provided current password matches the user's current password
    if (password == user1.password) {
      // Update the user's password with the new password
      const updatedUser = await User.update(
        { password: newpassword },
        { where: { id: userId } }
      );
      res.status(200).json(updatedUser); // Respond with the updated user object
    } else {
      res.status(500).json({ error: 'wrong password' }); // Respond with an error message if the passwords don't match
    }
  } catch (err) {
    res.status(500).json({ error: 'Error updating the user' }); // Respond with a generic error message if an exception occurs
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



// User login
const loginUser = async (req, res) => {
  const { name, password, rfid } = req.query;

  try {
    let user;

    if (rfid) {
      user = await User.findOne({ where: { rfid } });
    } else {
      user = await User.findOne({ where: { name } });
      console.log(user);
      if (!user) {
        return res.status(401).json({ message: "errror" });
      }
    }


    return res.json({ message : true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  updateUserPassword
};