import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create transporter for Gmail
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Email template for OTP
const getOTPEmailTemplate = (otp, username) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }
            .otp-box {
                background: white;
                border: 2px dashed #667eea;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #667eea;
                letter-spacing: 8px;
            }
            .warning {
                color: #e74c3c;
                font-size: 14px;
                margin-top: 20px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hello ${username || 'User'},</p>
                <p>We received a request to reset your password. Use the OTP code below to complete the process:</p>
                
                <div class="otp-box">
                    <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                    <p class="otp-code">${otp}</p>
                    <p style="margin: 0; font-size: 12px; color: #999;">Valid for 4 minutes</p>
                </div>
                
                <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
                
                <p class="warning">⚠️ Never share this code with anyone. Our team will never ask for your OTP.</p>
                
                <p>Best regards,<br>The Support Team</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Send OTP email
export const sendOTPEmail = async (email, otp, username) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Password Reset" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP Code',
            html: getOTPEmailTemplate(otp, username)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email. Please try again later.');
    }
};

// Generate cryptographically secure random 6-digit OTP
export const generateOTP = () => {
    // Generate a random number between 100000 and 999999
    return crypto.randomInt(100000, 1000000).toString();
};
