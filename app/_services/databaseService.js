const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = `mongodb+srv://pharmacy-assistant:pharmacyAssistant1234@pharmacy-assistant.mongodb.net/?retryWrites=true&w=majority`;
// Connect to your Atlas cluster
const client = new MongoClient(url);

export default async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");

    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}

run().catch(console.dir);