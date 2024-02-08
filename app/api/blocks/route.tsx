import { NextRequest, NextResponse } from "next/server";
import { getAllBlocks, addBlock } from "@/app/_services/databaseService";

interface Props{
    params: {
        email:string,
    }
}


export async function GET(request: NextRequest, { params }: Props) {

    let session = true;
  
    try {
      console.log("Email: " + params.email); 
      //checking if the user is authenticated
      if (session) {
        //getting the blocks for that user
  
        const blocks = await getAllBlocks(params.email);
  
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
  
    let session = true;
    const body = await request.json();
    try {
      //checking if the user is authenticated
      if (session) {
      try {
        await addBlock(body.block);
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