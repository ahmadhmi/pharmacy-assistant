"use client"
import { Student } from "@/interfaces/student"
import StudentAccordion from "../UI/Grading/StudentAccordion"
import { addBlock } from "../_services/databaseService"
import { Gradesheet } from "@/interfaces/gradesheet"
import { Lab } from "@/interfaces/Lab"

export default function Grading(){

    async function handleAddBlock(){
        await fetch('./api/');
    }

    let studentLab:Lab = {
        id: "11122234513",
        name: "Lab 1",
        gradesheets: [
            {
                id: "13246523",
                studentID: "000888999",
                rx: "13431432135",
                criteria: [
                    {
                        name: "Test 1",
                        pass: true
                    },
                    {
                        name: "Test 2",
                        pass: false,
                    }
                ]
            }
        ]

    }

    return(
        <main className="flex flex-col items-center">
            <div className="">
                <StudentAccordion studentLab={studentLab}></StudentAccordion>
            </div>
        </main>
    )
}