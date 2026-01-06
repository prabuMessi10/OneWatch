import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTrending, getMovieDetails, getMoviesByGenre } from '../services/api';
import { findBestVideo, getYouTubeSearchUrl } from '../utils/movieUtils';
import TrailerModal from '../components/TrailerModal';
import Navbar from '../components/Navbar';
import Row from '../components/Row';
import { HeroSkeleton } from '../components/LoadingSkeleton';

const Home = () => {
    const [heroMovie, setHeroMovie] = useState(null);
    const [trailerKey, setTrailerKey] = useState(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const data = await getTrending();
                setHeroMovie(data.results[0]);
            } catch (error) {
                console.error("Failed to fetch hero movie", error);
            }
        };
        fetchHero();
    }, []);

    const navigate = useNavigate();

    const handleMovieClick = (movie) => {
        navigate(`/movie/${movie.id}`);
    };

    const handleWatchTrailer = async (movie) => {
        try {
            const data = await getMovieDetails(movie.id);
            const bestVideo = findBestVideo(data.videos);

            if (bestVideo) {
                setTrailerKey(bestVideo.key);
                setIsTrailerOpen(true);
            } else {
                // Fallback to YouTube Search
                const searchUrl = getYouTubeSearchUrl(movie.title, movie.release_date);
                window.open(searchUrl, '_blank', 'noopener,noreferrer');
            }
        } catch (error) {
            console.error("Failed to fetch trailer", error);
        }
    };

    return (
        <div className="bg-netflix-dark min-h-screen pb-20">
            <Navbar />

            {/* Hero Section */}
            {!heroMovie ? (
                <HeroSkeleton />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full bg-cover bg-center flex items-center"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-black/60"></div>
                    <div className="relative z-10 px-4 md:px-8 lg:px-10 max-w-full md:max-w-xl lg:max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-wide text-white mb-3 md:mb-4 drop-shadow-xl">{heroMovie.title}</h1>
                        <p className="text-gray-300 text-sm md:text-base lg:text-lg line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 lg:mb-8">{heroMovie.overview}</p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                onClick={() => handleMovieClick(heroMovie)}
                                className="bg-netflix-red text-white px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/40 text-sm md:text-base"
                            >
                                Details
                            </button>
                            <button
                                onClick={() => handleWatchTrailer(heroMovie)}
                                className="bg-gray-500/70 text-white px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-gray-500/50 transition text-sm md:text-base"
                            >
                                Watch Trailer
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Content Rows */}
            <div className={`relative z-20 ${heroMovie ? '-mt-16 md:-mt-24 lg:-mt-32' : 'pt-16 md:pt-20 lg:pt-24'} px-2 md:px-4`}>
                <Row title="Trending Now" fetchFunction={getTrending} onMovieClick={handleMovieClick} />
                <Row title="Action Hits" fetchFunction={() => getMoviesByGenre(28)} onMovieClick={handleMovieClick} />
                <Row title="Comedy Favorites" fetchFunction={() => getMoviesByGenre(35)} onMovieClick={handleMovieClick} />
                <Row title="Scariest Horror" fetchFunction={() => getMoviesByGenre(27)} onMovieClick={handleMovieClick} />
                <Row title="Sci-Fi & Fantasy" fetchFunction={() => getMoviesByGenre(878)} onMovieClick={handleMovieClick} />
                <Row title="Animations" fetchFunction={() => getMoviesByGenre(16)} onMovieClick={handleMovieClick} />
            </div>

            <TrailerModal
                videoId={trailerKey}
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
            />
        </div>
    );
};

export default Home;
