"use server";

import "server-only"; 
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest){

    const session = await getServerSession(authOptions); 

    if(session){
        
    }

}