import { addStudent, getBlock } from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { Block } from "@/interfaces/block";
import { Student } from "@/interfaces/student";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: {
    blockId: string;
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
    const newStudent = await addStudent(params.blockId, body.student);
    return NextResponse.json(newStudent, {
      status: 200,
    });
  } catch (ex: any) {
    return NextResponse.json(ex, {
      status: 500,
    });
  } 
}