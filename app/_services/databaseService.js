import { Filter, MongoClient, ObjectId } from "mongodb";
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
  } finally {
    await client.close();
  }
}

export async function addUser(user) {
  try {
    //connecting to the database
    await client.connect();
    let collection = db.collection("users");

    //check if user exists
    let filter = { _id: `${user.id}` };
    let document = await collection.findOne(filter);
    let exists = document !== null ? true : false;

    let newUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      date: new Date(),
    };

    //inserting user
    if (!exists) {
      await collection.insertOne(newUser);
    }

    console.log("Successfully connected to atlas for user insertion");
  } catch (err) {
    console.log("Tried to add a user, error encountered\n" + err.log);
  } finally {
    await client.close();
  }
}

export async function getUserID(email){

  try{
    await client.connect(); 

    let collection = db.collection("users");
    let filter = {"email": email};
    console.log(email);

    let document = await collection.findOne(filter); 
    console.log(document); 

    if(document._id){
      return document._id
    }
    else{
      return null; 
    }
  }catch(ex){
    console.log(ex);
    return null; 
  }finally{
    await client.close(); 
  }
}

//todo
export async function addBlock(block) {
  try {
    await client.connect();
    let collection = db.collection("blocks");

    await collection.insertOne(block);
    console.log("Connected to atlas and added a block");
  } catch {
    console.log("Tried to add a block, error encountered\n" + err.log);
  } finally {
    await client.close();
  }
}

//todo get all blocks with a userID of the one passed
export async function getAllBlocks(userID) {
  try {
    console.log(`Getting blocks for user ${userID}`);
    await client.connect();
    let filter = {
      users: {
        $in: [String(userID)],
      },
    };
    let collection = db.collection("blocks");
    const cursor = await collection.find(filter);
    const blocks = await cursor.toArray();
    console.log(blocks); 

    return blocks;
  } catch (ex) {
    console.log(ex)
    return [];
  } finally {
    await client.close();
  }
}

//todo
export async function updateBlock(userID, blockID, newName) {
  //make sure the block in the database with the blockID in the block being passed contains the userID passed before updating
  try {
    await client.connect();
    let collection = db.collection("blocks");
    const filter = {
        _id: new ObjectId(blockID),
        users: {
            $in: [userID],
        },
    };
    const update = {
        "$set": {
            "name": newName
        }
    };
    // if there is no document matches query, this wont insert new document
    const options = {"upsert": false};
    
    const result = await collection.updateOne(filter, update, options);

    const {modifiedCount, matchedCount} = result;
    if(modifiedCount && matchedCount) {
        console.log("Successfully updated a block");
    } else if (modifiedCount === 0) {
        console.log("A matching document was found but not modified");
    } else if (matchedCount === 0) {
        console.log("There is no document matching the query");
    } 
} catch (err) {
    console.log("Update failed with error\n" + err);
} finally {
    await client.close();
}
}

//todo
export async function deleteBlock(userID, blockID) {
  //make sure the block in the database with the blockID passed contains the userID passed before deleting
  try {
    await client.connect();
    let collection = db.collection("blocks");
    const filter = {
      _id: new ObjectId(blockID),
      users: {
        $in: [userID],
      },
    };
    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 1) {
      console.log("Successfully deleted a block");
    } else {
      console.log("No block found with the specified ID and userID");
    }
  } catch (err) {
    console.log("Delete failed with error\n" + err);
  } finally {
    await client.close();
  }
}

//todo
