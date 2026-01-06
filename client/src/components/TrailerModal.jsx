import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { X, ExternalLink, AlertTriangle } from 'lucide-react';

const TrailerModal = ({ videoId, isOpen, onClose }) => {
    const [videoError, setVideoError] = useState(false);

    if (!isOpen || !videoId) return null;

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    const handleVideoError = (event) => {
        console.warn("YouTube Playback Error:", event.data);
        setVideoError(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-white hover:text-netflix-red bg-black/50 rounded-full p-2 transition"
                >
                    <X size={24} />
                </button>

                {videoError ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-zinc-900">
                        <AlertTriangle className="text-yellow-500 mb-4" size={48} />
                        <h3 className="text-2xl font-bold text-white mb-2">Video Restricted</h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                            The owner of this content has disabled embedded playback on other websites.
                        </p>
                        <a
                            href={`https://www.youtube.com/watch?v=${videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-netflix-red text-white font-bold rounded hover:bg-red-700 transition"
                        >
                            <ExternalLink size={20} />
                            Watch on YouTube
                        </a>
                    </div>
                ) : (
                    <YouTube
                        videoId={videoId}
                        opts={opts}
                        className="w-full h-full"
                        onError={handleVideoError}
                    />
                )}
            </div>
        </div>
    );
};

export default TrailerModal;
