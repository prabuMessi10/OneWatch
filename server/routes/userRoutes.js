const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getUserProfile,
    updateUserProfile,
    changePassword
} = require('../controllers/userController');

// All routes require authentication
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, changePassword);

module.exports = router;
