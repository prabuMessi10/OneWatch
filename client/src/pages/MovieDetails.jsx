import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getRecommendations, addToList, removeFromList, checkInList } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TrailerModal from '../components/TrailerModal';
import Row from '../components/Row'; // Added Row
import { MovieDetailsSkeleton } from '../components/LoadingSkeleton';
import { findBestVideo, getYouTubeSearchUrl } from '../utils/movieUtils';

import { Play, Star, User, Heart, Plus, Check } from 'lucide-react';


const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);
    const [recommendations, setRecommendations] = useState([]); // State for recommendations
    const [isInList, setIsInList] = useState(false);
    const [addingToList, setAddingToList] = useState(false);
    const { user } = useAuth();


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getMovieDetails(id);
                setMovie(data);

                // Find a trailer
                const bestVideo = findBestVideo(data.videos);
                if (bestVideo) {
                    setTrailerKey(bestVideo.key);
                }
                // Fetch recommendations separately to not block main details
                try {
                    const recData = await getRecommendations(id);
                    setRecommendations(recData.results);
                } catch (recError) {
                    console.error("Failed to fetch recommendations", recError);
                }

                // Check if in list if logged in
                if (user) {
                    try {
                        const { inList } = await checkInList(id);
                        setIsInList(inList);
                    } catch (checkError) {
                        console.error("Failed to check watchlist status", checkError);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch details", error);
            } finally {
                setLoading(false);
            }

        };

        fetchDetails();
    }, [id, user?.token]);

    const handleToggleList = async () => {
        if (!user) {
            navigate('/login', {
                state: {
                    message: "Sign in to add this movie to your personal Watchlist!",
                    from: window.location.pathname
                }
            });
            return;
        }

        setAddingToList(true);
        try {
            if (isInList) {
                await removeFromList(id);
                setIsInList(false);
            } else {
                await addToList(id, {
                    title: movie.title,
                    posterPath: movie.poster_path
                });
                setIsInList(true);
            }
        } catch (error) {
            console.error("Failed to update watchlist", error);
        } finally {
            setAddingToList(false);
        }
    };

    if (loading) return (
        <>
            <Navbar />
            <MovieDetailsSkeleton />
        </>
    );
    if (!movie) return (
        <>
            <Navbar />
            <div className="text-white text-center mt-32 text-xl font-bold bg-netflix-dark min-h-screen">
                <p>Movie not found</p>
                <button onClick={() => navigate('/')} className="mt-4 bg-netflix-red px-6 py-2 rounded">Back to Home</button>
            </div>
        </>
    );

    return (
        <div className="bg-netflix-dark min-h-screen">
            <Navbar />

            {/* Backdrop */}
            <div
                className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full bg-cover bg-top"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/40 to-black/30"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 -mt-20 md:-mt-28 lg:-mt-32 relative z-10 font-sans">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="w-48 md:w-56 lg:w-64 flex-shrink-0 mx-auto md:mx-0">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="rounded-lg shadow-2xl border-4 border-zinc-800"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-white pt-4 md:pt-8 lg:pt-10">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">{movie.title}</h1>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-300 text-xs md:text-sm mb-4 md:mb-6">
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                            <span className="border border-gray-500 px-1 rounded">HD</span>
                            <span>{movie.runtime} min</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={16} fill="currentColor" />
                                <span className="text-white font-bold">{movie.vote_average?.toFixed(1)}</span>
                            </div>
                        </div>


                        <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed mb-6 md:mb-8 max-w-2xl">
                            {movie.overview}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            {trailerKey ? (
                                <button
                                    onClick={() => setShowTrailer(true)}
                                    className="flex items-center gap-2 bg-netflix-red text-white px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-red-700 transition text-sm md:text-base w-full sm:w-auto justify-center shadow-lg hover:scale-105 active:scale-95"
                                >
                                    <Play fill="currentColor" size={20} />
                                    Watch Trailer
                                </button>
                            ) : (
                                <a
                                    href={getYouTubeSearchUrl(movie.title, movie.release_date)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-zinc-700 text-white px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-zinc-600 transition text-sm md:text-base w-full sm:w-auto justify-center shadow-lg hover:scale-105 active:scale-95 border border-zinc-600"
                                >
                                    <Play fill="currentColor" size={20} />
                                    Search on YouTube
                                </a>
                            )}

                            <button
                                onClick={handleToggleList}
                                disabled={addingToList}
                                className={`flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 rounded font-bold transition text-sm md:text-base w-full sm:w-auto justify-center ${isInList
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-600'
                                    }`}
                            >
                                {isInList ? (
                                    <>
                                        <Check size={20} />
                                        In My List
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Add to List
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-6 md:mt-8 border-t border-gray-800 pt-4 md:pt-6">
                            <div className="mb-4">
                                <span className="text-gray-400 font-bold block mb-3 text-sm md:text-base">Starring:</span>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                                    {movie.credits?.cast?.slice(0, 6).map(person => (
                                        <div key={person.id} className="text-center">
                                            {person.profile_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                                                    alt={person.name}
                                                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover mb-1 border border-zinc-700 mx-auto"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-1 border border-zinc-700 mx-auto">
                                                    <User size={20} className="text-gray-500" />
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-300 truncate px-1">{person.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs md:text-sm">Genres: <span className="text-white">{movie.genres?.map(g => g.name).join(', ')}</span></p>
                        </div>

                    </div>
                </div>
            </div>


            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="pb-20">
                    <Row
                        title="More Like This"
                        movies={recommendations}
                        onMovieClick={(movie) => window.location.href = `/movie/${movie.id}`}
                    />
                </div>
            )}


            <TrailerModal
                isOpen={showTrailer}
                onClose={() => setShowTrailer(false)}
                videoId={trailerKey}
            />
        </div>
    );
};


export default MovieDetails;
