"use client";
import React, { FormEvent, MutableRefObject, useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { Gradesheet } from "@/interfaces/gradesheet";
import { criteria } from "@/interfaces/criteria";
import { setTemplate, updateGradeSheet } from "@/app/_services/databaseService";
import { useRouter } from "next/navigation";
import { VscCheck, VscError, VscLoading, VscVerified } from "react-icons/vsc";
import Link from "next/link";
import { Template } from "@/interfaces/template";
import LabPage from "../../page";

interface Props {
    params: {
        blockId: string;
        weekId: string;
        labId: string;
        gradesheetId: string;
    };
}

export default function Grade({ params }: Props) {
    const router = useRouter();
    const [gradesheet, setGradesheet]: [Gradesheet | undefined, Function] =
        useState();
    const [form, setForm] = useState(0);
    const [template, setTemplate] = useState<Template>();
    const [templateCriteria, setTemplateCriteria] = useState<criteria[]>();
    const [comment, setComment] = useState("");
    const [error, setError] = useState("Page is loading...");
    const [criterionName, setCriterionName] = useState("");
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [pass, setPass] = useState(false);

    async function fetchGradesheet() {
        let response;
        let lab;
        let template; 
        try {
            response = await axios.get(
                `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading/${params.gradesheetId}`
            );
            lab = await axios.get(
                `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}`
            );
            template = await axios.get(`/api/criteria/${lab.data.selectedTemplate}`)

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
            setTemplateCriteria(response.data.criteria);
        }
        if (template?.data) {
            setTemplate(template.data);
            if (response?.data.criteria.length <= 0) {
                setTemplateCriteria(template.data.criteria);
            }
        }
        if (response?.data.score) {
            setScore(response.data.score);
        }
        if (response?.data.maxScore) {
            setMaxScore(response.data.maxScore);
            setForm(1);
        }
        if (response?.data.pass != null) {
            setPass(response.data.pass);
        }
        if (response?.data?.comment) {
            setComment(response.data.comment);
        }
    }

    function updateRadio(selectedCriteria: criteria | undefined) {
        if (selectedCriteria) {
            setTemplateCriteria((prevCriteria) => {
                const newCriteria = prevCriteria?.map((criteriaItem) =>
                    criteriaItem.name === selectedCriteria.name
                        ? { ...criteriaItem, pass: !criteriaItem.pass }
                        : criteriaItem
                );
                return newCriteria;
            });
        }
    }

    function handleOpenAddCriteria() {
        const modal = document.getElementById("add_criteria_modal");
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
    }

    function handleAddCriteria() {
        if (criterionName === "") {
            alert("Please give the new criterion a name");
        } else {
            setTemplateCriteria((prevCriteria) => {
                if (prevCriteria) {
                    return [
                        ...prevCriteria,
                        {
                            name:
                                criterionName[0].toUpperCase() +
                                criterionName.slice(1).toLowerCase(),
                            pass: false,
                        },
                    ];
                }
            });
            setCriterionName("");
        }
    }

    async function saveGradeSheet() {
        let newGradesheet;
        let calcPass = true; 
        let numPass = 0; 
        templateCriteria?.forEach((criterion) => {
            if(criterion.pass){
                numPass += 1; 
            }
        })
        if(template){
            calcPass = numPass >= (template.minimum || 3)
        } 
        templateCriteria?.forEach((criterion) => {
            if(criterion.required){
                if(!criterion.pass){
                    calcPass = false; 
                    console.log(criterion)
                }
            }
        })
        console.log(`Number of criteria passed:${numPass} Min:${template?.minimum} ${calcPass}`)
        if (form == 0) {
            newGradesheet = {
                ...gradesheet,
                criteria: templateCriteria,
                score: null,
                maxScore: null,
                pass: calcPass,
                comment: comment,
            };
        } else {
            newGradesheet = {
                ...gradesheet,
                criteria: null,
                score: score,
                maxScore: maxScore,
                pass: pass,
                comment: comment,
            };
        }

        setGradesheet(newGradesheet);

        if (newGradesheet) {
            const updated = await axios.put(
                `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading/${params.gradesheetId}`,
                newGradesheet
            );
            if (updated) {
                setComment("");
                setTemplateCriteria([]);
                router.push(
                    `/home/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading`
                );
            } else {
                alert("Failed to submit");
            }
        }
    }

    useEffect(() => {
        fetchGradesheet();
    }, []);

    if (gradesheet && template) {
        return (
            <section className="flex flex-col items-center gap-4">
                <div className="">
                    <h2 className="badge w-full p-4 badge-primary rounded-md text-white sm:text-lg">{`Student: ${
                        gradesheet?.studentName || gradesheet?.studentID
                    } — Rx: ${gradesheet?.rx}`}</h2>
                </div>
                <dialog id="add_criteria_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Add Criterion</h3>
                        <form method="dialog">
                            <input
                                type="text"
                                placeholder="Eg. Professionalism"
                                className="input input-md w-full"
                                value={criterionName}
                                onChange={(e) => {
                                    setCriterionName(e.currentTarget.value);
                                }}
                            ></input>
                            <div className="modal-action w-full">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAddCriteria}
                                >
                                    Add
                                </button>
                                <button className="btn btn-error">Close</button>
                            </div>
                        </form>
                    </div>
                </dialog>
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
                        <ul className="flex flex-col items-center min-h-64 max-h-72 px-2 overflow-y-auto list-none scrollbar-thin scrollbar-track scrollbar-thumb-black">
                            {templateCriteria && templateCriteria.length > 0 ? (
                                templateCriteria?.map((criteria: criteria) => (
                                    <li
                                        className="w-full flex flex-row justify-between px-4 py-2 shadow-lg my-2 rounded-lg cursor-pointer hover:bg-neutral"
                                        key={criteria.name}
                                        onClick={() =>
                                            updateRadio(
                                                templateCriteria.find(
                                                    (tempCriteria) =>
                                                        criteria.name ===
                                                        tempCriteria.name
                                                )
                                            )
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base-content text-md">
                                                {criteria.name}
                                            </h2>
                                            {criteria.required ? (
                                                <VscVerified
                                                    size={25}
                                                ></VscVerified>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
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
                            {templateCriteria && templateCriteria.length > 0 ? (
                                <button
                                    className="btn w-full"
                                    onClick={() => {
                                        handleOpenAddCriteria();
                                    }}
                                >
                                    Add Criteria
                                </button>
                            ) : (
                                <></>
                            )}
                        </ul>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text">
                                        Achieved Marks
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    className="input-md max-w-xs rounded-md"
                                    value={score}
                                    onChange={(e) => {
                                        console.log(e.currentTarget.value);
                                        setScore(
                                            parseInt(e.currentTarget.value)
                                        );
                                    }}
                                ></input>
                            </label>
                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text">
                                        Maximum Marks Possible
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    className="input-md max-w-xs rounded-md"
                                    value={maxScore}
                                    onChange={(e) => {
                                        setMaxScore(
                                            parseInt(e.currentTarget.value)
                                        );
                                    }}
                                ></input>
                            </label>
                        </div>
                        <div>
                            <label className="label cursor-pointer flex justify-center gap-4">
                                <span
                                    className={`label-text text-lg p-4 ${
                                        !pass
                                            ? "badge badge-error text-white"
                                            : "badge badge-ghost"
                                    }`}
                                >
                                    Fail
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={pass}
                                    onChange={(e) => setPass(e.target.checked)}
                                />
                                <span
                                    className={`label-text text-lg p-4 ${
                                        pass
                                            ? "badge badge-primary text-white"
                                            : "badge badge-ghost"
                                    }`}
                                >
                                    Pass
                                </span>
                            </label>
                        </div>
                    </div>
                )}
                <textarea
                    className="min-h-40 rounded p-2 w-full"
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
                            `/home/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading`
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
