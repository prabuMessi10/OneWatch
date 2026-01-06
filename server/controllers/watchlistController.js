const User = require('../models/User');

// Get user's watchlist
exports.getMyList = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('watchlist');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ watchlist: user.watchlist });
    } catch (error) {
        console.error('Get watchlist error:', error);
        res.status(500).json({ message: 'Failed to fetch watchlist' });
    }
};

// Add movie to watchlist
exports.addToList = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { title, posterPath } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if movie already in list
        const exists = user.watchlist.some(item => item.movieId === parseInt(movieId));
        if (exists) {
            return res.status(400).json({ message: 'Movie already in your list' });
        }

        // Add to watchlist
        user.watchlist.push({
            movieId: parseInt(movieId),
            title,
            posterPath
        });

        await user.save();

        console.log(`✅ Added movie ${movieId} to ${user.email}'s list`);
        res.status(200).json({ message: 'Added to My List', watchlist: user.watchlist });
    } catch (error) {
        console.error('Add to list error:', error);
        res.status(500).json({ message: 'Failed to add to list' });
    }
};

// Remove movie from watchlist
exports.removeFromList = async (req, res) => {
    try {
        const { movieId } = req.params;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove from watchlist
        user.watchlist = user.watchlist.filter(item => item.movieId !== parseInt(movieId));
        await user.save();

        console.log(`🗑️ Removed movie ${movieId} from ${user.email}'s list`);
        res.status(200).json({ message: 'Removed from My List', watchlist: user.watchlist });
    } catch (error) {
        console.error('Remove from list error:', error);
        res.status(500).json({ message: 'Failed to remove from list' });
    }
};

// Check if movie is in watchlist
exports.checkInList = async (req, res) => {
    try {
        const { movieId } = req.params;

        const user = await User.findById(req.user._id).select('watchlist');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const inList = user.watchlist.some(item => item.movieId === parseInt(movieId));
        res.status(200).json({ inList });
    } catch (error) {
        console.error('Check in list error:', error);
        res.status(500).json({ message: 'Failed to check list status' });
    }
};
