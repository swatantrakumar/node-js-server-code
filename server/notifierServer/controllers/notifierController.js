const Operators = require("../../enum/operator");
const CollectionHandler = require("../../handler/collectionHandler");
const Alerts = require("../../model/alerts/alerts");
const QueueManagerHandler = require("../handler/queueManagerHandler");
const QueryCriteria = require("./../../handler/queryHandler/queryCriteria");

const queueManagerHandler = new QueueManagerHandler();
const collectionHandler = new CollectionHandler();

class NotifierController {
    // Function to continuously check for new items
    startPolling = () => {
        setInterval(async () => {
            const pendingNotifierList = await this.fetchPendingItems();
            if(pendingNotifierList && pendingNotifierList.length > 0){
                pendingNotifierList.forEach(item => {
                    queueManagerHandler.addTask(item);
                });
            }
        }, 60000); // Check every 60 seconds
    };
    async fetchPendingItems(){
        // Define your query to check for pending items (e.g., status: 'pending')
        let queryCriteriaList = [];
        queryCriteriaList.push(new QueryCriteria("status","string",Operators.EQUAL,'PENDING'));
        queryCriteriaList.push(new QueryCriteria("deliveryDate","string",Operators.RANGE_BORDER_LESS_THAN_INCLUSIVE,new Date()));
        
        

        // Step 1: Check if any pending items exist
        const exists = await collectionHandler.checkDocumentExists(Alerts,queryCriteriaList);

        if (!exists) {
            console.log('No pending items found.');
            return []; // No need to query the database further
        }

        // Step 2: If items exist, query the database to get the full list
        const pendingItems = await collectionHandler.findAllDocumentsWithListQueryCriteria(Alerts,queryCriteriaList,null,1,100,'',"central_notifier");
        return pendingItems;
    }
}

module.exports = NotifierController;