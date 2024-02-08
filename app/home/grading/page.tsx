"use client"; 
import { Student } from "@/interfaces/student"
import StudentAccordion from "@/app/UI/Grading/StudentAccordion";
import AddBlock from "../blocks/[id]/editBlock/page";
import { Gradesheet } from "@/interfaces/gradesheet"
import { Lab } from "@/interfaces/Lab"
import { useEffect, useState } from "react";

export default function Grading(){

    const [test, setTest] = useState(""); 

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
                <button onClick={() => testFunc()}>Test</button>
            </div>
        </main>
    )
}