import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { register } from '../../services/authService';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            navigate('/verify-email', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-black text-white font-sans">
             {/* Left Side - Hero/Visuals */}
             <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900">
                <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center opacity-60 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                
                <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
                    <div>
                        <h1 className="text-5xl font-display font-bold text-netflix-red drop-shadow-lg mb-4">ONE WATCH</h1>
                        <p className="text-2xl font-light text-zinc-300 max-w-md leading-relaxed">
                            Join millions of movie lovers and start your journey today.
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-netflix-red/20 rounded-full flex items-center justify-center text-netflix-red">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Unlimited Access</h3>
                                <p className="text-zinc-400 text-sm">Explore a vast library of trailers and exclusive content.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-netflix-red/20 rounded-full flex items-center justify-center text-netflix-red">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Create Your Watchlist</h3>
                                <p className="text-zinc-400 text-sm">Save your favorites and get personalized recommendations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             {/* Right Side - Signup Form */}
             <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-950 relative">
                <div className="absolute top-8 right-8">
                     <Link to="/" className="text-sm font-semibold text-zinc-500 hover:text-white transition">Back to Home</Link>
                </div>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-bold tracking-tight text-white mb-2">Create Account</h2>
                        <p className="text-zinc-400">Join One Watch for free today.</p>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/30 text-red-200 p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Username</label>
                            <input
                                type="text"
                                placeholder="Choose a username"
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent outline-none transition-all text-white placeholder-zinc-500"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent outline-none transition-all text-white placeholder-zinc-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent outline-none transition-all text-white placeholder-zinc-500 pr-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                         <div className="space-y-2">
                             <label className="text-sm font-medium text-zinc-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-netflix-red focus:border-transparent outline-none transition-all text-white placeholder-zinc-500 pr-12"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-netflix-red hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-900/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign Up</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-zinc-950 text-zinc-500">Already a member?</span>
                        </div>
                    </div>

                    <p className="text-center">
                        <Link to="/login" className="font-bold text-white hover:text-netflix-red transition underline decoration-zinc-700 underline-offset-4 hover:decoration-netflix-red">
                            Sign in to your account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
