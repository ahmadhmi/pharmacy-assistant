import { Filter, MongoClient } from "mongodb";
import { User } from "next-auth";
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = `mongodb+srv://${process.env.MONGO_CONNECTION_USER}:${process.env.MONGO_CONNECTION_PASS}@${process.env.MONGO_CONNECTION_DATABASE}.tgnwjnk.mongodb.net/?retryWrites=true&w=majority`;
// Connect to your Atlas cluster
const client = new MongoClient(url);
const db = client.db(process.env.MONGO_CONNECTION_DATABASE); 

export async function run() {
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

export async function addUser(user){
    try{
        //connecting to the database
        await client.connect();
        let collection = db.collection("users");

        //check if user exists
        let filter = {"_id" : `${user.id}`}; 
        let document = await collection.findOne(filter); 
        let exists = document !== null ? true : false;

        let newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            date: new Date()

        }

        //inserting user
        if(!exists){
            await collection.insertOne(newUser);
        }

        console.log("Successfully connected to atlas for user insertion"); 

    }
    catch(err){
        console.log("Tried to add a user, error encountered\n" + err.log); 
    }
    finally{
        await client.close(); 
    }
}

export async function addBlock(name){
    try{
        await client.connect(); 
        let collection = db.collection("blocks"); 

        let newBlock = {
            name: name
        };

        await collection.insertOne(newBlock);
        console.log("Connected to atlas and added a block"); 
    }
    catch{
        console.log("Tried to add a block, error encountered\n" + err.log)
    }
    finally{
        await client.close(); 
    }
}
