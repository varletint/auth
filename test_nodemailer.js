import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    magenta: '\x1b[35m'
};

// Helper function to format console output
const log = {
    success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
    section: (msg) => console.log(`\n${colors.magenta}═══ ${msg} ═══${colors.reset}\n`)
};

// Test 1: Verify environment variables
const testEnvironmentVariables = () => {
    log.section('Test 1: Environment Variables Check');

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser) {
        log.error('EMAIL_USER not found in .env file');
        return false;
    }
    log.success(`EMAIL_USER found: ${emailUser}`);

    if (!emailPass) {
        log.error('EMAIL_PASS not found in .env file');
        return false;
    }
    log.success('EMAIL_PASS found (hidden for security)');

    return true;
};

// Test 2: Create transporter
const createTransporter = () => {
    log.section('Test 2: Creating Nodemailer Transporter');

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        log.success('Transporter created successfully');
        return transporter;
    } catch (error) {
        log.error(`Failed to create transporter: ${error.message}`);
        return null;
    }
};

// Test 3: Verify transporter connection
const testConnection = async (transporter) => {
    log.section('Test 3: Testing SMTP Connection');

    try {
        await transporter.verify();
        log.success('SMTP connection verified successfully');
        log.info('Your email credentials are valid and the server is reachable');
        return true;
    } catch (error) {
        log.error(`SMTP connection failed: ${error.message}`);
        log.warning('Common issues:');
        log.warning('  1. Wrong email/password in .env file');
        log.warning('  2. Two-factor authentication enabled (use App Password instead)');
        log.warning('  3. "Less secure app access" disabled (if using regular password)');
        log.warning('  4. Network/firewall issues');
        return false;
    }
};

// Test 4: Send a test email
const sendTestEmail = async (transporter, recipientEmail) => {
    log.section('Test 4: Sending Test Email');

    const mailOptions = {
        from: `"JUJU Test" <${recipientEmail}>`,
        to: recipientEmail,
        subject: '✅ JUJU Test made against you successfully!',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 30px auto;
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                }
                .content {
                    padding: 40px 30px;
                }
                .badge {
                    background: #10b981;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    display: inline-block;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .info-box {
                    background: #f0f9ff;
                    border-left: 4px solid #3b82f6;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                .footer {
                    background: #f9f9f9;
                    padding: 20px 30px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }
                .timestamp {
                    color: #999;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 JUJU made against you!</h1>
                </div>
                <div class="content">
                    <div class="badge">✓ Mail sacrifice completed</div>
                    
                    <h2>Congratulations!</h2>
                    <p>Usman im officially your wife</p>
                    
                    <div class="info-box">
                        <strong>✓</strong> You can only have one wife now<br>
                        <strong>✓</strong> You will do what ever i say<br>
                        <strong>✓</strong> Usman u're mine<br>
                        <strong>✓</strong> You can't leave me<br>
                    </div>
                    
                  
                    
                    <p>This sacrifice is for life, u can't undo it. but if u give me 500 naira, i will break this sacrifice </p>
                </div>
                <div class="footer">
                    <p class="timestamp">This is not a joke to you. Hala Madrid</p>
                    <p>Sent from heaven by JUJU cooperative</p>
                </div>
            </div>
        </body>
        </html>
        `,
        text: `
Hala Madrid !

Yours.

Test Details:
- Service: Gmail SMTP
- From: ${process.env.EMAIL_USER}
- To: ${recipientEmail}
- Timestamp: ${new Date().toLocaleString()}

This test email confirms that your SMTP connection is established and email sending is functional.
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        log.success(`Test email sent successfully!`);
        log.info(`Message ID: ${info.messageId}`);
        log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info) || 'Not available'}`);
        log.info(`Email sent to: ${recipientEmail}`);
        return true;
    } catch (error) {
        log.error(`Failed to send test email: ${error.message}`);
        return false;
    }
};

// // Test 5: Send OTP email (similar to your production code)
// const sendTestOTP = async (transporter, recipientEmail) => {
//     log.section('Test 5: Sending OTP Email');

//     const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
//     log.info(`Generated OTP: ${testOTP}`);

//     const mailOptions = {
//         from: `"Password Reset" <${process.env.EMAIL_USER}>`,
//         to: recipientEmail,
//         subject: 'Password Reset OTP Code - Test',
//         html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     line-height: 1.6;
//                     color: #333;
//                 }
//                 .container {
//                     max-width: 600px;
//                     margin: 0 auto;
//                     padding: 20px;
//                 }
//                 .header {
//                     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//                     color: white;
//                     padding: 30px;
//                     text-align: center;
//                     border-radius: 10px 10px 0 0;
//                 }
//                 .content {
//                     background: #f9f9f9;
//                     padding: 30px;
//                     border-radius: 0 0 10px 10px;
//                 }
//                 .otp-box {
//                     background: white;
//                     border: 2px dashed #667eea;
//                     border-radius: 8px;
//                     padding: 20px;
//                     text-align: center;
//                     margin: 20px 0;
//                 }
//                 .otp-code {
//                     font-size: 32px;
//                     font-weight: bold;
//                     color: #667eea;
//                     letter-spacing: 8px;
//                 }
//                 .warning {
//                     color: #e74c3c;
//                     font-size: 14px;
//                     margin-top: 20px;
//                 }
//                 .footer {
//                     text-align: center;
//                     margin-top: 20px;
//                     color: #666;
//                     font-size: 12px;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>Password Reset Request - TEST</h1>
//                 </div>
//                 <div class="content">
//                     <p>Hello User,</p>
//                     <p>This is a TEST email. Use the OTP code below:</p>

//                     <div class="otp-box">
//                         <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
//                         <p class="otp-code">${testOTP}</p>
//                         <p style="margin: 0; font-size: 12px; color: #999;">Valid for 5 minutes</p>
//                     </div>

//                     <p>This is a test email to verify your Nodemailer OTP functionality.</p>

//                     <p class="warning">⚠️ This is a TEST email. The OTP code is for testing purposes only.</p>

//                     <p>Best regards,<br>The Support Team</p>
//                 </div>
//                 <div class="footer">
//                     <p>This is an automated test email. Please do not reply to this message.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//         `
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         log.success(`OTP email sent successfully!`);
//         log.info(`Message ID: ${info.messageId}`);
//         log.info(`OTP Code: ${testOTP}`);
//         return true;
//     } catch (error) {
//         log.error(`Failed to send OTP email: ${error.message}`);
//         return false;
//     }
// };

