const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model
const activeTokens = {};

// Registration controller
const register = async (req, res) => {
  try {
    const { User_name, password, gender, isHosteller, rollNo,name } = req.body;
  
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { User_name } });

    if (existingUser) {
      return res.status(200).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, User_name : User_name.toLowerCase(), password: hashedPassword, usertype:0, gender, isHosteller, rollNo : rollNo.toUpperCase(), natural_amt:0,amount:0 });

  
    res.status(201).json({ message : "success"});
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
      return res.status(401).json({ error: 'Invalid username' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token with an expiry time of 1 day
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '4y', 
    });

    res.status(200).json({ token , id:user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

const loginwithRfid = async (req, res) => {
  try {
    const { rfid } = req.body;

    let user = null;

    // Check if authentication method is RFID
    if (rfid) {
      // Fetch the user associated with the RFID card
      user = await User.findOne({ where: { rfid } });

      if (!user) {
        return res.status(401).json({ error: 'Invalid RFID card' });
      }
    } 
   
    // Generate a JWT token with an expiry time of 1 day
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '30m', 
    });

    activeTokens[rfid] = 1;

    res.status(200).json({ token, id: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

const logoutwithRfid = async (req, res) => {
  try {
    const { rfid } = req.body;

    if (rfid in activeTokens) {
      delete activeTokens[rfid];
    }

    
    res.status(200).json({ message:"success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
};


const clearActiveTokens = () => {

  for (const key in activeTokens) {
    delete activeTokens[key];
  }
  console.log('All active tokens cleared.');
};


setInterval(clearActiveTokens, 600000);



module.exports = {
  register,
  login,
  loginwithRfid,
  logoutwithRfid
};
