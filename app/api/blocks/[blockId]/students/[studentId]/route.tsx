"use server";

import "server-only"; 
import { deleteStudent, getBlock } from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE( 
  request: NextRequest, 
  { params }: { params: { blockId: string, studentId: string } } 
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

    const result = await deleteStudent(params.blockId, params.studentId);
    return NextResponse.json(result, { status: 200, });
  } catch (ex: any) {
    return NextResponse.json(ex, {
      status: 500,
    });
  }
}