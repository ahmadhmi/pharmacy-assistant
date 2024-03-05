import { getBlock } from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { Lab } from "@/interfaces/Lab";
import { Week } from "@/interfaces/week";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: {
        blockId: string;
        labId: string;
    };
}

export async function GET(request: NextRequest, { params }: Props) {
    const session = await getServerSession(authOptions);
    try {
        if (!session) {
            throw { error: "User is not authenticated" };
        }
        console.log(params.blockId)
        const block = await getBlock(params.blockId);
        console.log(block)
        if (block && block.users.includes(session.user?.email)) {
            // check if block contains labId provided
            let labs:Lab[] = [];
            if(block.weeks){
                for (const week of block.weeks) {
                    if (week.labs) {
                        labs = labs.concat(week.labs);
                    }
                }
            }
            const lab = labs.find(
                (lab) => lab._id?.toString() === params.labId
            );
            if (lab) {
                return NextResponse.json(lab, {
                    status: 200,
                });
            } else {
                throw {
                    error: "Requested lab does not belong to block specified",
                };
            }
        } else {
            throw {
                error: `${session?.user?.name} does not have access to this lab or lab does not exist`,
            };
        }
    } catch (ex) {
        return NextResponse.json(ex, {
            status: 403,
        });
    }
}

