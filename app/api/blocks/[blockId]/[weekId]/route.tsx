"use server";

import "server-only"; 
// api for deleteWeek, updateWeek?, addLab
import { getBlock, deleteWeek, addLab } from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: {
        blockId: string;
        weekId: string;
        
    }    
}

export async function POST(request: NextRequest, { params }: Props) {
    const session = await getServerSession(authOptions);
    try {
        if (!session || !session.user) {
            throw new Error("User is not authenticated");
        };
      
        const result = await getBlock(params.blockId);
        if (!result) {
            throw new Error("Block with the ID is not found");
        }
      
        if (!result.users.includes(session.user?.email)) {
            throw new Error("User does not have permission for this block");
        }       
        
        const body = await request.json(); 
        const newLab = await addLab(params.blockId, params.weekId, body);
        return NextResponse.json(newLab, {
            status: 200,
        })
    } catch (ex: any) {
        return NextResponse.json({ error: ex.message || 'Unknown error occurred' }, {
            status: 500,
        })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { blockId: string, weekId: string } } 
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

      const result = await deleteWeek(params.blockId, params.weekId);
      return NextResponse.json(result, {
        status: 200,
      });
    } catch (ex: any) {
        return NextResponse.json(ex, {
            status: 500,
        });
    }
}    
