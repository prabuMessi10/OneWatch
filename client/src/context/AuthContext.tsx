import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { login as loginApi, register as registerApi } from '../services/authService';

interface User {
    id?: string;
    username: string;
    email?: string;
    token?: string;
    // Add other fields as necessary
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (username: string, email: string, password: string) => Promise<any>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check local storage for user info on initial load
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user info from storage", error);
                localStorage.removeItem('userInfo');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginApi(email, password);
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data; // Return data for component internal logic (like redirects)
    };

    const register = async (username: string, email: string, password: string) => {
        const data = await registerApi(username, email, password);
        // Note: Register usually returns a message "check email", not a token immediately if verification is on.
        // If it does return a token, we should set it.
        if (data.token) {
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        }
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const updateUser = (userData: Partial<User>) => {
        // Helper to update specific fields without full login
        if (!user) return;
        const newUser = { ...user, ...userData };
        setUser(newUser);
        localStorage.setItem('userInfo', JSON.stringify(newUser));
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

