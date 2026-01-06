import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { resetPassword } from '../../services/authService';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (code.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError('');

        try {
            await resetPassword(code, newPassword);
            setMessage('Password reset successful! Redirecting to login...');

            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired code');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-netflix-dark relative">
            <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center opacity-50"></div>
            <Navbar />
            <div className="relative z-10 min-h-screen flex items-center justify-center">
                <div className="bg-black/80 p-12 rounded-lg w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">🔐</div>
                        <h2 className="text-3xl font-bold text-white">Reset Password</h2>
                        {email && <p className="text-gray-400 mt-2text-sm">Code sent to: <span className="text-netflix-red">{email}</span></p>}
                    </div>

                    {message && <div className="bg-green-500/20 text-green-500 p-3 rounded mb-4 text-center">{message}</div>}
                    {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="p-4 bg-zinc-700 rounded text-white text-center text-xl tracking-widest outline-none focus:bg-zinc-600"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            required
                            autoFocus
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="p-3 bg-zinc-700 rounded text-white outline-none focus:bg-zinc-600"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="p-3 bg-zinc-700 rounded text-white outline-none focus:bg-zinc-600"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading || code.length !== 6}
                            className="bg-netflix-red text-white py-3 rounded font-bold hover:bg-red-700 transition mt-4 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Resetting password...
                                </>
                            ) : 'Reset Password'}
                        </button>
                    </form>

                    <p className="text-gray-600 text-xs mt-4 text-center">
                        Code expires in 10 minutes
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
