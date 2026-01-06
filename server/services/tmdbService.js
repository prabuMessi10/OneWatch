const axios = require('axios');

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: API_KEY,
    }
});

exports.fetchTrending = async () => {
    try {
        const response = await tmdbClient.get('/trending/movie/day');
        return response.data;
    } catch (error) {
        console.error('TMDB Error:', error.response?.data || error.message);
        throw new Error('Failed to fetch trending movies');
    }
};

exports.fetchSearch = async (query) => {
    try {
        const response = await tmdbClient.get('/search/movie', {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('TMDB Error:', error.response?.data || error.message);
        throw new Error('Failed to search movies');
    }
};

exports.fetchMovieVideos = async (id) => {
    try {
        const response = await tmdbClient.get(`/movie/${id}/videos`, {
            params: {
                // Expanded to include global languages: English, French, Spanish, German, and major Indian languages
                include_video_language: 'en,fr,es,de,hi,te,ta,ml,kn,null'
            }
        });
        return response.data;
    } catch (error) {
        console.error('TMDB Error:', error.response?.data || error.message);
        throw new Error('Failed to fetch movie videos');
    }
};

exports.fetchMovieDetails = async (id) => {
    try {
        const response = await tmdbClient.get(`/movie/${id}`, {
            params: {
                append_to_response: 'credits'
            }
        });
        return response.data;
    } catch (error) {
        console.error('TMDB Error:', error.response?.data || error.message);
        throw new Error('Failed to fetch movie details');
    }
};

exports.fetchByGenre = async (genreId) => {
    try {
        const response = await tmdbClient.get('/discover/movie', {
            params: {
                with_genres: genreId,
                sort_by: 'popularity.desc'
            }
        });
        return response.data;
    } catch (error) {
        console.error('TMDB Error:', error.response?.data || error.message);
        throw new Error('Failed to fetch movies by genre');
    }
};


