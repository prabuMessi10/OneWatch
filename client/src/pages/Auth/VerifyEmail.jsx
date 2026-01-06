import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { verifyEmail } from '../../services/authService';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (code.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await verifyEmail(code);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-netflix-dark relative">
            <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center opacity-50"></div>
            <Navbar />

            <div className="relative z-10 min-h-screen flex items-center justify-center">
                <div className="bg-black/80 p-12 rounded-lg text-center max-w-lg w-full">
                    {!success ? (
                        <>
                            <div className="text-6xl mb-6">📧</div>
                            <h2 className="text-3xl font-bold text-white mb-4">Verify Your Email</h2>
                            <p className="text-gray-300 mb-2">
                                We've sent a 6-digit verification code to:
                            </p>
                            <p className="text-netflix-red font-bold mb-8">{email || 'your email'}</p>

                            {error && <p className="text-red-500 mb-4">{error}</p>}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    className="w-full p-4 bg-zinc-700 rounded text-white text-center text-2xl tracking-widest outline-none focus:bg-zinc-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    autoFocus
                                />

                                <button
                                    type="submit"
                                    disabled={loading || code.length !== 6}
                                    className="w-full bg-netflix-red text-white py-3 rounded font-bold hover:bg-red-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Verifying...' : 'Verify Email'}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <p className="text-gray-500 text-sm">
                                    Didn't receive the code?{' '}
                                    <Link to="/signup" className="text-netflix-red hover:underline">
                                        Sign up again
                                    </Link>
                                </p>
                                <p className="text-gray-600 text-xs mt-2">
                                    Code expires in 5 minutes
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-6xl mb-6">✅</div>
                            <h2 className="text-3xl font-bold text-green-500 mb-4">Email Verified!</h2>
                            <p className="text-gray-300 mb-8">
                                Your email has been successfully verified. Redirecting to login...
                            </p>
                            <Link to="/login" className="bg-netflix-red text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition inline-block">
                                Go to Login Now
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
