import { getBlock } from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(authOptions);   
    try{
        if (!session){
            throw {error: "User is not authenticated to test"}
        }
        const retrieved = await getBlock("65cbe1af929966312830eea0");
        return NextResponse.json(
            {...retrieved, time: new Date().getTime()},
            {
                status: 200
            }
        )
    }catch(ex){
        return NextResponse.json(
            ex,
            {
                status: 404
            }
        )
    }
}