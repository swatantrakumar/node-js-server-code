const nodemailer = require('nodemailer');

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

class SendEmailHandler {
    async sendPendingEmail(email){   
        try {
            // Send the email
            await transporter.sendMail({
                from: email.from,
                to: email.to,
                subject: email.subject,
                text: email.text,
                html: email.html,
            });

            // Update the email status to 'sent'
            email.status = 'sent';
            await email.save();
            console.log(`Email sent to ${email.to}`);
        } catch (err) {
            console.error(`Error sending email to ${email.to}:`, err);

            // Update the status to 'failed'
            email.status = 'failed';
            await email.save();
        }
    }
}
module.exports = SendEmailHandler;