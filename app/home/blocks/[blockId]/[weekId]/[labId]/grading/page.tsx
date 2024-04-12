"use client";
import axios from "axios";
import { Gradesheet } from "@/interfaces/gradesheet";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lab } from "@/interfaces/Lab";
import { VscArrowLeft, VscError, VscLoading } from "react-icons/vsc";
import Link from "next/link";
import { Block } from "@/interfaces/block";
import { Student } from "@/interfaces/student";
import { getBlock } from "@/app/_services/databaseService";
import { defaultTemplate, Template } from "@/interfaces/template";

interface Props {
    params: {
        blockId: string;
        weekId: string;
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
    const [gradesheets, setGradeSheets] = useState<
        Record<string, Gradesheet[]>
    >({});
    const [block, setBlock]: [Block | undefined, Function] = useState();
    const [rx, setRx] = useState("");
    const [error, setError] = useState("Page is loading...");
    const [lab, setLab]: [Lab | undefined, Function] = useState();

    function handleIdInput(id: string) {
        const Numbers = /^[0-9]+$/;
        if (id.match(Numbers)) {
            setId(id);
        }
    }

    async function fetchBlock() {
        try {
            const block = (await axios.get(`/api/blocks/${params.blockId}`))
                .data;
            if (block) {
                setBlock(block);
            }
        } catch (error: any) {
            setError(error.response?.data.error);
        }
    }

    async function fetchLab() {
        try {
            const lab = (
                await axios.get(
                    `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}`
                )
            ).data;
            if (lab) {
                setLab(lab);
            }
        } catch (ex: any) {
            if (ex.response.data.error) {
                setError(ex.response.data.error);
            } else {
                setError("Something went wrong");
            }
        }
    }

    async function fetchGradesheets() {
        try {
            const data = (
                await axios.get(
                    `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading`
                )
            ).data;
            if (data) {
                const result = data.reduce(
                    (
                        groupedGradeSheets: Record<string, Gradesheet[]>,
                        gradeSheet: Gradesheet
                    ) => {
                        const studentID = gradeSheet.studentID;
                        if (groupedGradeSheets[studentID] == null)
                            groupedGradeSheets[studentID] = [];
                        groupedGradeSheets[studentID].push(gradeSheet);
                        return groupedGradeSheets;
                    },
                    {}
                );
                setGradeSheets(result);
            }
        } catch (error: any) {
            setError(error.response?.data.error);
        }
    }

    async function handleStartGrading(e: FormEvent) {
        e.preventDefault();
        const Numbers = /^[0-9]+$/;
        if (!studentId.match(Numbers) || rx.length <= 0) {
            setError(
                "Student ID should all be in numbers and the Rx should not be empty"
            );
            setTimeout(() => setError(""), 4000);
            return;
        }
        const student = block?.students?.find(
            (student: Student) => student._id === studentId
        );
        const studentName = `${student?.firstName} ${student?.lastName}`;
        const newGradesheet: Gradesheet = {
            studentID: studentId,
            studentName: studentName,
            date: new Date(date),
            rx: rx,
        };
        let response;
        try {
            response = await axios.post(
                `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading`,
                newGradesheet
            );
        } catch (ex: any) {
            if (ex.response.data.error) {
                setError(
                    `${ex.response.data.error}: Please go back to the home page and make your way here again.`
                );
            } else {
                setError(
                    `${ex.response.statusText}: Please go back to the home page and make your way here again.`
                );
            }
        }

        if (response?.data) {
            let redirectUrl = `/home/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading/${response.data._id}`;
            router.push(redirectUrl);
        }
    }

    useEffect(() => {
        fetchBlock();
        fetchLab();
        fetchGradesheets();
    }, []);

    if (block && lab) {
        return (
            <section className="flex-col sm:flex-col-reverse items-center">
                <div className="flex items-center justify-between">
                    <div
                        className={`badge badge-primary p-6 text-xl sm:text-3xl font rounded-md text-white ${
                            lab?.name ? "" : "hidden"
                        }`}
                    >
                        {lab?.name ? `Grading: ${lab.name}` : "Grading:"}
                    </div>
                </div>
                <div>
                    <h1 className="text-lg text-primary font-bold mt-4">
                        Completed Marking Sheets
                    </h1>
                </div>
                <div className="overflow-y-auto min-h-96 max-h-96 my-2 px-2 scrollbar-thin scrollbar-thumb-black mb-4 rounded-lg">
                    {gradesheets ? (
                        Object.keys(gradesheets).map((key, index) => (
                            <div
                                className="collapse collapse-arrow my-1 shadow-lg border-2 bg-secondary text-neutral"
                                key={key}
                            >
                                <input
                                    type="checkbox"
                                    name="my-accordion-2"
                                    placeholder="1"
                                />
                                <div className="collapse-title flex justify-between items-center text-xl font-medium">
                                    <h2>
                                        {gradesheets[key][0].studentName} {key}
                                    </h2>
                                    <div className="badge badge-primary text-lg text-neutral">
                                        {gradesheets[key].length}
                                    </div>
                                </div>
                                <div className="collapse-content bg-neutral m-2 rounded-xl">
                                    <div className="flex flex-row items-center justify-between my-2 text-neutral border-b-2">
                                        <div className="text-accent font-bold">
                                            Rx Number
                                        </div>
                                    </div>
                                    {gradesheets ? (
                                        gradesheets[key].map(
                                            (gradesheet, index) => (
                                                <div
                                                    className="flex flex-row items-center justify-between text-neutral py-2 border-b-2 border-slate-400"
                                                    key={index}
                                                >
                                                    <p className="font-bold text-accent">
                                                        {gradesheet.rx}
                                                    </p>
                                                    <div>
                                                        <Link
                                                            className="btn btn-sm btn-primary text-neutral px-12"
                                                            href={`/home/blocks/${params.blockId}/${params.weekId}/${params.labId}/grading/${gradesheet._id}`}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="text-sm text-black">
                                            Wow such empty
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <></>
                    )}
                </div>
                <form
                    className="grid grid-cols-1 grid-rows-2 gap-4 xl:flex items-center bg-white shadow-xl rounded-xl p-2"
                    onSubmit={(e) => handleStartGrading(e)}
                >
                    <div className="flex flex-row gap-4 w-full">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text text-accent font-bold">
                                    Student ID
                                </span>
                            </div>
                            <select
                                defaultValue={"default"}
                                onChange={(e) => setId(e.currentTarget.value)}
                                className="select w-full max-w-xs bg-secondary text-neutral scrollbar-thin scrollbar-thumb-black"
                            >
                                {block?.students?.map((student: Student) => (
                                    <option
                                        key={student._id}
                                        value={student._id}
                                    >{`${student.firstName} ${student.lastName} — ${student._id}`}</option>
                                ))}
                                <option disabled={true} value={"default"}>
                                    Select One
                                </option>
                            </select>
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text text-accent font-bold">
                                    Date
                                </span>
                            </div>
                            <input
                                type="date"
                                className="input-md rounded-md text-neutral bg-secondary"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.currentTarget.value);
                                }}
                            ></input>
                        </label>
                    </div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-accent font-bold">
                                Rx Number
                            </span>
                        </div>
                        <input
                            type="text"
                            placeholder="111222333"
                            maxLength={20}
                            className="input-md rounded-md bg-secondary text-neutral"
                            onChange={(e) => {
                                setRx(e.currentTarget.value);
                            }}
                            value={rx}
                        ></input>
                    </label>
                    <button
                        className="btn btn-primary text-neutral mt-8"
                        type="submit"
                    >
                        Start Grading
                    </button>
                </form>
                {error.length > 0 && error !== "Page is loading..." ? (
                    <div
                        role="alert"
                        className="cursor-pointer"
                        onClick={() => {
                            setError("");
                            router.push(`/home/blocks/${params.blockId}`);
                        }}
                    >
                        <div className="alert alert-error hover:alert-warning">
                            <p className="break-words">{`${error}`}</p>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </section>
        );
    } else {
        return (
            <section>
                <div className="flex items-center justify-between">
                    <div
                        className={`bg-gray-200 p-4 rounded-md w-56 skeleton text-lg`}
                    ></div>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-primary mt-4">
                        Completed Marking Sheets
                    </h1>
                </div>
                <div className="overflow-y-auto min-h-96 max-h-96 my-2 px-2 scrollbar-thin scrollbar-thumb-black mb-4 rounded-lg">
                    <div className="h-20 my-1 shadow-lg rounded-xl bg-gray-200  skeleton"></div>
                    <div className="h-20 my-1 shadow-lg rounded-xl bg-gray-200  skeleton"></div>
                    <div className="h-20 my-1 shadow-lg rounded-xl bg-gray-200  skeleton"></div>
                    <div className="h-20 my-1 shadow-lg rounded-xl bg-gray-200  skeleton"></div>
                </div>
                <form
                    className="grid grid-cols-1 grid-rows-2 gap-4 xl:flex items-center bg-white shadow-xl rounded-xl p-2"
                >
                    <div className="flex flex-row gap-4 w-full">
                        <label className="form-control w-6/12">
                            <div className="label">
                                <span className="label-text text-accent font-bold">
                                    Student ID
                                </span>
                            </div>
                            <input className="input rounded-md bg-gray-200 skeleton" type="text"></input>
                        </label>
                        <label className="form-control w-5/12 sm:w-6/12">
                            <div className="label">
                                <span className="label-text text-accent font-bold">
                                    Date
                                </span>
                            </div>
                            <input className="input rounded-md max-w-xs bg-gray-200 skeleton" type="password"></input>
                        </label>
                    </div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-accent font-bold">
                                Rx Number
                            </span>
                        </div>
                        <input className="input rounded-md bg-gray-200 skeleton" type="text"></input>
                    </label>
                    <div
                        className="btn rounded-md skeleton bg-gray-200 text-neutral mt-8"
                    >
                        Start Grading
                    </div>
                </form>
                {error.length > 0 && error !== "Page is loading..." ? (
                    <div
                        role="alert"
                        className="cursor-pointer"
                        onClick={() => {
                            setError("");
                            router.push(`/home/blocks/${params.blockId}`);
                        }}
                    >
                        <div className="p-4 absolute right-3 bottom-5 bg-error mb-6 rounded-2xl text-neutral hover:alert-warning">
                            <p className="break-words max-w-xs sm:max-w-xl">{`${error}`}</p>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </section>
        );
    }
}
