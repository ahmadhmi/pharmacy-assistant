"use client";
import React, { FormEvent, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Gradesheet } from "@/interfaces/gradesheet";
import { criteria } from "@/interfaces/criteria";
import { updateGradeSheet } from "@/app/_services/databaseService";
import { useRouter } from "next/navigation";
import { VscCheck, VscError, VscLoading } from "react-icons/vsc";

interface Props {
    params: {
        blockId: string;
        labId: string;
        gradesheetId: string;
    };
}

const defaultCriteria: criteria[] = [
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
];

export default function Grade({ params }: Props) {
    const router = useRouter();
    const [gradesheet, setGradesheet]: [Gradesheet | undefined, Function] =
        useState();
    const [form, setForm] = useState(0);
    const [stateDefaultCriteria, setStateDefaultCriteria] =
        useState(defaultCriteria);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("Page is loading...");

    async function fetchGradesheet() {
        let response;
        try {
            response = await axios.get(
                `/api/blocks/${params.blockId}/${params.labId}/grading/${params.gradesheetId}`
            );
        } catch (ex: any) {
            if (ex.response.data.error) {
                setError(
                    `${ex.response.data.error}: Please go back to the grading page and make your way here again.`
                );
            } else {
                setError(
                    `${ex.response.statusText}: Please go back to the grading page and make your way here again.`
                );
            }
        }

        if (response?.data) {
            setGradesheet(response.data);
        }
        if (response?.data?.criteria) {
            setStateDefaultCriteria(response.data.criteria);
        }
        if (response?.data?.comment) {
            setComment(response.data.comment);
        }
    }

    function updateRadio(selectedCriteria: criteria) {
        setStateDefaultCriteria((prevCriteria) => {
            const newCriteria = prevCriteria.map((criteriaItem) =>
                criteriaItem.name === selectedCriteria.name
                    ? { ...criteriaItem, pass: !criteriaItem.pass }
                    : criteriaItem
            );
            return newCriteria;
        });
    }

    function handleAddCriteria() {}

    function saveGradeSheet() {
        const newGradesheet = {
            ...gradesheet,
            criteria: stateDefaultCriteria,
            comment: comment,
        };
        setGradesheet(newGradesheet);

        if (newGradesheet) {
            const updated = axios.put(
                `/api/blocks/${params.blockId}/${params.labId}/grading/${params.gradesheetId}`,
                newGradesheet
            );
            setComment("");
            setStateDefaultCriteria([]);
            router.push(
                `/home/blocks/${params.blockId}/${params.labId}/grading`
            );
        }
    }

    useEffect(() => {
        fetchGradesheet();
    }, []);

    if (gradesheet) {
        return (
            <section className="flex flex-col items-center gap-4">
                <div className="">
                    <h2 className="badge w-full p-4 badge-primary rounded-md text-white text-lg">{`Student: ${gradesheet?.studentID} — Rx: ${gradesheet?.rx}`}</h2>
                </div>
                <div className="flex flex-row gap-2">
                    <button
                        className={`btn ${
                            form == 0 ? "btn-primary" : "btn-neutral"
                        }`}
                        onClick={() => {
                            setForm(0);
                        }}
                    >
                        Checkbox
                    </button>
                    <button
                        className={`btn ${
                            form == 1 ? "btn-primary" : "btn-neutral"
                        }`}
                        onClick={() => {
                            setForm(1);
                        }}
                    >
                        Direct Input
                    </button>
                </div>
                {form == 0 ? (
                    <div className="flex flex-col gap-4 w-full">
                        <ul className="flex flex-col items-center min-h-64 max-h-64 px-2 overflow-y-auto list-none scrollbar-thin scrollbar-track scrollbar-thumb-black">
                            {stateDefaultCriteria.length > 0 ? (
                                stateDefaultCriteria.map((criteria) => (
                                    <li
                                        className="w-full flex flex-row justify-between px-4 py-2 shadow-lg my-2 rounded-lg cursor-pointer hover:bg-neutral"
                                        key={criteria.name}
                                        onClick={() =>
                                            updateRadio(
                                                stateDefaultCriteria.filter(
                                                    (stateCriteria) =>
                                                        stateCriteria.name ===
                                                        criteria.name
                                                )[0]
                                            )
                                        }
                                    >
                                        <h2 className="text-base-content text-md">
                                            {criteria.name}
                                        </h2>
                                        <input
                                            className="radio radio-primary"
                                            type="radio"
                                            checked={criteria.pass}
                                            onChange={() => null}
                                            title="radio"
                                        ></input>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <VscCheck
                                        size={100}
                                        color="green"
                                    ></VscCheck>
                                    <h2 className="text-lg text-black">
                                        Submitted
                                    </h2>
                                </li>
                            )}
                            {stateDefaultCriteria.length > 0? <button
                                className="btn"
                                onClick={() => {
                                    handleAddCriteria();
                                }}
                            >
                                Add Criteria
                            </button>: <></>}
                        </ul>
                        <textarea
                            className="min-h-40 rounded p-2"
                            placeholder="Comments..."
                            value={comment}
                            onChange={(e) => {
                                setComment(e.currentTarget.value);
                            }}
                        ></textarea>
                        <button
                            className="btn w-full"
                            onClick={() => {
                                saveGradeSheet();
                            }}
                        >
                            Submit
                        </button>
                    </div>
                ) : (
                    <form></form>
                )}
            </section>
        );
    } else {
        return (
            <div
                role="alert"
                className="cursor-pointer"
                onClick={() => {
                    if (!gradesheet) {
                        setError("");
                        router.push(
                            `/home/blocks/${params.blockId}/${params.labId}/grading`
                        );
                    }
                }}
            >
                <div
                    className={`alert hover:alert-warning flex flex-row ${
                        error === "Page is loading..."
                            ? "alert-info"
                            : "alert-error"
                    }`}
                >
                    {error === "Page is loading..." ? (
                        <span className="loading loading-spinner loading-md"></span>
                    ) : (
                        <VscError size={30}></VscError>
                    )}
                    <p className="break-words">{error}</p>
                </div>
            </div>
        );
    }
}
