"use server";
import { Filter, MongoClient, ObjectId } from "mongodb";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

//const url = `mongodb+srv://${process.env.MONGO_CONNECTION_USER}:${process.env.MONGO_CONNECTION_PASS}@${process.env.MONGO_CONNECTION_DATABASE}.u1s3nfi.mongodb.net/?retryWrites=true&w=majority`;
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const db = client.db(process.env.MONGO_CONNECTION_DATABASE);

// export async function run() {
//   try {
//     await client.connect();
//     console.log("Successfully connected to Atlas");
//   } catch (err) {
//     console.log(err.stack);
//   } finally {
//     await client.close();
//   }
// }

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

export async function getUserID(email) {
  // try{
  //   await client.connect();
  //   let collection = db.collection("users");
  //   let filter = {"email": email};
  //   let document = await collection.findOne(filter);
  //   if(document._id){
  //     return document._id
  //   }
  //   else{
  //     return null;
  //   }
  // }catch(ex){
  //   console.log(ex);
  //   return null;
  // }finally{
  //   await client.close();
  // }
}

//todo
export async function addBlock(block) {
  try {
    const session = await getServerSession(authOptions);
    await client.connect();
    let collection = db.collection("blocks");
    console.log(block);
    block.users.push(session.user.email);

    await collection.insertOne(block);
    console.log("Connected to atlas and added a block");
    return block;
  } catch {
    console.log("Tried to add a block, error encountered\n" + err.log);
  } finally {
    await client.close();
  }
}

//todo get all blocks with a userID of the one passed
export async function getAllBlocks(userEmail) {
  const session = getServerSession(authOptions);
  try {
    await client.connect();
    let filter = {
      users: {
        $in: [String(userEmail.toLowerCase())],
      },
    };
    let collection = db.collection("blocks");
    const cursor = await collection.find(filter);
    const blocks = await cursor.toArray();

    return blocks;
  } catch (ex) {
    console.log("Error occurred here");
    return [];
  } finally {
    await client.close();
  }
}

export async function getBlock(blockID){
  let retrievedDoc = null; 
  try{
    await client.connect(); 
    let filter = {
      _id: new ObjectId(blockID)
    }
    let collection = db.collection("blocks"); 
    retrievedDoc = await collection.findOne(filter); 

  }catch(ex){
    console.log(ex)
    console.log(`Error in retrieving block ID: ${blockID}`);
    return null;
  }finally{
    await client.close(); 
    return retrievedDoc;
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
      $set: {
        name: newName,
      },
    };
    // if there is no document matches query, this wont insert new document
    const options = { upsert: false };

    const result = await collection.updateOne(filter, update, options);

    const { modifiedCount, matchedCount } = result;
    if (modifiedCount && matchedCount) {
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

//get all gradesheets, return a gradesheet array, filled or empty for a lab provided a labId
export async function getAllGradeSheets(labId){

}

//get singular gradesheet, return a single gradesheet or null for a lab provided a gradeSheetId
export async function getGradeSheet(gradesheetId){
  try{
    await client.connect(); 
    let collection = db.collection("gradesheets"); 

    const found = await collection.findOne({_id: new ObjectId(gradesheetId)}); 
    if(found){
      return {
        _id:found._id.toString(),
        studentID:found.studentID,
        studentName:found.studentName,
        labId:found.labId, 
        date:found.date, 
        rx:found.rx,
        criteria: found.criteria,
        comment:found.comment,
      }
    }else{
      return null; 
    }

  }catch(ex){
    console.log(`Failed to retrieve with gradesheetID: ${gradesheetId}\nFailed with error: ${ex}`);
    return null; 
  }finally{
    await client.close(); 
  }
}

//create gradesheet, return newly created gradesheet with its _id inserted

export async function addGradeSheet(gradesheet){
  try {
    await client.connect();
    let collection = db.collection("gradesheets");

    const added = await collection.insertOne(gradesheet);
    const found = await collection.findOne({_id:added.insertedId});
    const newGradesheet = {
      _id: found._id.toString(),
      studentID:found.studentID, 
      labId:found.labId, 
      date:found.date, 
      rx:found.rx,
    }
    return newGradesheet; 
  } catch(error) {
    console.log("failed to insert a gradesheet\n" + error);
    return null; 
  } finally {
    await client.close();
  }
}

//update gradesheet, return true or false

export async function updateGradeSheet(gradesheet){
  try {
    await client.connect();
    let collection = db.collection("gradesheets");
    const filter = {
      _id: new ObjectId(gradesheet._id),
    };
    const update = {
      $set: {
        studentID: gradesheet.studentID,
        studentName: gradesheet.studentName,
        labId: gradesheet.labId, 
        date: gradesheet.date, 
        rx: gradesheet.rx,
        criteria: gradesheet.criteria,
        comment: gradesheet.comment,
      },
    };
    // if there is no document matches query, this wont insert new document
    const options = { upsert: false };

    const result = await collection.updateOne(filter, update, options);
    const { modifiedCount, matchedCount } = result;
    if (modifiedCount && matchedCount) {
      console.log("Successfully updated a gradesheet");
    } else if (modifiedCount === 0) {
      console.log("A matching document was found but not modified");
    } else if (matchedCount === 0) {
      console.log("There is no document matching the query");
    }
    return true; 
  } catch (err) {
    console.log("Update failed with error\n" + err);
    return false; 
  } finally {
    await client.close();
  }
}

//delete gradesheet 

export async function deleteGradeSheet(){

}

//add student, add student with its studentId as ObjectId and return the newly added student

export async function addStudent(student){

}

//delete student, return true or false

export async function deleteStudent(studentId){

}

