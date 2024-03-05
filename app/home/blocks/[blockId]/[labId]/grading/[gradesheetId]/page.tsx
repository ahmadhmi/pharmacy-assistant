"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Gradesheet } from "@/interfaces/gradesheet";
import { criteria } from "@/interfaces/criteria";

interface Props {
    params: {
        blockId: string;
        labId: string;
        gradesheetId: string;
    };
}

export default function Grade({ params }: Props) {
    const [gradesheet, setGradesheet]: [Gradesheet | undefined, Function] =
        useState();
    const [form, setForm] = useState(0);

    async function fetchGradesheet() {
        const response = await axios.get(
            `http://localhost:3000/api/blocks/${params.blockId}/${params.labId}/grading/${params.gradesheetId}`
        );
        if (response.data) {
            setGradesheet(response.data);
        }
    }

    useEffect(() => {
        fetchGradesheet();
    }, []);

    return (
        <section className="flex flex-col items-center">
            <div className="">
                <h2 className="text-black">{gradesheet?.studentID}</h2>
            </div>
            <div className="flex flex-row gap-2">
                <button
                    className="btn"
                    onClick={() => {
                        setForm(0);
                    }}
                >
                    Checkbox
                </button>
                <button className="btn" onClick={() => {setForm(1)}}>Direct Input</button>
            </div>
            {form == 0 ? (
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col items-center max-h-56 overflow-y-scroll">
                        {gradesheet?.criteria?.map((criteria:criteria) => <li key={criteria.name} className="flex flex-row justify-center items-center">
                            <h3>{criteria.name}</h3>
                            <input type="radio"></input>
                        </li>)}
                    </div>
                    <textarea></textarea>
                    <button className="btn">Submit</button>
                </form>
            ) : (
                <form></form>
            )}
        </section>
    );
}
