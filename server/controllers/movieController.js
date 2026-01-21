const tmdbService = require('../services/tmdbService');
const ytSearch = require('yt-search');

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
        let videos = await tmdbService.fetchMovieVideos(id);

        // Fallback: If TMDB returns no videos, search YouTube
        if (!videos.results || videos.results.length === 0) {
            console.log(`No videos found on TMDB for ${details.title}. Searching YouTube...`);
            const year = details.release_date ? new Date(details.release_date).getFullYear() : '';
            const query = `${details.title} ${year} Official Trailer`;

            try {
                const searchResults = await ytSearch(query);
                if (searchResults && searchResults.videos && searchResults.videos.length > 0) {
                    const topVideo = searchResults.videos[0];
                    // Construct a TMDB-compatible video object
                    videos.results = [{
                        id: topVideo.videoId,
                        key: topVideo.videoId,
                        site: "YouTube",
                        type: "Trailer",
                        name: topVideo.title,
                        official: false,
                        iso_639_1: 'en' // Defaulting to en for compatibility
                    }];
                    console.log(`Found fallback video: ${topVideo.title}`);
                }
            } catch (searchError) {
                console.error("YouTube fallback search failed:", searchError);
            }
        }

        res.json({ ...details, videos: videos.results || [] });
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
