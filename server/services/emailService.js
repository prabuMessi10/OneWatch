const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, code) => {
    const mailOptions = {
        from: `"TrailerFlix" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - TrailerFlix',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #e50914;">Verify Your Email Address</h2>
                    <p>Thank you for signing up for TrailerFlix! Please use the verification code below to activate your account.</p>
                    <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-radius: 4px; margin: 20px 0;">
                        <h1 style="color: #e50914; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h1>
                    </div>
                    <p style="color: #888; font-size: 14px;">This code will expire in 5 minutes.</p>
                    <p style="margin-top: 20px; font-size: 12px; color: #888;">If you didn't create an account, you can ignore this email.</p>
                </div>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email sending failed (network blocked). Verification Code is:', code);
    }
};

const sendPasswordResetEmail = async (email, code) => {
    const mailOptions = {
        from: `"TrailerFlix" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Password - TrailerFlix',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #e50914;">Reset Your Password</h2>
                    <p>You requested a password reset. Please use the code below to reset your password.</p>
                    <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-radius: 4px; margin: 20px 0;">
                        <h1 style="color: #e50914; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h1>
                    </div>
                    <p style="color: #888; font-size: 14px;">This code will expire in 10 minutes.</p>
                    <p style="margin-top: 20px; font-size: 12px; color: #888;">If you didn't request this, ignore this email. Your password will remain unchanged.</p>
                </div>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email sending failed (network blocked). Reset Code is:', code);
    }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
