"use client";
import axios from "axios";
import { Gradesheet } from "@/interfaces/gradesheet";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lab } from "@/interfaces/Lab";
import { VscError, VscLoading } from "react-icons/vsc";
import Link from "next/link";
import { Block } from "@/interfaces/block";
import { Student } from "@/interfaces/student";

interface Props {
    params: {
        blockId: string;
        weekId:string,
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
    const [block, setBlock]:[Block | undefined, Function] = useState(); 
    const [rx, setRx] = useState("");
    const [error, setError] = useState("Page is loading...");
    const [lab, setLab]: [Lab | undefined, Function] = useState();

    function handleIdInput(id: string) {
        const Numbers = /^[0-9]+$/;
        if (id.match(Numbers)) {
            setId(id);
        }
    }

    async function fetchBlock(){
        try{
            const block = (await (axios.get(`/api/blocks/${params.blockId}`))).data; 
            if(block){
                setBlock(block); 
            }
        }catch(error:any){
            setError(error.response.data.error); 
        }
    }

    async function fetchLab() {
        try {
            const lab = (
                await axios.get(`/api/blocks/${params.blockId}/${params.weekId}/${params.labId}`)
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
    }

    async function handleStartGrading(e: FormEvent) {
        e.preventDefault();
        const Numbers = /^[0-9]+$/;
        if (!studentId.match(Numbers)) {
            alert("The studentID should be all in numbers");
            return;
        }
        const student = block?.students?.find((student:Student) => student._id === studentId); 
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
            let redirectUrl = `/home/blocks/${params.blockId}/${params.labId}/grading/${response.data._id}`;
            router.push(redirectUrl);
        }
    }

    useEffect(() => {
        fetchBlock(); 
        fetchLab();
        fetchGradesheets();
    }, []);

    if (lab) {
        return (
            <section className="flex-col items-center">
                <div
                    className={`badge badge-primary p-4 rounded-md text-white text-lg ${
                        lab?.name ? "" : "hidden"
                    }`}
                >
                    {lab?.name ? `Grading: ${lab.name}` : "Grading:"}
                </div>
                <div>
                    <h1 className="text-lg text-neutral mt-4">Completed Marking Sheets</h1>
                </div>
                <div className="overflow-y-auto min-h-64 max-h-72 my-2 px-2 scrollbar-thin scrollbar-track scrollbar-thumb-black mb-4 rounded-lg">
                    {gradesheets ? (
                        Object.keys(gradesheets).map((key, index) => (
                            <div
                                className="collapse collapse-arrow my-1 shadow-lg border-2 border-slate-50"
                                key={key}
                            >
                                <input
                                    type="checkbox"
                                    name="my-accordion-2"
                                    placeholder="1"
                                />
                                <div className="collapse-title flex justify-between items-center text-xl font-medium text-neutral">
                                    <h2>{gradesheets[key][0].studentName} {key}</h2><div className="badge badge-primary text-lg">{gradesheets[key].length}</div>
                                </div>
                                <div className="collapse-content">
                                    <div className="flex flex-row items-center justify-between my-2 text-neutral border-b-2 border-slate-400">
                                        <div>Rx Number</div>
                                    </div>
                                    {gradesheets ? (
                                        gradesheets[key].map(
                                            (gradesheet, index) => (
                                                <div
                                                    className="flex flex-row items-center justify-between text-neutral py-2 border-b-2 border-slate-400"
                                                    key={index}
                                                >
                                                    <p className="font-bold">
                                                        {gradesheet.rx}
                                                    </p>
                                                    <div>
                                                        <Link
                                                            className="btn btn-sm px-12 btn-outline bg-black"
                                                            href={`/home/blocks/${params.blockId}/${params.labId}/grading/${gradesheet._id}`}
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
                    className="grid grid-cols-1 grid-rows-2 gap-4"
                    onSubmit={(e) => handleStartGrading(e)}
                >
                    <div className="flex flex-row gap-4">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Student ID</span>
                            </div>
                            <select
                                defaultValue={"default"}
                                onChange={(e) => setId(e.currentTarget.value)}
                                className="select w-full max-w-xs"
                            >
                                {block?.students?.map((student:Student) => 
                                    <option key={student._id} value={student._id}>{`${student.firstName} ${student.lastName} — ${student._id}`}</option>
                                )}
                                <option disabled={true} value={"default"}>
                                    Select One
                                </option>
                            </select>
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Date</span>
                            </div>
                            <input
                                type="date"
                                className="input-md rounded-md"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.currentTarget.value);
                                }}
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
                {error.length > 0 && error !== "Page is loading..." ? (
                    <div
                        role="alert"
                        className="cursor-pointer"
                        onClick={() => {
                            setError("");
                            router.push("/home/");
                        }}
                    >
                        <div className="alert alert-error hover:alert-warning">
                            <span>{error}</span>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </section>
        );
    } else {
        return (
            <div
                role="alert"
                className="cursor-pointer"
                onClick={() => {
                    if (!lab) {
                        setError("");
                        router.push(`/home/`);
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
