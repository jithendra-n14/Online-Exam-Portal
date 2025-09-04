const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get user dashboard info
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to your dashboard!",
    userId: req.user.id,
    availableTopics: ["Math", "Science", "History", "Programming"],
    difficulties: ["Easy", "Medium", "Hard"]
  });
});

module.exports = router;
