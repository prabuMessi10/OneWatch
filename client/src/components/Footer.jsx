import React from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';


const Footer = () => {
    return (
        <footer className="bg-[#040714] text-gray-400 py-10 mt-20 border-t border-white/5 relative">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Left: Copyright */}
                    <div className="text-sm md:text-base font-medium text-gray-400 order-2 md:order-1">
                        <p>© 2025 TrailerFlix. Built with React.</p>
                    </div>

                    {/* Right: TMDB Attribution */}
                    <div className="flex flex-col items-center md:items-end gap-3 order-1 md:order-2 max-w-[320px]">
                        <img
                            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                            alt="The Movie Database"
                            className="h-5 md:h-6 opacity-80 hover:opacity-100 transition-opacity"
                        />
                        <p className="text-[10px] md:text-xs text-gray-500 text-center md:text-right leading-tight">
                            This product uses the TMDB API but is not endorsed or certified by TMDB.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
