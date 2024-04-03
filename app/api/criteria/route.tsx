"use server";

import "server-only"; 
import { addMarkingTemplates, addSelectedTemplateField, getBlock, getTemplates, getUsersForBlock, setMarkingTemplates, setTemplate, updateTemplate } from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { Block } from "@/interfaces/block";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props{
    params:{
        blockId:string,
        weekId:string,
    }

}

export async function GET(request: NextRequest, {params}:Props){
    const session = await getServerSession(authOptions); 
    try{
        if(!session || !session.user){
            throw {error: "User is not authenticated"}
        }
        const success = await getTemplates(session.user.email); 
        if(success){
            return NextResponse.json(
                success,
                {
                    status: 200
                }
            )
        }else{
            throw {error: "Something went wrong"}
        }
        

    }catch(error){
        return NextResponse.json(
            error,
            {
                status: 403
            }
        )
    }
}

export async function POST(request:NextRequest, {params}:Props){
    const session = await getServerSession(authOptions);
    const body = await request.json(); 
    
    try{
        if(!session || !session.user){
            throw {error: "User is not authenticated"}
        }
        //setting template to one requested, no longer need to verify as db function restricts access to block specified
        const success = await addMarkingTemplates(body, session.user.email); 
        if(success){
            return NextResponse.json(
                success,
                {
                    status: 200
                }
            )
        }else{
            throw {error: "Something went wrong"}
        }
        

    }catch(error){
        return NextResponse.json(
            error,
            {
                status: 403
            }
        )
    }

}

export async function PATCH(request:NextRequest, {params}:Props){
    const session = await getServerSession(authOptions);
    const body = await request.json(); 
    
    try{
        if(!session || !session.user){
            throw {error: "User is not authenticated"}
        }
        //setting template to one requested, no longer need to verify as db function restricts access to block specified
        const success = await updateTemplate(body); 
        if(success){
            return NextResponse.json(
                success,
                {
                    status: 200
                }
            )
        }else{
            throw {error: "Something went wrong"}
        }
        

    }catch(error){
        return NextResponse.json(
            error,
            {
                status: 403
            }
        )
    }

}

