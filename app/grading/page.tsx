"use client"; 
import { Student } from "@/interfaces/student"
import StudentAccordion from "../UI/Grading/StudentAccordion"
import { addBlock } from "../_services/databaseService"
import { Gradesheet } from "@/interfaces/gradesheet"
import { Lab } from "@/interfaces/Lab"
import { useEffect, useState } from "react";

export default function Grading(){

    const [test, setTest] = useState(""); 

    async function testFunc(){
        let res = await fetch(
            "http://localhost:3000/api/blocks/1",
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            );
        
            let js = await res.json();
            console.log(js);
            setTest(js); 
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

    useEffect(
        () => {
            console.log(test);
        },
        [test]
    )

    return(
        <main className="flex flex-col items-center">
            <div className="">
                <StudentAccordion studentLab={studentLab}></StudentAccordion>
                <button onClick={() => testFunc()}>Test</button>
            </div>
        </main>
    )
}