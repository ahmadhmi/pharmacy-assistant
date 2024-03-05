import { getBlock, getGradeSheet, updateGradeSheet } from "@/app/_services/databaseService"
import authOptions from "@/app/auth/authOptions"
import { Lab } from "@/interfaces/Lab"
import { error } from "console"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

interface Props{
    params:{
        blockId:string,
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
                const lab = labs.filter((lab) => lab._id?.toString() === params.labId)[0]; 
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
