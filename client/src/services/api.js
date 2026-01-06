import axios from 'axios';

const API_URL = `http://${window.location.hostname}:5000/api`;

const api = axios.create({
    baseURL: `${API_URL}/movies`,
});

export const getAuthUrl = () => `${API_URL}/auth`;

export const getTrending = async () => {
    const response = await api.get('/trending');
    return response.data;
};

export const searchMovies = async (query) => {
    const response = await api.get(`/search?q=${query}`);
    return response.data;
};

export const getMoviesByGenre = async (genreId) => {
    const response = await api.get(`/genre/${genreId}`);
    return response.data;
};

export const getMovieDetails = async (id) => {

    const response = await api.get(`/${id}`);
    return response.data;
};

export const getRecommendations = async (id) => {
    const response = await api.get(`/${id}/recommendations`);
    return response.data;
};

// Watchlist API functions
const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
};

export const getMyList = async () => {
    const response = await axios.get(`${API_URL}/watchlist`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const addToList = async (movieId, movieData) => {
    const response = await axios.post(`${API_URL}/watchlist/${movieId}`, movieData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const removeFromList = async (movieId) => {
    const response = await axios.delete(`${API_URL}/watchlist/${movieId}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const checkInList = async (movieId) => {
    const response = await axios.get(`${API_URL}/watchlist/check/${movieId}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

// User Profile API functions
export const getUserProfile = async () => {
    const response = await axios.get(`${API_URL}/user/profile`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await axios.put(`${API_URL}/user/profile`, userData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await axios.put(`${API_URL}/user/password`, passwordData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export default api;