// Main test runner
const runTests = async () => {
    console.log('\n');
    log.section('🚀 NODEMAILER CONFIGURATION TEST SUITE 🚀');

    // Get recipient email from command line or use default
    // const recipientEmail = process.argv[2] || process.env.EMAIL_USER;
    const recipientEmail = "usmankatcha1121@gmail.com";

    if (!recipientEmail) {
        log.error('No recipient email provided!');
        log.info('Usage: node test_nodemailer.js <recipient-email>');
        log.info('Example: node test_nodemailer.js your-email@gmail.com');
        process.exit(1);
    }

    log.info(`Recipient email: ${recipientEmail}`);
    log.info(`Test started at: ${new Date().toLocaleString()}`);

    let totalTests = 5;
    let passedTests = 0;

    // Test 1: Environment Variables
    if (testEnvironmentVariables()) {
        passedTests++;
    } else {
        log.error('Environment variables test failed. Cannot proceed.');
        log.warning('Please ensure EMAIL_USER and EMAIL_PASS are set in your .env file');
        process.exit(1);
    }

    // Test 2: Create Transporter
    const transporter = createTransporter();
    if (transporter) {
        passedTests++;
    } else {
        log.error('Transporter creation failed. Cannot proceed.');
        process.exit(1);
    }

    // Test 3: Connection Test
    if (await testConnection(transporter)) {
        passedTests++;
    } else {
        log.error('Connection test failed. Please check your credentials and try again.');
        log.section('Final Results');
        log.warning(`Tests Passed: ${passedTests}/${totalTests}`);
        process.exit(1);
    }

    // Test 4: Send Test Email
    if (await sendTestEmail(transporter, recipientEmail)) {
        passedTests++;
    }

    // Test 5: Send OTP Email
    // if (await sendTestOTP(transporter, recipientEmail)) {
    //     passedTests++;
    // }

    // Final Results
    log.section('📊 Final Test Results');

    if (passedTests === totalTests) {
        log.success(`All tests passed! (${passedTests}/${totalTests})`);
        log.success('Your Nodemailer configuration is fully functional! 🎉');
    } else {
        log.warning(`Tests Passed: ${passedTests}/${totalTests}`);
        log.error(`Tests Failed: ${totalTests - passedTests}/${totalTests}`);
    }

    log.info(`\nTest completed at: ${new Date().toLocaleString()}`);
    console.log('\n');
};

// Run the tests
runTests().catch((error) => {
    log.error(`Unexpected error: ${error.message}`);
    console.error(error);
    process.exit(1);
});
