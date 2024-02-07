import { NextResponse } from "next/server";
import { addBlock, getAllBlocks } from "@/app/_services/databaseService";


export async function GET(){
    await addBlock("Test"); 
    console.log("Added test block");
    return new Response(null, {status: 201});
}

export async function POST(){

}