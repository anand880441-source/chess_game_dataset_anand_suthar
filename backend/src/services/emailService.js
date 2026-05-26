const nodemailer = require("nodemailer");

// For testing, use ethereal.email (fake SMTP)
// In production, use real SMTP like SendGrid, AWS SES, or Gmail

const createTransporter = async () => {
    // For development - create test account
    if (process.env.NODE_ENV === "development") {
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }
    
    // For production - use environment variables
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || "noreply@chess-analytics.com",
            to,
            subject,
            html
        });
        
        console.log("Email sent:", info.messageId);
        if (process.env.NODE_ENV === "development") {
            console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
        }
        return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
        console.error("Email error:", error);
        return { success: false, error: error.message };
    }
};

const sendPasswordResetEmail = async (email, resetToken, name) => {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2c3e50;">Password Reset Request</h1>
            <p>Hello ${name},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr>
            <p style="color: #7f8c8d; font-size: 12px;">Chess Match Analytics API</p>
        </div>
    `;
    
    return await sendEmail(email, "Password Reset Request", html);
};

const sendVerificationEmail = async (email, verifyToken, name) => {
    const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${verifyToken}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2c3e50;">Verify Your Email</h1>
            <p>Hello ${name},</p>
            <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #27ae60; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
            <hr>
            <p style="color: #7f8c8d; font-size: 12px;">Chess Match Analytics API</p>
        </div>
    `;
    
    return await sendEmail(email, "Verify Your Email", html);
};

module.exports = { sendPasswordResetEmail, sendVerificationEmail };
