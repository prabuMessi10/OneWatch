const tmdbService = require('../services/tmdbService');

exports.getTrending = async (req, res) => {
    try {
        const data = await tmdbService.fetchTrending();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchMovies = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ message: 'Query parameter required' });
        const data = await tmdbService.fetchSearch(query);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMovieDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const details = await tmdbService.fetchMovieDetails(id);
        const videos = await tmdbService.fetchMovieVideos(id);
        // Combine them or send as logic prefers. Sending combined.
        res.json({ ...details, videos: videos.results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMoviesByGenre = async (req, res) => {
    try {
        const { genreId } = req.params;
        const data = await tmdbService.fetchByGenre(genreId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await tmdbService.fetchRecommendations(id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
