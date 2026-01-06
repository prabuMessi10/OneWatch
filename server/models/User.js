const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: String,
    verificationCodeExpires: Date,
    resetPasswordCode: String,
    resetPasswordCodeExpires: Date,
    watchlist: [{
        movieId: { type: Number, required: true },
        title: String,
        posterPath: String,
        addedAt: { type: Date, default: Date.now }
    }]


}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
