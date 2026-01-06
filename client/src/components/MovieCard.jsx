import React from 'react';
import { Play } from 'lucide-react';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie, onClick }) => {
    return (
        <div
            className="group relative flex-none w-[200px] bg-netflix-card rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-netflix-red/20 border border-transparent hover:border-zinc-700"
            onClick={() => onClick(movie)}
        >
            {/* Poster Section with Play Overlay */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <img
                    src={`${IMG_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60"
                />

                {/* Always visible gradient, gets darker on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-card via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                {/* Play Button - Pops up slightly on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <div className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:bg-netflix-red/80 group-hover:border-netflix-red transition-colors">
                        <Play fill="white" className="text-white ml-1" size={32} />
                    </div>
                </div>

                {/* "Trailer" Tag top right */}
                {/* <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white">Trailer</span>
                </div> */}
            </div>

            {/* Content / Metadata Section - IMDb style */}
            <div className="p-4 flex flex-col gap-2 h-auto min-h-[100px] relative z-10 bg-netflix-card">
                {/* Rating / Meta */}
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span className="text-yellow-500 flex items-center gap-1">
                        ★ {movie.vote_average?.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{movie.release_date?.split('-')[0]}</span>
                </div>

                {/* Title */}
                <h3 className="text-white font-bold leading-tight group-hover:text-netflix-red transition-colors line-clamp-2">
                    {movie.title}
                </h3>

                {/* Watch Button (Fake) */}
                <div className="mt-auto pt-2 flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                    <div className="h-[2px] w-4 bg-netflix-red rounded-full" />
                    <span>WATCH TRAILER</span>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
