"use server"; 
import { NextRequest, NextResponse } from "next/server";
import { getAllBlocks, addBlock } from "@/app/_services/databaseService";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

interface Props{
    params: {
        email:string,
    }
}


export async function GET(request: NextRequest, { params }: Props) {


  
    try {
      const session = await getServerSession(authOptions); 
      //checking if the user is authenticated
      if (session) {
        //getting the blocks for that user

        const blocks = await getAllBlocks(session.user?.email); 
  
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
      return NextResponse.json(ex, {status: 404});
    }
  }
  
  export async function POST(request: NextRequest, { params }: Props) {
  
    const session = await getServerSession(authOptions); 
    const body = await request.json();


    try {
      //checking if the user is authenticated
      if (session) {
        let addedBlock; 
      try {
        addedBlock = await addBlock(body);
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
  
      return NextResponse.json(addedBlock, {
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