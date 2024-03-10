import { addStudent } from "@/app/_services/databaseService";
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
    if (!session) {
      throw new Error("User is not authenticated");
    };

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