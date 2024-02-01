import { Student } from "@/types/student"
import StudentAccordion from "../UI/Grading/StudentAccordion"

let students:Student[] = [
    {
        id: "111222333444555",
        firstName: "Jane",
        lastName: "Doe", 
    }
]

export default function Grading(){


    return(
        <main className="flex justify-center">
            <div className="flex flex-col">
                <StudentAccordion student={students[0]} gradesheets={[]}></StudentAccordion>
            </div>
            
        </main>
    )
}