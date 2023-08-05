const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

const secretKey ="mysecretpassword123";

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
