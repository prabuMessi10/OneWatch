import React from 'react';

const MovieCardSkeleton = () => (
    <div className="flex-none w-[200px] h-[400px] bg-zinc-900 rounded-xl overflow-hidden animate-pulse">
        <div className="h-[300px] bg-zinc-800"></div>
        <div className="p-4 space-y-3">
            <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
        </div>
    </div>
);

const HeroSkeleton = () => (
    <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full bg-zinc-900 animate-pulse flex items-center">
        <div className="px-4 md:px-8 lg:px-10 w-full max-w-2xl space-y-6">
            <div className="h-12 md:h-16 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
            <div className="flex gap-4">
                <div className="h-12 bg-zinc-800 rounded w-32"></div>
                <div className="h-12 bg-zinc-800 rounded w-32"></div>
            </div>
        </div>
    </div>
);

const RowSkeleton = ({ title }) => (
    <div className="mb-8 px-4 md:px-10">
        <div className="h-8 bg-zinc-900 rounded w-48 mb-4 animate-pulse"></div>
        <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    </div>
);

const MovieDetailsSkeleton = () => (
    <div className="bg-netflix-dark min-h-screen animate-pulse">
        <div className="h-[40vh] md:h-[50vh] lg:h-[60vh] bg-zinc-900"></div>
        <div className="container mx-auto px-4 md:px-6 -mt-20 md:-mt-28 lg:-mt-32 relative z-10">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-48 md:w-56 lg:w-64 h-72 md:h-80 lg:h-96 bg-zinc-800 rounded-lg shrink-0"></div>
                <div className="flex-1 pt-4 md:pt-10 space-y-6">
                    <div className="h-12 bg-zinc-800 rounded w-2/3"></div>
                    <div className="flex gap-4">
                        <div className="h-4 bg-zinc-800 rounded w-16"></div>
                        <div className="h-4 bg-zinc-800 rounded w-16"></div>
                        <div className="h-4 bg-zinc-800 rounded w-16"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 bg-zinc-800 rounded w-full"></div>
                        <div className="h-4 bg-zinc-800 rounded w-full"></div>
                        <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-12 bg-zinc-800 rounded w-40"></div>
                        <div className="h-12 bg-zinc-800 rounded w-40"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export { MovieCardSkeleton, HeroSkeleton, RowSkeleton, MovieDetailsSkeleton };
