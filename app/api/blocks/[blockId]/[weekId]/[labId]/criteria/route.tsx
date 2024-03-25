"use server";

import "server-only"; 
import { addMarkingTemplatesField, addSelectedTemplateField, getBlock, setMarkingTemplates, setTemplate } from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { Block } from "@/interfaces/block";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


interface Props{
    params:{
        blockId:string,
        weekId:string,
        labId:string,
    }

}

export async function PUT(request:NextRequest, {params}:Props){
    const session = await getServerSession(authOptions);
    const body = await request.json(); 
    try{
        if(!session || !session.user){
            throw {error: "User is not authenticated"}
        }
        const block = await getBlock(params.blockId); 
        //check if block belongs to user
        if(!block){
            throw {error: "Block specified does not exist"}
        }
        // check if user has access to the block
        if(!block.users.includes(session.user.email)){
            throw {error: `${session.user.name} does not have access to this block`}
        }
        //setting template to one requested, no longer need to verify as db function restricts access to block specified
        const success = await addSelectedTemplateField(params.blockId, params.weekId, params.labId, body); 
        console.log(body); 
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
        const block = await getBlock(params.blockId); 
        //check if block belongs to user
        if(!block){
            throw {error: "Block specified does not exist"}
        }
        // check if user has access to the block
        if(!block.users.includes(session.user.email)){
            throw {error: `${session.user.name} does not have access to this block`}
        }
        //setting template to one requested, no longer need to verify as db function restricts access to block specified
        const success = await addMarkingTemplatesField(params.blockId, params.weekId, params.labId, body); 
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