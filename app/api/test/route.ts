import { getBlock } from "@/app/_services/databaseService";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(authOptions);   
    try{
        if (!session){
            throw {error: "User is not authenticated to test"}
        }
        const retrieved = await getBlock("65cbe1af929966312830eea0");
        return NextResponse.json(
            {...retrieved, time: new Date().getTime()},
            {
                status: 200
            }
        )
    }catch(ex){
        return NextResponse.json(
            ex,
            {
                status: 404
            }
        )
    }
}

// // below is api for week and lab (move this to a right location later)

// // api for addWeek
// export async function POST(request: NextRequest, { params }: Props) {
//     const session = await getServerSession(authOptions);

//     try {
//         if (!session || !session.user) {
//             throw new Error("User is not authenticated");
//         };
    
//         const result = await getBlock(params.blockId);
//             if (!result) {
//             throw new Error("Block with the ID is not found");
//         }
    
//         if (!result.users.includes(session.user?.email)) {
//             throw new Error("User does not have permission for this block");
//         }

//         const body = await request.json();
//         const newWeek = await addWeek(params.blockId, body.week);
//         return NextResponse.json(newWeek, {
//             status: 200,
//         });
//     } catch (ex: any) {
//         return NextResponse.json(ex, {
//             status: 500,
//         })
//     }
// }

// // api for deleteWeek
// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { blockId: string, weekId: string } }
// ) {
//     const session = await getServerSession(authOptions);

//     try {
//         if (!session || !session.user) {
//             throw new Error("User is not authenticated");
//         };
    
//         const block = await getBlock(params.blockId);
//         if (!block) {
//             throw new Error("Block with the provided ID is not found");
//         };
    
//         if (!block.users.includes(session.user.email)) {
//             throw new Error("User does not have permission for this block");
//         }    
        
//         const result = await deleteWeek(params.blockId, params.weekId);
//         return NextResponse.json(result, { status: 200, });
//     } catch (ex: any) {
//         return NextResponse.json(ex, {
//             status: 500,
//         })        
//     }
// }

// // api for addLab
// export async function POST(request: NextRequest, { params }: Props) {
//     const session = await getServerSession(authOptions);

//     try {
//         if (!session || !session.user) {
//             throw new Error("User is not authenticated");
//         };
    
//         const result = await getBlock(params.blockId);
//             if (!result) {
//             throw new Error("Block with the ID is not found");
//         }
    
//         if (!result.users.includes(session.user?.email)) {
//             throw new Error("User does not have permission for this block");
//         }

//         const body = await request.json();
//         const newLab = await addLab(params.blockId, params.weekId, body.lab);
//         return NextResponse.json(newLab, {
//             status: 200,
//         });
//     } catch (ex: any) {
//         return NextResponse.json(ex, {
//             status: 500,
//         })
//     }
// }

// // api for deleteLab
// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { blockId: string, weekId: string, labId: string } }
// ) {
//     const session = await getServerSession(authOptions);

//     try {
//         if (!session || !session.user) {
//             throw new Error("User is not authenticated");
//         };
    
//         const block = await getBlock(params.blockId);
//         if (!block) {
//             throw new Error("Block with the provided ID is not found");
//         };
    
//         if (!block.users.includes(session.user.email)) {
//             throw new Error("User does not have permission for this block");
//         }    
        
//         const result = await deleteLab(params.blockId, params.weekId, params.labId);
//         return NextResponse.json(result, { status: 200, });
//     } catch (ex: any) {
//         return NextResponse.json(ex, {
//             status: 500,
//         })        
//     }
// }