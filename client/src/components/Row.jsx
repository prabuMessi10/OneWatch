import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { RowSkeleton } from './LoadingSkeleton';

const Row = ({ title, fetchFunction, onMovieClick, movies: data }) => {
    const [movies, setMovies] = useState(data || []);
    const [loading, setLoading] = useState(!data);

    useEffect(() => {
        if (!fetchFunction) return; // If data is provided directly, don't fetch

        const fetchData = async () => {
            try {
                const res = await fetchFunction();
                setMovies(res.results);
            } catch (error) {
                console.error("Failed to fetch movies for row:", title, error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [fetchFunction, title]);

    if (loading) return <RowSkeleton title={title} />;

    return (
        <div className="px-10 mt-8 relative z-20">
            <h2 className="text-2xl font-display text-white mb-4 uppercase tracking-wider pl-2 border-l-4 border-netflix-red">{title}</h2>
            <div className="flex space-x-6 overflow-x-scroll scrollbar-hide py-4 px-2">
                {movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
                ))}
            </div>
        </div>
    );
};

export default Row;
