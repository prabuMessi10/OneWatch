const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

// 1. Register User (With Verification)
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit OTP code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            verificationCode,
            verificationCodeExpires: codeExpires,
            isVerified: false
        });

        if (user) {
            await sendVerificationEmail(user.email, verificationCode);
            console.log(`✅ Verification code sent to ${email}: ${verificationCode}`);
            res.status(201).json({ message: 'Registration successful. Please check your email for verification code.' });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        console.log('📧 Verification request received for code:', code);

        const user = await User.findOne({
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        });
        console.log('👤 User found:', user ? `${user.email} (ID: ${user._id})` : 'null');

        if (!user) {
            console.log('❌ Invalid or expired code');
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        console.log('✅ Email verified successfully for:', user.email);
        res.status(200).json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        console.error('🔥 Verification error:', error);
        res.status(500).json({ message: error.message });
    }
};

// 3. Login User (Check Verification)
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email first.' });
            }

            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate 6-digit OTP code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = resetCode;
        user.resetPasswordCodeExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes
        await user.save();

        await sendPasswordResetEmail(user.email, resetCode);
        console.log(`🔑 Password reset code sent to ${email}: ${resetCode}`);

        res.status(200).json({ message: 'Password reset code sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { code, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordCode: code,
            resetPasswordCodeExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired code' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordCode = undefined;
        user.resetPasswordCodeExpires = undefined;
        await user.save();

        console.log(`🔐 Password reset successful for: ${user.email}`);
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
