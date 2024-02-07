import { NextRequest, NextResponse } from "next/server";
import {
  getAllBlocks,
  addBlock,
  updateBlock,
  deleteBlock,
} from "@/app/_services/databaseService";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { error } from "console";
import { Block } from "@/interfaces/block";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);

  try {
    //checking if the user is authenticated
    if (session) {
      //getting the blocks for that user

      const blocks = await getAllBlocks(params.id);

      return NextResponse.json(blocks, {
        status: 200,
      });
    } else {
      throw {
        error: "User not authenticated",
      };
    }
  } catch (ex: any) {
    console.log("Error has occurred");
    return NextResponse.json(ex.error, {status: 404});
  }
}

export async function POST(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);

  try {
    //checking if the user is authenticated
    if (session) {
      const body = await request.json();

    try {
      await addBlock(params.id, body.block);
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

    return NextResponse.json(null, {
      status: 200,
    });
    } else {
      throw {
        error: "User not authenticated",
      };
    }

    //getting the blocks for that user

    
  } catch (ex: any) {
    return NextResponse.json(ex.error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userID: string } }
) {
  const session = await getServerSession(authOptions);

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
  const session = await getServerSession(authOptions);

  try {
    if (session) {
      const body = await request.json();

      console.log(params.id + " " + body.block.id)

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
