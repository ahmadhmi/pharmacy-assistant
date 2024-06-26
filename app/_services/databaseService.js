"use server";
import "server-only";
import { Filter, MongoClient, ObjectId } from "mongodb";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

//const url = `mongodb+srv://${process.env.MONGO_CONNECTION_USER}:${process.env.MONGO_CONNECTION_PASS}@${process.env.MONGO_CONNECTION_DATABASE}.u1s3nfi.mongodb.net/?retryWrites=true&w=majority`;
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const onStart = async () => await client.connect();
onStart();
var db = client.db(process.env.MONGO_CONNECTION_DATABASE);

process.on("beforeExit", async () => {
  await client.close();
  console.log("closed db connection");
});

// async function requestClose(){
//     await client.close();
//     console.log("closed");
//     console.log("Closing, Client open?:" + clientOpen);
// }

// async function requestOpen(){
//   //check if since its been more than 5 seconds since last request
//   console.log("Opening, Client open?:" + clientOpen);
//   if(!clientOpen){
//     await client.connect();
//     console.log("Opened")
//     setTimeout(requestClose, 30000)
//   }
//   else{
//     console.log("Rejected open request")
//     return Promise.resolve();
//   }
// }

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
    //await client.connect();
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
    // await client.close();
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

export async function getUsersForBlock(blockId) {
  try {
    let collection = db.collection("blocks");
    const result = await collection
      .find({
        _id: new ObjectId(blockId),
      })
      .project({
        users: 1,
        _id: 0,
      });
    const users = await result.toArray();
    return users[0].users;
  } catch (error) {
    console.log(error);
    return [];
  }
}

//todo
export async function addBlock(block) {
  try {
    const session = await getServerSession(authOptions);
    //await client.connect();
    let collection = db.collection("blocks");
    console.log(block);
    block.users.push(session.user.email);
    block.admin = session.user.email;

    await collection.insertOne(block);
    console.log("Connected to atlas and added a block");
    return block;
  } catch {
    console.log("Tried to add a block, error encountered\n" + err.log);
  } finally {
    //await client.close();
  }
}

//todo get all blocks with a userID of the one passed
export async function getAllBlocks(userEmail) {
  try {
    //await client.connect();
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
    return [];
  } finally {
    //await client.close();
  }
}

export async function getBlock(blockID) {
  let retrievedDoc = null;
  try {
    let db = client.db(process.env.MONGO_CONNECTION_DATABASE);
    //await client.connect();
    let filter = {
      _id: new ObjectId(blockID),
    };
    let collection = db.collection("blocks");
    retrievedDoc = await collection.findOne(filter);
  } catch (ex) {
    console.log(ex);
    console.log(`Error in retrieving block ID: ${blockID}`);
    return null;
  } finally {
    //await client.close();
    return retrievedDoc;
  }
}

