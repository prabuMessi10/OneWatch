import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="bg-netflix-dark min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <Navbar />

            {/* Background decoration */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-netflix-red/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-netflix-red/5 rounded-full blur-[120px] animate-pulse transition-all duration-1000"></div>

            <div className="relative z-10 text-center px-4">
                <div className="mb-8 flex justify-center">
                    <div className="bg-zinc-900 p-6 rounded-full border border-zinc-800 shadow-2xl relative group">
                        <AlertTriangle size={80} className="text-netflix-red group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-netflix-red rounded-full animate-ping"></div>
                    </div>
                </div>

                <h1 className="text-8xl md:text-9xl font-display font-bold text-white mb-4 drop-shadow-[0_0_30px_rgba(229,9,20,0.3)]">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    Oops! Lost in the Trailer Verse?
                </h2>

                <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">
                    The page you are looking for doesn't exist or has been moved to another dimension.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-netflix-red text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-red-900/40 active:scale-95"
                >
                    <Home size={20} />
                    Take Me Home
                </Link>
            </div>

            {/* Static/Grain overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>
    );
};

export default NotFound;
