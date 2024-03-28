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
    };
}

export async function POST(request: NextRequest, { params }: Props) {
    const session = await getServerSession(authOptions);
    try {
        if (!session || !session.user) {
            throw { error: "User is not authenticated", code: 401 };
        }

        const result = await getBlock(params.blockId);
        if (!result) {
            throw { error: "Block with the ID is not found", code: 404 };
        }

        if (!result.users.includes(session.user?.email)) {
            throw {
                error: `${session.user.name} does not have permission for this block`,
                code: 403,
            };
        }

        const body = await request.json();
        const newLab = await addLab(params.blockId, params.weekId, body);
        return NextResponse.json(newLab, {
            status: 200,
        });
    } catch (ex: any) {
        return NextResponse.json(ex.error, {
            status: ex.code || 400,
        });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { blockId: string; weekId: string } }
) {
    const session = await getServerSession(authOptions);

    try {
        if (!session || !session.user) {
            throw { error: "User is not authenticated", code: 401 };
        }

        const block = await getBlock(params.blockId);
        if (!block) {
            throw { error: "Block with the ID is not found", code: 404 };
        }

        if (!block.users.includes(session.user?.email)) {
            throw {
                error: `${session.user.email} does not have access to this block`,
                code: 403,
            };
        }

        if (block.admin !== session.user.email) {
            throw {
                error: `${session.user.name} does not have administrative permissions to delete weeks`,
                code: 403,
            };
        }

        const result = await deleteWeek(params.blockId, params.weekId);
        return NextResponse.json(result, {
            status: 200,
        });
    } catch (ex: { error: string; code: number } | any) {
        return NextResponse.json(ex, {
            status: 500,
        });
    }
}
