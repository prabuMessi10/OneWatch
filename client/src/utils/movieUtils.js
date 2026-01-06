export const findBestVideo = (videos) => {
    if (!videos || !Array.isArray(videos)) return null;

    const priorities = [
        "Trailer",
        "Teaser",
        "Clip",
        "Musical",
        "Opening Credits",
        "Featurette",
        "Behind the Scenes",
        "Bloopers"
    ];

    // Filter only YouTube videos
    const youtubeVideos = videos.filter(v => v.site === "YouTube");

    if (youtubeVideos.length === 0) return null;

    // Priority 1: Search for preferred types in English (highest quality trailers usually)
    for (const type of priorities) {
        const found = youtubeVideos.find(v => v.type === type && v.iso_639_1 === 'en');
        if (found) return found;
    }

    // Priority 2: Search for preferred types in ANY language (French trailers, original audio etc)
    for (const type of priorities) {
        const found = youtubeVideos.find(v => v.type === type);
        if (found) return found;
    }

    // Final Fallback: Just give us anything on YouTube
    return youtubeVideos[0];
};

export const getYouTubeSearchUrl = (title, releaseDate) => {
    const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
    const query = encodeURIComponent(`${title} ${year} Trailer`);
    return `https://www.youtube.com/results?search_query=${query}`;
};
