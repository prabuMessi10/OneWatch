import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

const api = axios.create({
    baseURL: `${API_URL}/movies`,
});

export const getAuthUrl = (): string => `${API_URL}/auth`;

export const getTrending = async (): Promise<any> => {
    const response = await api.get('/trending');
    return response.data;
};

export const searchMovies = async (query: string): Promise<any> => {
    const response = await api.get(`/search?q=${query}`);
    return response.data;
};

export const getMoviesByGenre = async (genreId: string | number): Promise<any> => {
    const response = await api.get(`/genre/${genreId}`);
    return response.data;
};

export const getMovieDetails = async (id: string | number): Promise<any> => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const getRecommendations = async (id: string | number): Promise<any> => {
    const response = await api.get(`/${id}/recommendations`);
    return response.data;
};

// Watchlist API functions
const getAuthHeader = () => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) return {};
    try {
        const userInfo = JSON.parse(userInfoStr);
        return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
    } catch {
        return {};
    }
};

export const getMyList = async (): Promise<any> => {
    const response = await axios.get(`${API_URL}/watchlist`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const addToList = async (movieId: string | number, movieData: any): Promise<any> => {
    const response = await axios.post(`${API_URL}/watchlist/${movieId}`, movieData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const removeFromList = async (movieId: string | number): Promise<any> => {
    const response = await axios.delete(`${API_URL}/watchlist/${movieId}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const checkInList = async (movieId: string | number): Promise<any> => {
    const response = await axios.get(`${API_URL}/watchlist/check/${movieId}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

// User Profile API functions
export const getUserProfile = async (): Promise<any> => {
    const response = await axios.get(`${API_URL}/user/profile`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateUserProfile = async (userData: any): Promise<any> => {
    const response = await axios.put(`${API_URL}/user/profile`, userData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const changePassword = async (passwordData: any): Promise<any> => {
    const response = await axios.put(`${API_URL}/user/password`, passwordData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export default api;


