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
    sendEmail(alert) {
		console.log("Sending email for client: {}", alertData.clientId);
		try {
			if (alert.emailList == null || (Array.isArray(alert.emailList) && alert.emailList.length == 0) || alertData.emailList[0].length < 3) {
				let message = "The alert message do not have any email address associated with it.";
				alert.remarks = message;
				customQueryHandler.updateAlert(alertData, "INVALID");
				console.error(message);
				return;
			}
			if (alert.message == null) {
				let message = "The alert message do not have message body.";
				alert.remarks = message;
				customQueryHandler.updateAlert(alertData, "INVALID");
				console.error(message);
				return;
			}
			let notificationKeys = null;
			let email = {};
			email.subject = alert.title;
			email.content = alert.message;
			email.fromEmail = alert.emailFromMailId;
			email.fromName = alert.gmailFromName;
			email.contentType = alert.contentType;
			if(alert.ccEmail){
				if(alert.ccEmail.includes(";")){
					email.ccList = alert.ccEmail.split(";");
				} else {
					email.cc = alert.ccEmail;
				}
			}
			if(alert.ccList){
				email.ccList = alert.ccList;
			}
			if(alert.bccEmail){
				email.bccList = alertData.bccEmail.split(";");
			}
			if (alert.clientId) {
				notificationKeys =  customQueryHandler.getNotificationKeysByRefCode(alert.clientId);
			}
			setEmailParams(email, notificationKeys);
			let bccEmailArrayList = null;
			if(alert.bccEmail){
				bccEmailArrayList = alert.bccEmail.split(";");
			}
			if (alert.gmailList.length <= emailBatchSize && (bccEmailArrayList== null || bccEmailArrayList.length <= emailBatchSize)) {
				email.toList = alert.emailList;
				if(!StringUtils.isEmpty(alertData.getObj_id())) {
					sendCustomEmailsUsingUserPassword(email, alertData.isAttachment(), alertData.getObj_id(), alertData);
				} else {
					sendCustomEmailsUsingUserPassword(email, alertData.isAttachment(), alertData.get_id(), alertData);
				}
			} else if (bccEmailArrayList.size()>0 && bccEmailArrayList.size() >= emailBatchSize) {
				email.setToList(alertData.getEmailList());
				int batches = bccEmailArrayList.size() / emailBatchSize;
				if (bccEmailArrayList.size() % emailBatchSize != 0) {
					batches += 1;
				}
				for (int i = 0; i < batches; i++) {
					email.setBccList(bccEmailArrayList.subList(i * emailBatchSize, (i + 1) * emailBatchSize < bccEmailArrayList.size() ? (i + 1) * emailBatchSize : bccEmailArrayList.size()));
					if(!StringUtils.isEmpty(alertData.getObj_id())) {
						sendCustomEmailsUsingUserPassword(email, alertData.isAttachment(), alertData.getObj_id(), alertData);
					} else {
						sendCustomEmailsUsingUserPassword(email, alertData.isAttachment(), alertData.get_id(), alertData);
					}
				}
			} else {
				int batches = alertData.getEmailList().size() / emailBatchSize;
				if (alertData.getEmailList().size() % emailBatchSize != 0) {
					batches += 1;
				}
				for (int i = 0; i < batches; i++) {
					email.setToList(alertData.getEmailList().subList(i * emailBatchSize, (i + 1) * emailBatchSize < alertData.getEmailList().size() ? (i + 1) * emailBatchSize : alertData.getEmailList().size()));
					if(!StringUtils.isEmpty(alertData.getObj_id())) {
						sendCustomEmailsUsingUserPassword(email, alertData.isAttachment(), alertData.getObj_id(), alertData);
					} else {
						sendCustomEmailsUsingUserPassword(email, alertData.isAttachment(), alertData.get_id(), alertData);
					}
				}
			}
		} catch (e) {
			console.error("Exception while sending email -- {} " + e.message);
		}
	}
}
module.exports = SendEmailHandler;