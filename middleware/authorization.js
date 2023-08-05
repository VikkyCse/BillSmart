const isAdmin = (req, res, next) => {
    if (req.user.usertype !== 1) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    next();
  };
  

  
  const isUser = (req, res, next) => {
    if (req.user.usertype !== 0) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    next();
  };
  
  module.exports = { isAdmin, isUser };
  