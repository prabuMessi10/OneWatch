import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, Heart, User, X, TrendingUp, Film, ChevronDown, Settings, PlayCircle, Bell, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTrending, searchMovies } from '../services/api';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [trendingResults, setTrendingResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    
    // Refs
    const searchTimeout = useRef(null);
    const searchContainerRef = useRef(null);
    const profileMenuRef = useRef(null);
    const notificationRef = useRef(null);
    const languageRef = useRef(null);
    const searchInputRef = useRef(null);
    
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Dummy Notifications
    const [notifications, setNotifications] = useState([]);

    // Scroll Listener
    useEffect(() => {
        const handleScroll = () => {
             setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Focus input when search is toggled open
    useEffect(() => {
        if (isSearchFocused && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchFocused]);

    // Fetch trending on mount
    useEffect(() => {
        const fetchTrendingMovies = async () => {
            try {
                const data = await getTrending();
                setTrendingResults(data.results.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch trending", error);
            }
        };
        fetchTrendingMovies();

        // Global click outside listener for menus
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (languageRef.current && !languageRef.current.contains(event.target)) {
                setShowLanguageMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchInput = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        setLoading(true);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (!query.trim()) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        // Debounce search
        searchTimeout.current = setTimeout(async () => {
            try {
                const data = await searchMovies(query);
                setSearchResults(data.results ? data.results : []);
            } catch (error) {
                console.error("Live search failed", error);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setIsSearchFocused(false);
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm}`);
        }
    };

    const handleResultClick = (movieId) => {
        setIsSearchFocused(false);
        setSearchTerm('');
        navigate(`/movie/${movieId}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper to get Top Result
    const topResult = searchResults.length > 0 ? searchResults[0] : null;

    return (
        <>
            {/* Backdrop for Search Focus */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isSearchFocused ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} />

            <nav 
                className={`fixed top-0 w-full z-[100] transition-colors duration-500 ease-in-out px-4 md:px-12 py-4
                ${isScrolled ? 'bg-zinc-950/95 backdrop-blur-sm shadow-md' : 'bg-gradient-to-b from-black/80 to-transparent'}`}
            >
                <div className="flex items-center justify-between max-w-[1800px] mx-auto h-10">
                    
                    {/* LEFT: Logo & Links */}
                    <div className="flex items-center gap-8 md:gap-12">
                        <Link to="/" className="group z-50">
                             <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tighter text-netflix-red transition-transform group-hover:scale-105">
                                ONE<span className="text-white">WATCH</span>
                            </h1>
                        </Link>

                        {user && (
                            <div className="hidden md:flex items-center gap-6 z-50">
                                <Link 
                                    to="/" 
                                    className="text-gray-300 hover:text-white transition font-bold hover:scale-110 transform duration-200"
                                >
                                    Home
                                </Link>
                                <Link 
                                    to="/my-list" 
                                    className="text-gray-300 hover:text-white transition font-bold hover:scale-110 transform duration-200"
                                >
                                    My List
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* CENTER: Dynamic Search Bar (Restored) */}
                    <div className="flex-1 flex justify-center px-4 md:px-12 relative">
                         <div 
                            ref={searchContainerRef}
                            className={`relative transition-all duration-500 ease-out z-50 flex justify-end ${isSearchFocused ? 'w-full max-w-2xl' : 'w-auto'}`}
                        >
                            <form 
                                onSubmit={handleSearchSubmit} 
                                className={`relative group flex items-center transition-all duration-500 ${isSearchFocused ? 'w-full' : 'w-10 md:w-64'}`}
                            >
                                {/* Search Input */}
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search titles, people, genres..."
                                    className={`bg-zinc-900/50 border border-zinc-700 text-white rounded-full focus:outline-none focus:border-white/40 focus:bg-black/80 transition-all duration-300 backdrop-blur-md
                                        ${isSearchFocused 
                                            ? 'w-full pl-12 pr-12 py-2.5 opacity-100 visible shadow-[0_0_20px_rgba(0,0,0,0.5)]' 
                                            : 'w-full pl-10 pr-4 py-2 opacity-0 md:opacity-100 md:visible cursor-pointer hover:bg-zinc-800 border-transparent hover:border-zinc-700'
                                        }`}
                                    value={searchTerm}
                                    onChange={handleSearchInput}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => !searchTerm && setIsSearchFocused(false)}
                                />
                                
                                {/* Search Icon Trigger */}
                                <div 
                                    className={`absolute left-0 top-0 h-full aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 ${isSearchFocused ? 'pointer-events-none' : ''}`}
                                    onClick={() => {
                                        setIsSearchFocused(true);
                                    }}
                                >
                                     <Search 
                                        size={18} 
                                        className={`transition-colors ${isSearchFocused ? 'text-white' : 'text-gray-400'}`} 
                                    />
                                </div>

                                {/* Mobile Trigger */}
                                 {!isSearchFocused && (
                                    <button 
                                        type="button" 
                                        onClick={() => setIsSearchFocused(true)}
                                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition"
                                    >
                                        <Search size={20} />
                                    </button>
                                )}

                                {/* Clear Button */}
                                {searchTerm && isSearchFocused && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setSearchTerm(''); setIsSearchFocused(false); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </form>

                            {/* DROPDOWN */}
                            {isSearchFocused && (searchTerm || (!searchTerm && trendingResults.length > 0)) && (
                                <div className="absolute top-full left-0 w-full mt-4 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                    {loading && (
                                        <div className="p-8 text-center text-gray-500 text-sm">Searching...</div>
                                    )}

                                    {!loading && (
                                        <>
                                            {searchTerm && (
                                                <div className="px-4 py-3 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                                    Results for "{searchTerm}"
                                                </div>
                                            )}
                                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                                {(searchTerm ? searchResults : trendingResults).map((movie) => (
                                                    <div 
                                                        key={movie.id}
                                                        onClick={() => handleResultClick(movie.id)}
                                                        className="flex items-start gap-4 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                                    >
                                                        <img 
                                                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138'} 
                                                            alt={movie.title}
                                                            className="w-10 h-14 object-cover rounded bg-zinc-800"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-white truncate">{movie.title}</h4>
                                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                                <span>{movie.release_date?.substring(0, 4) || 'N/A'}</span>
                                                                {movie.vote_average > 0 && (
                                                                    <span className="text-green-500 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Notifications & Profile */}
                    <div className="flex items-center gap-4 md:gap-6 z-50">
                        {user && (
                            <div className="relative" ref={notificationRef}>
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="text-gray-200 hover:text-white transition-colors p-2 hover:scale-110 transform duration-200"
                                >
                                    <Bell size={22} />
                                    {notifications.some(n => !n.read) && (
                                        <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-600 rounded-full"></span>
                                    )}
                                </button>
                                 {showNotifications && (
                                    <div className="absolute right-0 top-full mt-4 w-80 bg-zinc-900 border border-zinc-800 rounded shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                                        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                                            <h3 className="font-bold text-white text-sm">Notifications</h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-4 text-center text-zinc-500 text-sm">
                                            No new notifications
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {user ? (
                            <div className="relative group" ref={profileMenuRef}>
                                <button 
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-3 text-white group focus:outline-none hover:scale-105 transform transition duration-200"
                                >
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-bold text-white group-hover:text-netflix-red transition-colors">{user.username}</p>
                                    </div>
                                    <div className="relative">
                                        <img 
                                            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
                                            onClick={(e) => { e.target.onerror = null; e.target.src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/84c20033850498.56ba69ac290ea.png" }}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-md border-2 border-transparent group-hover:border-white transition-all shadow-lg"
                                        />
                                    </div>
                                    <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute top-full right-0 mt-4 w-48 bg-black/95 border border-white/15 rounded shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                                        <div className="px-4 py-2 border-b border-white/10 mb-1">
                                            <p className="text-white text-sm font-medium truncate">{user.username}</p>
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:underline">Account</Link>
                                        <Link to="/my-list" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:underline">My List</Link>
                                        <div className="border-t border-white/10 my-1"></div>
                                        <button 
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:underline"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-4 items-center">
                                <Link to="/login" className="text-white font-medium hover:underline text-sm">Login</Link>
                                <Link to="/signup" className="bg-netflix-red text-white px-4 py-1.5 rounded font-medium text-sm hover:bg-red-700 transition-colors">Sign up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
