const nodemailer = require('nodemailer');

function createTransporter() {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_SECURE === 'true', // Convert to boolean
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            // Optional: Customize TLS settings if needed
            // ciphers: 'SSLv3',
            rejectUnauthorized: false // Use with caution
        }
    });    

    return transporter;
}

module.exports = { createTransporter };