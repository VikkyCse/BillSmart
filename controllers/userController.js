const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
const { validationResult } = require('express-validator');

// dotenv.config();

// const secretKey = "mysecretpassword123";

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

// User registration
const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, rfid, User_name, password, usertype, gender, isHosteller, rollNo } = req.body;

  try {
    const existingUser = await User.findOne({ where: { User_name } });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, rfid, User_name, password: hashedPassword, usertype, gender, isHosteller, rollNo });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
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

    // const token = jwt.sign({ id: user.id, User_name: user.User_name }, secretKey, {
    //   expiresIn: '1h',
    // });

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
  registerUser,
  loginUser,
};