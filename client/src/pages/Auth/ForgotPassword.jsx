import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { forgotPassword } from '../../services/authService';


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const data = await forgotPassword(email);
            setMessage(data.message);

            // Navigate to reset password page after code is sent
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
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
                    <h2 className="text-3xl font-bold text-white mb-6">Forgot Password</h2>
                    <p className="text-gray-400 mb-6">Enter your email address and we'll send you a 6-digit code to reset your password.</p>

                    {message && <div className="bg-green-500/20 text-green-500 p-3 rounded mb-4">{message}</div>}
                    {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="p-3 bg-zinc-700 rounded text-white outline-none focus:bg-zinc-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-netflix-red text-white py-3 rounded font-bold hover:bg-red-700 transition mt-4 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending code...
                                </>
                            ) : 'Send Reset Code'}
                        </button>

                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-white hover:underline">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
