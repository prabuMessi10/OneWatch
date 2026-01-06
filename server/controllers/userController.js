const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};

// Update profile (username)
exports.updateUserProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) {
            // Check if username already exists
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username;
        }

        const updatedUser = await user.save();
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
};
