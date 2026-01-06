import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { register } from '../../services/authService';



const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await register(username, email, password);
            // Redirect to verification page with email as state
            navigate('/verify-email', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }

    };


    return (
        <div className="min-h-screen bg-netflix-dark bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-no-repeat bg-center">
            <div className="absolute inset-0 bg-black/60"></div>
            <Navbar />

            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="bg-black/75 p-16 rounded-lg w-full max-w-md">
                    <h2 className="text-4xl text-white font-bold mb-8">Sign Up</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            className="p-3 bg-zinc-700 rounded text-white outline-none focus:bg-zinc-600"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="p-3 bg-zinc-700 rounded text-white outline-none focus:bg-zinc-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="p-3 bg-zinc-700 rounded text-white outline-none focus:bg-zinc-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="p-3 bg-zinc-700 rounded text-white outline-none focus:bg-zinc-600"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    Sending verification code...
                                </>
                            ) : 'Sign Up'}
                        </button>

                    </form>
                    <p className="text-gray-400 mt-6">
                        Already have an account? <Link to="/login" className="text-white hover:underline">Sign in now</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
