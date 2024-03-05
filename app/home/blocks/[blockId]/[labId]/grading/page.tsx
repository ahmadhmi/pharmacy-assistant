"use client";
import axios from "axios";
import { Gradesheet } from "@/interfaces/gradesheet";
import { FormEvent, useState } from "react";
import { addGradeSheet } from "@/app/_services/databaseService";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { Block } from "@/interfaces/block";
import { useRouter } from "next/navigation";

interface Props {
    params: {
        blockId: string;
        labId: string;
    };
}

export default function Grading({ params }: Props) {
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const router = useRouter(); 
    const [studentId, setId] = useState("");
    const [date, setDate] = useState(formatDate(new Date()));
    const [rx, setRx] = useState("");
    const {blocks}:{blocks:Block[]} = useBlocksContext(); 

    function handleIdInput(id: string) {
        const Numbers = /^[0-9]+$/;
        if (id.match(Numbers)) {
            setId(id);
        }
    }

    async function handleStartGrading(e: FormEvent) {
        e.preventDefault();
        const Numbers = /^[0-9]+$/;
        if (!studentId.match(Numbers)) {
            alert("The studentID should be all in numbers");
            return;
        }
        const newGradesheet: Gradesheet = {
            studentID: studentId,
            date: new Date(date),
            rx: rx,
        };

        const response = await axios.post(`http://localhost:3000/api/blocks/${params.blockId}/${params.labId}/grading`, newGradesheet);
        console.log(response.data)
        if(response.data){
            let redirectUrl = `/home/blocks/${params.blockId}/${params.labId}/grading/${response.data._id}`;
            router.push(redirectUrl); 
        }
    }

    return (
        <section className="flex-col">
            BlockId: {params.blockId} LabId: {params.labId}
            <form
                className="grid grid-cols-1 grid-rows-2 gap-4"
                onSubmit={(e) => handleStartGrading(e)}
            >
                <div className="flex flex-row gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Student ID</span>
                        </div>
                        <input
                            type="text"
                            className="input-md rounded-md"
                            placeholder="000888999"
                            value={studentId}
                            onChange={(e) => {
                                setId(e.currentTarget.value);
                            }}
                        ></input>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Date</span>
                        </div>
                        <input
                            type="date"
                            className="input-md rounded-md"
                            value={date}
                            onChange={(e) => {setDate(e.currentTarget.value);}}
                        ></input>
                    </label>
                </div>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Rx Number</span>
                    </div>
                    <input
                        type="text"
                        placeholder="111222333"
                        className="input-md rounded-md"
                        onChange={(e) => {
                            setRx(e.currentTarget.value);
                        }}
                        value={rx}
                    ></input>
                </label>
                <button className="btn" type="submit">
                    Start Grading
                </button>
            </form>
        </section>
    );
}
