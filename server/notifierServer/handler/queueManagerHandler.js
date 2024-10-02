const async = require('async');

class QueueManagerHandler {    
    constructor() {
        // Define the queue with a concurrency of 1
        this.queue = async.queue(async (task) => {            
            await this.processTask(task);
        }, 1);
    }    

    // Method to process each task in the queue
    async processTask(task) {
        try {
            console.log(`Sending email to: ${task.emailList[0]}`);
            await this.sendEmail(task.email);
            console.log(`Email sent to: ${task.emailList[0]}`);
            // Here, you would update the status in your database to 'delivered'
        } catch (error) {
            console.error(`Error sending email to ${task.emailList[0]}: ${error}`);
            // Update the status in your database to 'failed' with the error reason
        } 
    }

    sendEmail = async (email) => {
        const success = Math.random() > 0.2; // 80% success rate
        await new Promise((resolve) => setTimeout(resolve, 150)); // Simulate time to send an email
        if (success) {
            return 'Email sent';
        } else {
            throw new Error('Failed to send email');
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