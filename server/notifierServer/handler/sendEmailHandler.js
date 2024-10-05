// const nodemailer = require('nodemailer');
const dns = require('dns');
const CollectionHandler = require('../../handler/collectionHandler');
const { createTransporter } = require('../transporter');
const Config = require('../../enum/config');



const emailBatchSize = Config.EMAIL.BATCH.SIZE;
const collectionHandler = new CollectionHandler();

class SendEmailHandler {
    async sendEmail(alert) {
		console.log("Sending email for client: {}", alert.clientId);
		try {
			if (alert.emailList == null || (Array.isArray(alert.emailList) && alert.emailList.length == 0) || alert.emailList[0].length < 3) {
				let message = "The alert message do not have any email address associated with it.";
				alert.remarks = message;
				alert.status = "INVALID";
				await collectionHandler.updateDocument(alert);
				console.error(message);
				return;
			}
			if (alert.message == null) {
				let message = "The alert message do not have message body.";
				alert.remarks = message;
				alert.status = "INVALID";
				await collectionHandler.updateDocument(alert);
				console.error(message);
				return;
			}
			// let notificationKeys = null;
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
				email.bccList = alert.bccEmail.split(";");
			}
			// if (alert.clientId) {
			// 	notificationKeys =  customQueryHandler.getNotificationKeysByRefCode(alert.clientId);
			// }
			// setEmailParams(email, notificationKeys);
			let bccEmailArrayList = null;
			if(alert.bccEmail){
				bccEmailArrayList = alert.bccEmail.split(";");
			}
			if (alert.emailList.length <= emailBatchSize && (bccEmailArrayList == null || bccEmailArrayList.length <= emailBatchSize)) {
				email.toList = alert.emailList;
				if(alert.obj_id) {
					await this.sendPendingEmail(email, alert.attachment, alert.obj_id, alert);
				} else {
					await this.sendPendingEmail(email, alert.attachment, alert._id, alert);
				}
			} else if (bccEmailArrayList.length > 0 && bccEmailArrayList.length >= emailBatchSize) {
				email.toList = alert.emailList;
				let batches = bccEmailArrayList.length / emailBatchSize;
				if (bccEmailArrayList.length % emailBatchSize) {
					batches += 1;
				}
				for (let i = 0; i < batches; i++) {					
					// Calculate the start and end indices for the current batch
					const startIndex = i * emailBatchSize;
					const endIndex = Math.min((i + 1) * emailBatchSize, bccEmailArrayList.length);

					// Get the sublist (batch) of BCC emails
					const bccEmailBatch = bccEmailArrayList.slice(startIndex, endIndex);
					email.bccList = bccEmailBatch;
					if(alert.obj_id) {
						await this.sendPendingEmail(email, alert.attachment, alert.obj_id, alert);
					} else {
						await this.sendPendingEmail(email, alert.attachment, alert._id, alert);
					}
				}
			} else {
				let batches = alert.emailList.length / emailBatchSize;
				if (alert.emailList.length % emailBatchSize != 0) {
					batches += 1;
				}
				for (let i = 0; i < batches; i++) {
					// Calculate the start and end indices for the current batch
					const startIndex = i * emailBatchSize;
					const endIndex = Math.min((i + 1) * emailBatchSize, alert.emailList.length);

					// Get the sublist (batch) of emails
					const emailBatch = alert.emailList.slice(startIndex, endIndex);
					email.toList = emailBatch;					
					if(alert.obj_id) {
						await this.sendPendingEmail(email, alert.attachment, alert.obj_id, alert);
					} else {
						await this.sendPendingEmail(email, alert.attachment, alert._id, alert);
					}
				}
			}
		} catch (e) {
			console.error("Exception while sending email -- {} " + e.message);
		}
	}
	async sendPendingEmail(email, hasAttachment, alertId, alerts){
		try {
			//const inetAddress = await dns.promises.lookup(require('os').hostname());
			// Create nodemailer transport for Gmail
			// Create nodemailer transport using environment variables
			let transporter = createTransporter();

			let mailOptions = {
				from: `"${email.fromName}" <${email.fromEmail}>`,
				subject: email.subject,
				to: email.toList.join(','),
				cc: email.ccList ? email.ccList.join(',') : undefined,
				bcc: email.bccList ? email.bccList.join(',') : undefined,
				headers: {}
			};
			if (alerts.unsubscribeLink) {
				mailOptions.headers['List-Unsubscribe'] = `<mailto: rajswatantra9@gmail.com?subject=unsubscribe>, <${alerts.unsubscribeLink}>`;
			} else {
				mailOptions.headers['List-Unsubscribe'] = '<mailto: rajswatantra9@gmail.com?subject=unsubscribe>';
			}
			mailOptions.headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';

			// Add message content and attachments
			let messageBody = {
				text: email.content,
				attachments: []
			};
	
			if (email.contentType && email.contentType.includes('html')) {
				messageBody.html = email.content;
			}

			if (hasAttachment) {
				// const attachmentFiles = await customQueryHandler.findAttachmentsByAlertId(alertId);
				// if (attachmentFiles && attachmentFiles.length > 0) {
				// 	attachmentFiles.forEach(attachment => {
				// 		messageBody.attachments.push({
				// 			filename: attachment.fileName,
				// 			content: attachment.document,
				// 			contentType: CommonUtil.getContentType(attachment.fileName.split('.').pop())
				// 		});
				// 	});
				// 	await customQueryHandler.deleteAttachment(alertId);
				// }
			}
			// Set message content and attachments to the mailOptions
			Object.assign(mailOptions, messageBody);

			// Check if there are recipients
			if ((!email.toList || email.toList.length === 0) &&
            (!email.ccList || email.ccList.length === 0) &&
            (!email.bccList || email.bccList.length === 0)) {
				alerts.remarks = 'Empty To/Cc/Bcc List Or Emails have unsubscribed from these mails';
				alerts.status = "NOT_DELIVERED";
				await collectionHandler.updateDocument(alerts);
				return;
			}

			// Send the email
			// let info = await transporter.sendMail(mailOptions);
			// console.log('Message sent: %s', info.messageId);
			alerts.status = "DELIVERED";
			await collectionHandler.updateDocument(alerts);
			
		} catch (error) {
			console.error('Error while sending email: ', error);
			alerts.remarks = error.message;
			alerts.status = "PENDING";
			await collectionHandler.updateDocument(alerts);
		}
	}
}
module.exports = SendEmailHandler;