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
  params: { blockId: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user) {
      const retrievedDoc = await getBlock(params.blockId);
      let retrievedBlock: Block;

      if (retrievedDoc) {
        retrievedBlock = {
          _id: new String(retrievedDoc._id),
          name: retrievedDoc.name,
          weeks: retrievedDoc.weeks,
          students: retrievedDoc.students,
          users: retrievedDoc.users,
        };
        if (
          session.user.email &&
          retrievedBlock.users.includes(session?.user.email)
        ) {
          return NextResponse.json(retrievedBlock, {
            status: 200,
          });
        } else {
          throw { error: `${session.user.name} does not have access to this block or the block does not exist` };
        }
      } else {
        throw { error: "No such block exists" };
      }
    } else {
      throw {
        error:
          "User is not authenticated and is not allowed to retrieve a block",
      };
    }
  } catch (ex: any) {
    return NextResponse.json(ex, {
      status: 404,
    });
  }
}

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { userID: string } }
// ) {
//   const session = await getServerSession(authOptions)

//   try {
//     const body = await request.json();
//     const oldBlock = await getBlock(body.block._id);
//     if (session) {

//       if(oldBlock && oldBlock.users.includes(session.user?.email)){
//         const success = await updateBlock(params.userID, body.block);
//         if(success){
//           return NextResponse.json(body.block, {
//             status: 200,
//           });
//         }else{
//           throw {error: "Something went wrong when trying to update a block"}
//         }

//       }else{
//         throw {error: `${session.user?.name} does not have access to this block or this block may not exist`}
//       }

//     } else {
//       throw { error: "User is not authenticated" };
//     }
//   } catch (ex: any) {
//     return NextResponse.json(
//       ex,
//       {
//         status: 404,
//       }
//     );
//   }
// }

export async function PATCH(
  request: NextRequest,
  { params }: { params: { blockId: string } }
) {
  const session = await getServerSession(authOptions);
  try {
    const body = await request.json();
    const oldBlock = await getBlock(body._id);
    if (session) {
      if (oldBlock && oldBlock.users.includes(session.user?.email)) {
        const success = await updateBlock(params.blockId, body);
        if (success) {
          return NextResponse.json(body.block, {
            status: 200,
          });
        } else {
          throw { error: "Something went wrong when trying to update a block" };
        }
      } else {
        throw {
          error: `${session.user?.name} does not have access to this block or this block may not exist`,
        };
      }
    } else {
      throw { error: "User is not authenticated" };
    }
  } catch (ex: any) {
    return NextResponse.json(ex, {
      status: 404,
    });
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
