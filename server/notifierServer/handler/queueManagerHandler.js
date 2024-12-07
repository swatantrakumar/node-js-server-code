const async = require('async');
const CollectionHandler = require('../../handler/collectionHandler');
const SendEmailHandler = require('./sendEmailHandler');

const collectionHandler = new CollectionHandler();
const sendMailHandler = new SendEmailHandler();

class QueueManagerHandler {    
    constructor() {
        // Define the queue with a concurrency of 1
        this.queue = async.queue(async (task) => {            
            await this.processTask(task);
        }, 1);
    }    

    // Method to process each task in the queue
    async processTask(task) {
        console.log("Alert Data received from queue for Processing! ");
		try {
			for (let type of task.typeList) {
				switch (type) {
					case "NOTIFICATION":
						// sendNotification(inData);
						break;
					case "SMS":
						// sendSMS(inData);
						break;
					case "EMAIL":
						await this.sendEmail(task);
						break;
					default:
						// invalidAlertType(inData, type);
						break;
				}
			}
		} catch (e) {
			console.error(`Error sending email to ${task.emailList[0]}: ${e}`);
		}
    }

    sendEmail = async (alert) => {
        try {
			if (alert && alert.message) {
				await sendMailHandler.sendEmail(alert);
			} else {
				let message = "Since message body is empty, therefore Email can not be sent.";
				alert.remarks(message);
				alert.status = "INVALID";
				await collectionHandler.updateDocument(alert);
				console.log(message);
			}
		} catch (e) {
			alert.remarks = e.message;
			alert.status = "INVALID";
			await collectionHandler.updateDocument(alert);
			console.error("Exception while sending email" + e);
		}
    };

    // Method to add a task to the queue
    addTask(task) {
        this.queue.push(task, (err) => {
            if (err) {
                console.error('Error processing task:', err);
            } else {
                console.log('Task Added In Queue.');
            }
        });
    }

}

module.exports = QueueManagerHandler;