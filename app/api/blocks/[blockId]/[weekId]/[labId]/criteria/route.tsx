"use server";

import "server-only"; 
import { addSelectedTemplateField, getBlock, setMarkingTemplates, setTemplate } from "@/app/_services/databaseService";
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
            throw {error: "User is not authenticated", code: 401}
        }
        const block = await getBlock(params.blockId); 
        //check if block belongs to user
        if(!block){
            throw {error: "Block specified does not exist", code: 400}
        }
        // check if user has access to the block
        if(!block.users.includes(session.user.email)){
            throw {error: `${session.user.name} does not have access to this block`, code: 403}
        }
        //setting template to one requested, no longer need to verify as db function restricts access to block specified
        const success = await addSelectedTemplateField(params.blockId, params.weekId, params.labId, body.id); 
        if(success){
            return NextResponse.json(
                success,
                {
                    status: 200
                }
            )
        }else{
            throw {error: "Something went wrong", code: 400}
        }
        

    }catch(error: any | {error: string, code: number}){
        return NextResponse.json(
            error,
            {
                status: error.code
            }
        )
    }

}

// export async function PATCH(request:NextRequest, {params}:Props){
//     const session = await getServerSession(authOptions);
//     const body = await request.json(); 
    
//     try{
//         if(!session || !session.user){
//             throw {error: "User is not authenticated"}
//         }
//         const block = await getBlock(params.blockId); 
//         //check if block belongs to user
//         if(!block){
//             throw {error: "Block specified does not exist"}
//         }
//         // check if user has access to the block
//         if(!block.users.includes(session.user.email)){
//             throw {error: `${session.user.name} does not have access to this block`}
//         }
//         //setting template to one requested, no longer need to verify as db function restricts access to block specified
//         const success = await addMarkingTemplatesField(params.blockId, params.weekId, params.labId, body); 
//         if(success){
//             return NextResponse.json(
//                 success,
//                 {
//                     status: 200
//                 }
//             )
//         }else{
//             throw {error: "Something went wrong"}
//         }
        

//     }catch(error){
//         return NextResponse.json(
//             error,
//             {
//                 status: 403
//             }
//         )
//     }

// }