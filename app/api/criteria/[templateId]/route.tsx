import { deleteTemplate, getTemplate, getUsersForBlock } from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { error } from "console";
import { stat } from "fs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props{
    params:{
        blockId:string,
        templateId:string,
    }
}

export async function GET(request:NextRequest, {params}:Props){
    const session = await getServerSession(authOptions); 

    try{
        if(!session || !session.user){
            throw {error: "User is not authenticated", code: 401}
        }
        // responding to request
        const template = await getTemplate(params.templateId); 
        if(template !== null){
            return NextResponse.json(
                template,
                {
                    status: 200
                }
            )
        }else{
            throw{error: "Template could not be found", code: 404}
        }
    }catch(ex:any){
        return NextResponse.json(
            ex.error || "Something went wrong",
            {
                status: ex.code || 400
            }
        )
    }
}
export async function DELETE(request:NextRequest, {params}:Props){
    const session = await getServerSession(authOptions); 

    try{
        if(!session || !session.user){
            throw {error: "User is not authenticated", code: 401}
        }
        // responding to request
        const success = await deleteTemplate(params.templateId); 
        if(success){
            return NextResponse.json(
                success,
                {
                    status: 200
                }
            )
        }else{
            throw{error: "Template could not be found", code: 404}
        }
    }catch(ex:any){
        return NextResponse.json(
            ex.error || "Something went wrong",
            {
                status: ex.code || 400
            }
        )
    }
}