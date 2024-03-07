"use client";
import axios from "axios";
import { Gradesheet } from "@/interfaces/gradesheet";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lab } from "@/interfaces/Lab";
import { VscError, VscLoading } from "react-icons/vsc";

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
            const lab = (
                await axios.get(`/api/blocks/${params.blockId}/${params.labId}`)
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
        let response;
        try {
            response = await axios.post(
                `/api/blocks/${params.blockId}/${params.labId}/grading`,
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
    });

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
                    if(!lab){
                        setError("");
                        router.push(`/home/`);
                    }
                }}
            >
                <div className={`alert hover:alert-warning ${error === "Page is loading..." ? "alert-info" : "alert-error"}`}>
                    {error === "Page is loading..." ? <VscLoading size={30}></VscLoading> : <VscError size={30}></VscError>}
                    <p className="break-words">{error}</p>
                </div>
            </div>
        );
    }
}
