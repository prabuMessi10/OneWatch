import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Info } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { login } from '../../services/authService';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState(location.state?.message || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            localStorage.setItem('userInfo', JSON.stringify(data));
            const returnUrl = location.state?.from || '/';
            navigate(returnUrl);
        } catch (err) {

            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-netflix-dark bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-no-repeat bg-center">
            <div className="absolute inset-0 bg-black/60"></div>
            <Navbar />

            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="bg-black/75 p-16 rounded-lg w-full max-w-md">
                    <h2 className="text-4xl text-white font-bold mb-8">Sign In</h2>
                    {infoMessage && !error && (
                        <div className="bg-blue-600/20 border border-blue-500/50 text-blue-100 p-4 rounded-lg mb-6 flex items-center gap-3 animate-pulse">
                            <Info size={20} className="shrink-0" />
                            <p className="text-sm font-medium">{infoMessage}</p>
                        </div>
                    )}
                    {error && <p className="text-red-500 mb-4 bg-red-500/10 p-3 rounded border border-red-500/20">{error}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
                        <div className="flex justify-end">
                            <Link to="/forgot-password" class="text-gray-400 hover:text-white text-sm">
                                Forgot Password?
                            </Link>
                        </div>
                        <button type="submit" className="bg-netflix-red text-white py-3 rounded font-bold hover:bg-red-700 transition mt-4">
                            Sign In

                        </button>
                    </form>
                    <p className="text-gray-400 mt-6">
                        New to TrailerFlix? <Link to="/signup" className="text-white hover:underline">Sign up now</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
