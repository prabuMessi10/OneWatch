const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/trending', movieController.getTrending);
router.get('/search', movieController.searchMovies);
router.get('/genre/:genreId', movieController.getMoviesByGenre);
router.get('/:id/recommendations', movieController.getRecommendations);
router.get('/:id', movieController.getMovieDetails);




module.exports = router;
