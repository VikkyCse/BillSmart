const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model

// Registration controller
const register = async (req, res) => {
  try {
    const { User_name, password, gender, isHosteller, rollNo } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ where: { User_name } });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user  
    const newUser = await User.create({ User_name, password: hashedPassword, gender, isHosteller, rollNo });

    // Generate a JWT token with an expiry time of 1 day
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d', // Expiry time set to 1 day
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error registering user' });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { User_name, password } = req.body;

    // Find the user by their username
    const user = await User.findOne({ where: { User_name } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token with an expiry time of 1 day
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d', // Expiry time set to 1 day
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

module.exports = {
  register,
  login,
};
