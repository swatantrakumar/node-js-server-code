var Express = require("express");
const { MongoClient } = require('mongodb');
var cors = require("cors");
const multer = require("multer");

var app = Express();

app.use(cors());

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database Name
const dbName = 'central-elabs-prod';

var database;

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(8080,()=>{
    // Connect to the MongoDB server
    client.connect((err) => {
        if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
        }
        console.log('Connected successfully to MongoDB');
    
        database = client.db(dbName);
    
        // Now you can perform operations on the database
        // For example, you can insert a document
        // db.collection('yourCollectionName').insertOne({ key: 'value' }, (err, result) => {
        //   if (err) {
        //     console.error('Failed to insert document:', err);
        //     return;
        //   }
        //   console.log('Document inserted successfully');
        // });
    
        // Don't forget to close the connection when done
        // client.close();
    });   
})


/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});

app.get("/api/getData", function(req,res){
    const collectionName = "app_form_template";
    // Get the collection
    const collection = database.collection(collectionName);
    // Query the collection and limit the results to 25 records
    collection.find({})
    .limit(25) // Limit to 25 records
    .toArray((err, docs) => {
        if (err) {
        console.error('Error fetching data:', err);
        return;
        }

        // Log the documents to the console
        console.log('Fetched records:', docs);

        res.status(200).json(docs);

        // // Close the client connection
        // client.close();
    });
})