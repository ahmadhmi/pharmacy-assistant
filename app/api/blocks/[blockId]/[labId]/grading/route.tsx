import { addGradeSheet, getBlock } from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { Lab } from "@/interfaces/Lab";
import { Block } from "@/interfaces/block";
import { Gradesheet } from "@/interfaces/gradesheet";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: {
        blockId: string;
        labId: string;
    };
}

//adding a gradesheet
export async function POST(request: NextRequest, { params }: Props) {
    const session = await getServerSession(authOptions);
    let gradesheet:Gradesheet = await request.json();
    try {
        //verifying user authentication
        if (!session) {
            throw { error: "User is not authenticated" };
        }

        //getting block with which the new gradesheet will be associated
        const block = await getBlock(params.blockId);

        //checking if the user has access to the block

        if (block && session.user?.email) {
            //if user is allowed to access the block
            if (block.users.includes(session.user?.email)) {
                // check if block contains labId provided
                let labs: Lab[] = [];
                for (const week of block.weeks) {
                    if (week.labs) {
                        labs = labs.concat(week.labs);
                    }
                }
                //if lab provided is part of the labs available for that block, add labId to gradesheet
                const lab:Lab = labs.filter((lab) => lab._id?.toString() === params.labId)[0];
                if (lab) {
                    gradesheet.labId = params.labId ; 
                    //add the gradesheet
                    const added = await addGradeSheet(gradesheet);
                    return NextResponse.json(added, {
                        status: 200,
                    });
                }else{
                    throw {
                        error: "Something went wrong when trying to add a gradesheet, please check that the lab belongs to the correct block",
                    };
                }

            } else {
                throw { error: "User does not have access to this block" };
            }
        } else {
            throw { error: "Block specified does not exist" };
        }
    } catch (ex) {
        return NextResponse.json(ex, {
            status: 403,
        });
    }
}
