import { Filter, MongoClient } from "mongodb";
import { User } from "next-auth";
                                                                                                                                      
const url = `mongodb+srv://${process.env.MONGO_CONNECTION_USER}:${process.env.MONGO_CONNECTION_PASS}@${process.env.MONGO_CONNECTION_DATABASE}.u1s3nfi.mongodb.net/?retryWrites=true&w=majority`;
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

//todo
export async function addBlock(userID, block){
    try{
        await client.connect(); 
        let collection = db.collection("blocks"); 

        await collection.insertOne(block);
        console.log("Connected to atlas and added a block"); 
    }
    catch{
        console.log("Tried to add a block, error encountered\n" + err.log)
    }
    finally{
        await client.close(); 
    }
}

//todo get all blocks with a userID of the one passed
export async function getAllBlocks(userID){

    try{
        console.log(`Getting blocks for user ${userID}`);
        await client.connect();
        let filter = {
            users: {
                $in : [String(userID)]
            }
        }; 
        let collection = db.collection("blocks");
        const cursor = await collection.find(filter);
        const blocks = await cursor.toArray(); 

        return blocks; 
    }catch(ex){
        return [];
    }finally{
        await client.close();
    }

    
}

//todo
export async function updateBlock(userID, block){
    //make sure the block in the database with the blockID in the block being passed contains the userID passed before updating
}

//todo
export async function deleteBlock(userID, blockID){
    //make sure the block in the database with the blockID passed contains the userID passed before deleting
}

//todo

