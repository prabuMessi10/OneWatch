import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, Heart, User } from 'lucide-react';


const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent p-4 transition-all duration-300">
            <div className="flex items-center justify-between px-4 md:px-10">
                <div className="flex items-center gap-8">
                    <Link to="/">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-netflix-red cursor-pointer tracking-wide drop-shadow-lg">
                            TRAILER<span className="text-white">FLIX</span>
                        </h1>
                    </Link>

                    {user && (
                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-white hover:text-gray-300 transition text-sm font-medium">Home</Link>
                            <Link to="/my-list" className="text-white hover:text-gray-300 transition text-sm font-medium">My List</Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search titles..."
                            className="bg-black/50 border border-white/30 text-white px-4 py-2 pl-10 rounded-full focus:outline-none focus:border-netflix-red transition-colors w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </form>

                    {user ? (
                        <div className="flex items-center gap-3 md:gap-5">
                            <Link to="/profile" className="flex items-center gap-3 text-white transition group">
                                <span className="text-white font-medium hidden lg:block group-hover:text-netflix-red transition-colors duration-300">
                                    Hi, {user.username}
                                </span>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white ring-2 ring-transparent group-hover:ring-netflix-red group-hover:scale-110 transition-all duration-300 shadow-xl overflow-hidden active:scale-95">
                                    <User size={20} fill="currentColor" className="opacity-90" />
                                </div>
                            </Link>

                            <Link to="/my-list" className="text-white hover:text-netflix-red transition-all duration-300 md:hidden hover:scale-110">
                                <Heart size={24} />
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-netflix-red text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg border border-white/10 group/logout"
                                title="Sign Out"
                            >
                                <LogOut size={18} className="group-hover/logout:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <button className="text-white px-3 md:px-4 py-2 hover:text-gray-300 transition font-medium text-sm md:text-base">
                                    Login
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="text-white px-3 md:px-4 py-2 bg-netflix-red rounded-md hover:bg-red-700 transition font-bold shadow-lg shadow-red-900/20 text-sm md:text-base">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
