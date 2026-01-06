import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchMovies } from '../services/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/LoadingSkeleton';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const performSearch = async () => {
            if (query) {
                setLoading(true);
                try {
                    const data = await searchMovies(query);
                    setMovies(data.results);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        performSearch();
    }, [query]);

    return (
        <div className="bg-netflix-dark min-h-screen">
            <Navbar />
            {/* Spacer for fixed Navbar */}
            <div className="h-24 md:h-32"></div>

            <div className="px-4 md:px-8 lg:px-10 pb-10">




                <h2 className="text-2xl md:text-3xl text-white font-bold mb-4 md:mb-6">Results for "{query}"</h2>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => <MovieCardSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                        {movies.length > 0 ? (
                            movies.map(movie => (
                                <MovieCard key={movie.id} movie={movie} onClick={(m) => navigate(`/movie/${m.id}`)} />
                            ))
                        ) : (
                            <p className="text-gray-400">No results found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
