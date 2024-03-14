"use server";

import "server-only"; 
import {
    getBlock,
    getLab,
    setMarkingTemplates,
    setTemplate,
} from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

let markingTemplates = [
    {
        name: "Default",
        description:
            "The default marking template as specified by a physical sample from the pharmacy assistant program",
        criteria: [
            {
                name: "Drug Selected",
                pass: false,
            },
            {
                name: "Patient Profile",
                pass: false,
            },
            {
                name: "Prescriber",
                pass: false,
            },
            {
                name: "Sig",
                pass: false,
            },
            {
                name: "Dispense Quantity",
                pass: false,
            },
            {
                name: "Billing Procedure",
                pass: false,
            },
            {
                name: "Auxiliary Labels",
                pass: false,
            },
            {
                name: "Accurate Drug Monograph",
                pass: false,
            },
            {
                name: "Question",
                pass: false,
            },
        ],
    },
    {
        name: "Test 1",
        description:
            "Test 1",
        criteria: [
            {
                name: "Drug Selected",
                pass: false,
            },
            {
                name: "Patient Profile",
                pass: false,
            },
            {
                name: "Prescriber",
                pass: false,
            },
            {
                name: "Sig",
                pass: false,
            },
            {
                name: "Dispense Quantity",
                pass: false,
            },
            {
                name: "Billing Procedure",
                pass: false,
            },
            {
                name: "Auxiliary Labels",
                pass: false,
            },
        ],
    },
]


export async function GET() {
    const session = await getServerSession(authOptions);
    try {
        if (!session) {
            throw { error: "User is not authenticated to test" };
        }
        const retrieved = await getBlock(
            "65cbe1af929966312830eea0",
            );
        return NextResponse.json(
            { ...retrieved, time: new Date().getTime() },
            {
                status: 200,
            }
        );
    } catch (ex) {
        return NextResponse.json(ex, {
            status: 404,
        });
    }
}
