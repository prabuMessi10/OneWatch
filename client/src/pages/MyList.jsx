import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { getMyList, removeFromList } from '../services/api';
import { Trash2, Heart } from 'lucide-react';
import { MovieCardSkeleton } from '../components/LoadingSkeleton';

const MyList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyList();
    }, []);

    const fetchMyList = async () => {
        try {
            const data = await getMyList();
            setMovies(data.watchlist || []);
        } catch (error) {
            console.error('Failed to fetch My List:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (movieId, e) => {
        e.stopPropagation(); // Prevent card click

        try {
            await removeFromList(movieId);
            setMovies(movies.filter(movie => movie.movieId !== movieId));
        } catch (error) {
            console.error('Failed to remove from list:', error);
        }
    };

    const handleMovieClick = (movie) => {
        navigate(`/movie/${movie.movieId}`);
    };

    if (loading) {
        return (
            <div className="bg-netflix-dark min-h-screen">
                <Navbar />
                <div className="h-24 md:h-32"></div>
                <div className="px-4 md:px-8 lg:px-10">
                    <div className="h-10 bg-zinc-900 w-48 mb-6 rounded animate-pulse"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <MovieCardSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-netflix-dark min-h-screen pb-20">
            <Navbar />

            {/* Spacer for fixed Navbar */}
            <div className="h-24 md:h-32"></div>

            <div className="px-4 md:px-8 lg:px-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart size={32} className="text-netflix-red" fill="currentColor" />
                        <h1 className="text-3xl md:text-4xl font-bold text-white">My List</h1>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base">
                        {movies.length > 0
                            ? `${movies.length} ${movies.length === 1 ? 'movie' : 'movies'} saved`
                            : 'Your watchlist is empty'}
                    </p>
                </div>

                {/* Movie Grid */}
                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                        {movies.map((movie) => (
                            <div key={movie.movieId} className="relative group">
                                <div onClick={() => handleMovieClick(movie)} className="cursor-pointer">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                        alt={movie.title}
                                        className="w-full rounded-lg hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 rounded-lg flex items-center justify-center">
                                        <h3 className="text-white font-semibold text-sm md:text-base px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            {movie.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Remove button */}
                                <button
                                    onClick={(e) => handleRemove(movie.movieId, e)}
                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    title="Remove from My List"
                                >
                                    <Trash2 size={16} className="text-white" />
                                </button>

                                <p className="text-gray-400 text-xs mt-2">
                                    Added {new Date(movie.addedAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Heart size={64} className="text-gray-700 mx-auto mb-4" />
                        <h2 className="text-2xl text-gray-500 font-semibold mb-2">Your list is empty</h2>
                        <p className="text-gray-600 mb-6">Browse movies and add them to your list!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-netflix-red text-white px-6 py-3 rounded font-bold hover:bg-red-700 transition"
                        >
                            Browse Movies
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyList;
