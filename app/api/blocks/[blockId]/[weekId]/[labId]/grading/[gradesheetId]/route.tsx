"use server";

import "server-only"; 
import { deleteGradeSheet, getBlock, getGradeSheet, getLab, updateGradeSheet } from "@/app/_services/databaseService"
import authOptions from "@/app/auth/authOptions"
import { Lab } from "@/interfaces/Lab"
import { error } from "console"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

interface Props{
    params:{
        blockId:string,
        weekId:string,
        labId:string,
        gradesheetId:string
    }
}

export async function GET(request:NextRequest, {params}:Props){
    const session = await getServerSession(authOptions); 
    try{
        if(session && session.user){
            // check if the user email is contained within the block
            const block = await getBlock(params.blockId); 
            if (block && block.users.includes(session.user.email)){
                // check if block contains labId provided
                let labs:Lab[] = [];
                for (const week of block.weeks){
                    if (week.labs){
                        labs = labs.concat(week.labs);
                    }
                }
 
                //if lab provided is part of the labs available for that block, get gradesheet
                const lab = labs.find((lab) => lab._id?.toString() === params.labId); 
                if(lab){
                    const found = await getGradeSheet(params.gradesheetId);
                    if(found && found?.labId === params.labId){
                        return NextResponse.json(
                            found,
                            {
                                status: 200
                            }
                        )
                    }else{
                        throw {error: "Requested gradesheet does not belong to lab specified"}
                    }
                }else{
                    throw {error: "No lab found"}
                }   
            }else{
                throw {error: `Block does not belong to ${session.user.name} or block does not exist`}
            }
        }else{
            throw {error: "User is not authenticated"}
        }
    }catch(ex){
        return NextResponse.json(
            ex,
            {
                status: 403
            }
        )
    }
}

export async function PUT(request:NextRequest, {params}:Props){
    const session = await getServerSession(authOptions); 
    const gradesheet = await request.json(); 
    try{
        if(session && session.user){
            // check if the user email is contained within the block
            const block = await getBlock(params.blockId); 
            if (block && block.users.includes(session.user.email)){
                // check if block contains labId provided
                let labs:Lab[] = [];
                for (const week of block.weeks){
                    if (week.labs){
                        labs = labs.concat(week.labs);
                    }
                }
                //if lab provided is part of the labs available for that block, get gradesheet
                const lab = labs.filter((lab) => lab._id?.toString() === params.labId)[0]; 
                if(lab){
                    const updated = await updateGradeSheet(gradesheet);
                    if(updated){
                        return NextResponse.json(
                            gradesheet,
                            {
                                status: 200
                            }
                        )
                    }else{
                        throw {error: "Update failed"}
                    }
                }   
            }else{
                throw {error: `Block does not belong to ${session.user.name} or block does not exist`}
            }
        }else{
            throw {error: "User is not authenticated"}
        }
    }catch(ex){
        return NextResponse.json(
            ex,
            {
                status: 403
            }
        )
    }
}

export async function DELETE(request: NextRequest, {params}:Props){

    const session = await getServerSession(authOptions);
    const gradesheet = await request.json(); 

    try{

        //check if user is authenticated
        if (!session?.user){
            throw {error: "User is not authenticated", code: 401}
        }

        ///check if the block to which the gradesheet belongs is owned by the user
        const block = await getBlock(params.blockId); 
        if(!block?.users.contains(session.user.email)){
            throw {error: `${session.user.name} does not have access to this block`}
        }

        //check if gradesheet belongs to the current block and lab
        const lab = await getLab(params.blockId, params.weekId ,params.labId);
        if(!(lab && lab._id === gradesheet.labId)){
            throw {error: "The marking sheet does not belong to the lab and block specified"}
        }

        //deleting gradesheet
        const success = await deleteGradeSheet(gradesheet._id); 

        if(success){
            return NextResponse.json(
                true,
                {
                    status: 200
                }
            )
        }else{
            throw {error: "No marking sheet was deleted because it either does not exist or the id is mismatched", code: 400}
        }

    }catch(error:{error:string, code:number} | any){
        return NextResponse.json(
            error,
            {
                status: error.code || 404
            }

        )
    }


}