export async function updateBlock(blockID, newBlock) {
  console.log(blockID + " " + newBlock);
  try {
    //await client.connect();
    let collection = db.collection("blocks");
    const filter = {
      _id: new ObjectId(blockID),
    };
    // do not set weeks because its not necessary and it replaces all objectId's with strings in the db for children weeks and labs
    const update = {
      $set: {
        name: newBlock.name,
        students: newBlock.students,
        users: newBlock.users,
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
    return true;
  } catch (err) {
    console.log("Update block failed with error\n" + err);
    return false;
  } finally {
    //await client.close();
  }
}

//todo
export async function deleteBlock(blockID) {
  //make sure the block in the database with the blockID passed contains the userID passed before deleting
  try {
    //await client.connect();
    let collection = db.collection("blocks");
    const filter = {
      _id: new ObjectId(blockID),
      // users: {
      //   $in: [userID],
      // },
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
    //await client.close();
  }
}

//todo

//get all gradesheets, return a gradesheet array, filled or empty for a lab provided a labId
export async function getAllGradeSheets(labId) {
  try {
    //await client.connect();
    let collection = db.collection("gradesheets");
    let filter = {
      labId: labId,
    };
    const cursor = await collection.find(filter);
    const gradesheets = await cursor.toArray();
    return gradesheets;
  } catch (error) {
    console.log("Error occurred while fetching grade sheets: " + error);
    return [];
  } finally {
    //await client.close();
  }
}

//get singular gradesheet, return a single gradesheet or null for a lab provided a gradeSheetId
export async function getGradeSheet(gradesheetId) {
  try {
    //await client.connect();
    let collection = db.collection("gradesheets");
    const found = await collection.findOne({ _id: new ObjectId(gradesheetId) });
    if (found) {
      return {
        _id: found._id.toString(),
        studentID: found.studentID,
        studentName: found.studentName,
        labId: found.labId,
        date: found.date,
        rx: found.rx,
        criteria: found.criteria,
        score: found.score,
        maxScore: found.maxScore,
        pass: found.pass,
        comment: found.comment,
      };
    } else {
      return null;
    }
  } catch (ex) {
    console.log(
      `Failed to retrieve with gradesheetID: ${gradesheetId}\nFailed with error: ${ex}`
    );
    return null;
  } finally {
    //await client.close();
  }
}

//create gradesheet, return newly created gradesheet with its _id inserted

export async function addGradeSheet(gradesheet) {
  try {
    //await client.connect();
    let collection = db.collection("gradesheets");

    const added = await collection.insertOne(gradesheet);
    const found = await collection.findOne({ _id: added.insertedId });
    const newGradesheet = {
      _id: found._id.toString(),
      studentID: found.studentID,
      studentName: found.studentName,
      labId: found.labId,
      date: found.date,
      rx: found.rx,
    };
    return newGradesheet;
  } catch (error) {
    console.log("failed to insert a gradesheet\n" + error);
    return null;
  } finally {
    //await client.close();
  }
}

//update gradesheet, return true or false

export async function updateGradeSheet(gradesheet) {
  try {
    //await client.connect();
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
        score: gradesheet.score,
        maxScore: gradesheet.maxScore,
        pass: gradesheet.pass,
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
    //await client.close();
  }
}

//delete gradesheet

export async function deleteGradeSheet(gradesheetID) {
  try {
    //await client.connect();
    let collection = db.collection("gradesheets");

    const filter = {
      _id: new ObjectId(gradesheetID),
    };
    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 1) {
      console.log("Successfully deleted a gradesheet");
      return true;
    } else {
      console.log("No gradesheet found with the specified ID");
      return false;
    }
  } catch (error) {
    console.log("Delete failed with error\n" + error);
    return false;
  } finally {
    //await client.close();
  }
}

//add student, add student with its studentId as ObjectId and return the newly added student

export async function addStudent(blockId, student) {
  try {
    //await client.connect();
    let collection = db.collection("blocks");

    // this checks if there is already a student with the same name
    const existingStudent = await collection.findOne({
      _id: new ObjectId(blockId),
      "students.firstName": student.firstName,
      "students.lastName": student.lastName,
    });

    if (existingStudent) {
      console.log("A student with the same name already exists");
      return null;
    }

    const newStudent = { student };

    const result = await collection.updateOne(
      { _id: new ObjectId(blockId) },
      { $push: { students: newStudent } }
    );

    if (result.modifiedCount === 1) {
      console.log("Successfully a new student has been inserted");
      newStudent._id = newStudent._id.toString();
      return newStudent;
    } else {
      console.log("No student has been inserted");
      return null;
    }
  } catch (error) {
    console.log("Failed to add with error\n" + error.message);
    return null;
  } finally {
    //await client.close();
  }
}

//delete student, return true or false
export async function deleteStudent(blockId, studentId) {
  try {
    //await client.connect();
    let collection = db.collection("blocks");

    const result = await collection.updateOne(
      { _id: new ObjectId(blockId) },
      { $pull: { students: { _id: new ObjectId(studentId) } } }
    );

    if (result.modifiedCount === 1) {
      console.log("Successfully the student has been deleted");
      return true;
    } else {
      console.log("No student found with the specified ID");
      return false;
    }
  } catch (error) {
    console.log("Delete failed with an error\n" + error.message);
    return false;
  } finally {
    //await client.close();
  }
}

//add week to a specified document, return the newly added week with its id
export async function addWeek(blockId, week) {
  try {
    //await client.connect();
    let collection = db.collection("blocks");

    const newWeek = {
      _id: new ObjectId(),
      ...week,
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(blockId) },
      { $push: { weeks: newWeek } }
    );

    if (result.modifiedCount === 1) {
      console.log("Successfully a new week has been inserted");
      newWeek._id = newWeek._id.toString();
      return newWeek;
    } else {
      console.log("No week has been inserted");
    }
  } catch (error) {
    console.log("Failed to add with error\n" + error.message);
  } finally {
    //await client.close();
  }
}

//delete week from a specified document, return true or false
export async function deleteWeek(blockId, weekId) {
  try {
    //await client.connect();
    let collection = db.collection("blocks");
    let gradesheetCol = db.collection("gradesheets");

    const block = await getBlock(blockId);

    //const week

    const result = await collection.updateOne(
      { _id: new ObjectId(blockId) },
      { $pull: { weeks: { _id: new ObjectId(weekId) } } }
    );

    if (result.modifiedCount === 1) {
      console.log("Successfully the week has been deleted");
      return true;
    } else {
      console.log("No week found with the specified ID");
      return false;
    }
  } catch (error) {
    console.log("Delete failed with error\n" + error.message);
    return false;
  } finally {
    //await client.close();
  }
}

// add new lab under a specified week, return newly added lab with its id
export async function addLab(blockId, weekId, lab) {
  try {
    //await client.connect();
    let collection = db.collection("blocks");
    const newLab = { _id: new ObjectId(), ...lab };

    const result = await collection.updateOne(
      { _id: new ObjectId(blockId), "weeks._id": new ObjectId(weekId) },
      { $push: { "weeks.$.labs": newLab } }
    );

    if (result.modifiedCount === 1) {
      console.log("Successfully a new lab has been inserted");
      newLab._id = newLab._id.toString();
      return newLab;
    } else {
      console.log("No lab has been inserted");
      return null;
    }
  } catch (error) {
    console.log("Failed to add with error\n" + error.message);
    return null;
  } finally {
    //await client.close();
  }
}

// delete a lab with a specified id, return true or false
export async function deleteLab(blockId, weekId, labId) {
  try {
    //await client.connect();
    let collection = db.collection("blocks");

    const result = await collection.updateOne(
      { _id: new ObjectId(blockId), "weeks._id": new ObjectId(weekId) },
      { $pull: { "weeks.$.labs": { _id: new ObjectId(labId) } } }
    );

    let gradeSheetCol = db.collection("gradesheets");
    const result2 = await gradeSheetCol.deleteMany({ labId: labId });

    if (result.modifiedCount === 1) {
      console.log("Successfully the lab has been deleted");
      return true;
    } else {
      console.log("No lab found with the specified ID");
      return false;
    }
  } catch (error) {
    console.log("Delete failed with an error\n" + error.message);
    return false;
  } finally {
    //await client.close();
  }
}

//get lab with specified id, returns lab or null
export async function getLab(blockId, weekId, labId) {
  try {
    //await client.connect();
    let collection = db.collection("blocks");

    const retrievedDoc = await collection
      .aggregate([
        {
          $match: { _id: new ObjectId(blockId) },
        },
        {
          $unwind: "$weeks",
        },
        {
          $match: { "weeks._id": new ObjectId(weekId) },
        },
        {
          $unwind: "$weeks.labs",
        },
        {
          $match: { "weeks.labs._id": new ObjectId(labId) },
        },
        { $replaceRoot: { newRoot: "$weeks.labs" } },
      ])
      .toArray();

    const lab = {
      _id: retrievedDoc[0]._id,
      name: retrievedDoc[0].name,
      selectedTemplate: retrievedDoc[0].selectedTemplate,
      markingTemplates: retrievedDoc[0].markingTemplates,
    };

    if (retrievedDoc) {
      return lab;
    }
  } catch (error) {
    console.log("GetLab failed with an error\n" + error.message);
    return null;
  } finally {
    //await client.close();
  }
}

// set the marking template for a specific lab, return true or false
export async function setTemplate(blockId, weekId, labId, template) {
  try {
    //await client.connect();
    let collection = db.collection("blocks");
    const result = await collection.updateOne(
      {
        _id: new ObjectId(blockId),
        weeks: { $elemMatch: { _id: weekId, "labs._id": labId } },
      },
      {
        $set: {
          "weeks.$[weekElem].labs.$[labElem].selectedTemplate": template,
        },
      },
      {
        arrayFilters: [
          { "weekElem._id": new ObjectId(weekId) },
          { "labElem._id": new ObjectId(labId) },
        ],
      }
    );
    console.log(template);
    console.log(result);

    if (result.modifiedCount === 1) {
      console.log("Successfully updated a template");
      return true;
    } else {
      console.log("No template has been updated");
      return false;
    }
  } catch (error) {
    console.log("Failed to update template with error\n" + error.message);
    return false;
  } finally {
    //await client.close();
  }
}

export async function setMarkingTemplates(blockId, weekId, labId, templates) {
  try {
    //await client.connect();
    let collection = db.collection("blocks");
    const result = await collection.updateOne(
      {
        _id: new ObjectId(blockId),
        weeks: {
          $elemMatch: {
            _id: new ObjectId(weekId),
            "labs._id": new ObjectId(labId),
          },
        },
      },
      {
        $set: {
          "weeks.$[weekElem].labs.$[labElem].markingTemplates": templates,
        },
      },
      {
        arrayFilters: [
          { "weekElem._id": new ObjectId(weekId) },
          { "labElem._id": new ObjectId(labId) },
        ],
      }
    );
    console.log(result);

    if (result.modifiedCount === 1) {
      console.log("Successfully a new lab has been inserted");
      return newLab;
    } else {
      console.log("No lab has been inserted");
      return null;
    }
  } catch (error) {
    console.log("Failed to add with error\n" + error.message);
    return null;
  } finally {
    //await client.close();
  }
}

// add a new field "markingTemplates" in a lab with a specific ID, return true or false
export async function addMarkingTemplates(templates, user) {
  try {
    //await client.connect();
    let collection = db.collection("markingTemplates");
    templates.user = user;
    const result = await collection.insertOne(templates);

    if (result.insertedId) {
      console.log("Successfully a new template has been added");
      return result.insertedId;
    } else if (result.matchedCount >= 1) {
      console.log("No updates were made");
      return result.insertedId;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Add failed with an error\n" + error.message);
    return false;
  } finally {
    //await client.close();
  }
}

// add a new field "selectedTemplate" in a lab with a specific ID, return true or false
export async function addSelectedTemplateField(
  blockId,
  weekId,
  labId,
  selectedTemplate
) {
  try {
    //await client.connect();
    let collection = db.collection("blocks");
    const result = await collection.updateOne(
      {
        _id: new ObjectId(blockId),
      },
      {
        $set: {
          "weeks.$[weeks].labs.$[labs].selectedTemplate": new ObjectId(
            selectedTemplate
          ),
        },
      },
      {
        arrayFilters: [
          { "weeks._id": new ObjectId(weekId) },
          { "labs._id": new ObjectId(labId) },
        ],
      }
    );
    console.log(result);

    if (result.modifiedCount === 1) {
      console.log("Successfully a new field had been created in the lab");
      return true;
    } else if (result.matchedCount >= 1) {
      console.log("No updates were made");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Add failed with an error\n" + error.message);
  } finally {
    //await client.close();
  }
}

export async function getTemplates(userId) {
  try {
    let collection = db.collection("markingTemplates");
    const result = await collection.find({
      user: userId,
    });
    const templates = await result.toArray();
    templates.forEach((template) => delete template.user);
    return templates;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getTemplate(templateId) {
  try {
    let collection = db.collection("markingTemplates");
    const result = await collection.findOne({
      _id: new ObjectId(templateId),
    });
    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export async function updateTemplate(updatedTemplate) {
  try {
    let collection = db.collection("markingTemplates");
    const result = await collection.updateOne(
      {
        _id: new ObjectId(updatedTemplate._id),
      },
      {
        $set: {
          name: updatedTemplate.name,
          description: updatedTemplate.description,
          criteria: updatedTemplate.criteria,
          minimum: updatedTemplate.minimum,
        },
      }
    );
    if (result.modifiedCount == 1 || result.matchedCount == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteTemplate(templateId) {
  try {
    let collection = db.collection("markingTemplates");
    const result = await collection.deleteOne({
      _id: new ObjectId(templateId),
    });
    if (result.deletedCount == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

// async function main() {
//   let blockId = "65f9da4e7f4662fafa44a0fb";
//   let weekId = "65f9db4e7f4662fafa44a0fc";
//   let labId = "65f9db777f4662fafa44a0fd";
//   let result = await addSelectedTemplateField(blockId, weekId, labId);
//   let result2 = await addMarkingTemplatesField(blockId, weekId, labId);
//   console.log(result);
//   console.log(result2);
// }
// main();
