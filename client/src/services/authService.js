import axios from 'axios';
import { getAuthUrl } from './api';

export const login = async (email, password) => {
    const response = await axios.post(`${getAuthUrl()}/login`, { email, password });
    return response.data;
};

export const register = async (username, email, password) => {
    // Note: requires password confirmation in UI but backend only needs password
    const response = await axios.post(`${getAuthUrl()}/register`, { username, email, password });
    return response.data;
};

export const verifyEmail = async (code) => {
    const response = await axios.post(`${getAuthUrl()}/verify-email`, { code });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await axios.post(`${getAuthUrl()}/forgot-password`, { email });
    return response.data;
};

export const resetPassword = async (code, newPassword) => {
    const response = await axios.post(`${getAuthUrl()}/reset-password`, { code, newPassword });
    return response.data;
};
