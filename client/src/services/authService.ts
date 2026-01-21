import axios from 'axios';
import { getAuthUrl } from './api';

export const login = async (email: string, password?: string): Promise<any> => {
    const response = await axios.post(`${getAuthUrl()}/login`, { email, password });
    return response.data;
};

export const register = async (username: string, email: string, password?: string): Promise<any> => {
    // Note: requires password confirmation in UI but backend only needs password
    const response = await axios.post(`${getAuthUrl()}/register`, { username, email, password });
    return response.data;
};

export const verifyEmail = async (code: string): Promise<any> => {
    const response = await axios.post(`${getAuthUrl()}/verify-email`, { code });
    return response.data;
};

export const forgotPassword = async (email: string): Promise<any> => {
    const response = await axios.post(`${getAuthUrl()}/forgot-password`, { email });
    return response.data;
};

export const resetPassword = async (code: string, newPassword: string): Promise<any> => {
    const response = await axios.post(`${getAuthUrl()}/reset-password`, { code, newPassword });
    return response.data;
};

