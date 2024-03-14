"use server";

import "server-only"; 
import { getBlock, deleteLab } from "@/app/_services/databaseService";

import authOptions from "@/app/auth/authOptions";
import { Lab } from "@/interfaces/Lab";
import { Week } from "@/interfaces/week";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: {
        blockId: string;
        weekId: string;
        labId: string;
    };
}

export async function GET(request: NextRequest, { params }: Props) {
    const session = await getServerSession(authOptions);
    try {
        if (!session) {
            throw { error: "User is not authenticated" };
        }

        const block = await getBlock(params.blockId);
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { blockId: string, weekId: string, labId: string } } 
    ) {
        const session = await getServerSession(authOptions);
  
    try {
      if (!session || !session.user) {
        throw new Error("User is not authenticated");
      };
  
      const block = await getBlock(params.blockId);
      if (!block) {
        throw new Error("Block with the provided ID is not found");
      };
  
      if (!block.users.includes(session.user.email)) {
        throw new Error("User does not have permission for this block");
      }

      const result = await deleteLab(params.blockId, params.weekId, params.labId);
      return NextResponse.json(result, {
        status: 200,
      });
    } catch (ex: any) {
        return NextResponse.json(ex, {
            status: 500,
        });
    }
}    

