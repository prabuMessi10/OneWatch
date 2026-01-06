const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getMyList,
    addToList,
    removeFromList,
    checkInList
} = require('../controllers/watchlistController');

// All routes require authentication
router.get('/', protect, getMyList);
router.post('/:movieId', protect, addToList);
router.delete('/:movieId', protect, removeFromList);
router.get('/check/:movieId', protect, checkInList);

module.exports = router;
