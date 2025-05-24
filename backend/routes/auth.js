const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user (protected route)
router.get('/me', auth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      isAdmin: req.user.isAdmin
    }
  });
});

module.exports = router; 