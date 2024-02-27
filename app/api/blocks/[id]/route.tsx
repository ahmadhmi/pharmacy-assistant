import { NextRequest, NextResponse } from "next/server";
import {
  getAllBlocks,
  addBlock,
  updateBlock,
  deleteBlock,
  getUserID,
  getBlock,
} from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { error } from "console";
import { Block } from "@/interfaces/block";
import { getServerSession } from "next-auth";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions); 

    if(session?.user){
      const retrievedDoc = await getBlock(params.id); 
      let retrievedBlock:Block; 

      if(retrievedDoc){
        retrievedBlock = {
          _id : new String(retrievedDoc._id), 
          name: retrievedDoc.name,
          weeks: retrievedDoc.weeks,
          students: retrievedDoc.students,
          users: retrievedDoc.users,
        }
        if (session.user.email && retrievedBlock.users.includes(session?.user.email)){
          return NextResponse.json(
            retrievedBlock,
            {
              status: 200
            }
          )
        }else{
          throw {error: "User does not have access to this block"}
        }
      }else{
        throw {error: "No such block exists"}
      }
    }else{
      throw {error: "User is not authenticated and is not allowed to retrieve a block"};
    }

  } catch (ex: any) {
    return NextResponse.json(
      ex,
      {
        status: 404
      }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userID: string } }
) {
  let session = true;

  try {
    const body = await request.json();

    if (session) {
      await updateBlock(params.userID, body.block);

      return NextResponse.json(body.block, {
        status: 200,
      });
    } else {
      throw { error: "User is not authenticated" };
    }
  } catch (ex: any) {
    return NextResponse.json(
      {
        error: ex.error,
      },
      {
        status: 404,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let session = true;

  try {
    if (session) {
      const body = await request.json();

      console.log(params.id + " " + body.block.id);

      await deleteBlock(params.id, body.block.id);

      return NextResponse.json(null, {
        status: 200,
      });
    } else {
      throw { error: "User is not authenticated" };
    }
  } catch (ex: any) {
    return NextResponse.json(
      {
        error: ex.error,
      },
      {
        status: 404,
      }
    );
  }
}
