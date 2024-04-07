"use client";
import { Lab } from "@/interfaces/Lab";
import { Block } from "@/interfaces/block";
import { criteria } from "@/interfaces/criteria";
import { Template } from "@/interfaces/template";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    VscAdd,
    VscArrowLeft,
    VscCheck,
    VscCircle,
    VscEdit,
    VscTrash,
    VscVerified,
} from "react-icons/vsc";

interface Props {
    params: {
        blockId: string;
        weekId: string;
        labId: string;
    };
}

export default function Criteria({ params }: Props) {
    const [markingTemplates, setMarkingTemplates] = useState<Template[]>();
    const [selectedTemplate, setSelectedTemplate] = useState<Template>();
    const [lab, setLab] = useState<Lab>();
    const [templateName, setTemplateName] = useState<string | undefined>("");
    const [templateDesc, setTemplateDesc] = useState<string | undefined>("");
    const [templateCriteria, setTemplateCriteria] = useState<criteria[]>();
    const [templateMin, setTemplateMin] = useState<number>();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function fetchLab() {
        try {
            const templates = await axios.get(`/api/criteria`);
            const retrievedLab = await axios.get(
                `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}`
            );
            setLab(retrievedLab.data);
            setMarkingTemplates(templates.data);
            setSelectedTemplate(
                templates.data.find(
                    (template: Template) =>
                        template._id === retrievedLab.data.selectedTemplate
                )
            );
        } catch (error) {
            setError("Something went wrong while loading");
            setTimeout(() => setError(""), 4000);
        }
    }

    async function saveSelection() {
        //save it in the database
        try {
            if (selectedTemplate?._id) {
                setMessage("Saving ...");
                await axios.put(
                    `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/criteria`,
                    { id: selectedTemplate._id }
                );
                setMessage("Successfully set template");
                setTimeout(() => setMessage(""), 4000);
            }
        } catch (error) {
            console.log(error);
            setMessage("");
            setError("Something went wrong while updating");
            setTimeout(() => setError(""), 4000);
        }
    }

    useEffect(() => {
        fetchLab();
    }, []);

    useEffect(() => {
        if (selectedTemplate) {
            setTemplateName(selectedTemplate?.name);
            setTemplateDesc(selectedTemplate?.description);
            setTemplateMin(selectedTemplate.minimum);
            setTemplateCriteria(selectedTemplate?.criteria);
        } else {
            setTemplateName("");
            setTemplateDesc("");
            setTemplateMin(undefined);
            setTemplateCriteria(undefined);
        }
    }, [selectedTemplate]);

    if (markingTemplates) {
        return (
            <section className="p-4 bg-neutral">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <h1 className="sm:text-xl text-md badge rounded-md p-4 bg-primary text-neutral">{`Selected template for ${lab?.name}`}</h1>
                    <div className="flex sm:items-center gap-2">
                        <Link
                            className="btn btn-secondary text-neutral"
                            href={`/home/blocks/${params.blockId}/${params.weekId}/${params.labId}`}
                        >
                            <VscArrowLeft></VscArrowLeft>
                            Back
                        </Link>
                        <Link className="btn btn-secondary text-neutral" href={`/home/template`}>
                            <VscEdit></VscEdit>
                            Edit
                        </Link>
                        <button
                            className="btn btn-secondary text-neutral"
                            onClick={() => {
                                saveSelection();
                            }}
                        >
                            Save
                            <VscCheck></VscCheck>
                        </button>
                    </div>
                </div>
                <div>
                    <div className="flex gap-4 justify-start items-center overflow-x-auto scrollbar-track scrollbar-thumb-black scrollbar-thin max-w-screen p-4">
                        {markingTemplates?.map((template) => (
                            <div
                                key={template.name}
                                onClick={() =>
                                    setSelectedTemplate({ ...template })
                                }
                                className={`text-neutral bg-primary card min-w-52 min-h-64 max-h-64 w-60 hover:-translate-y-2 active:bg-gray-500 cursor-pointer shadow-md hover:shadow-xl transition-all duration-150 delay-75 ease-in ${
                                    template.name === selectedTemplate?.name
                                        ? "opacity-70 bg-accent border-4 border-primary"
                                        : ""
                                }`}
                            >
                                <div className="card-body overflow-auto scrollbar-thumb-black scrollbar-thin">
                                    <h2 className="card-title">
                                        {template.name}
                                    </h2>
                                    <p className="">{template.description}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        {selectedTemplate?.name ===
                                        template.name ? (
                                            <VscCheck
                                                size={20}
                                                color="white"
                                            ></VscCheck>
                                        ) : (
                                            <VscCircle size={20}></VscCircle>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex flex-col sm:flex-row gap-4 my-4 sm:h-72">
                        <div className="flex shadow-xl rounded-2xl bg-inherit p-4 flex-col gap-4 sm:w-2/4">
                            <h1 className="text-2xl text-primary font-bold">Information</h1>
                            <div
                                className="input input-md max-w-xs bg-secondary text-neutral"
                            >{templateName || "Default"}</div>
                            <div
                                className="input input-md max-w-xs bg-secondary text-neutral"
                            >{templateMin || "eg. Minimum of 5"}</div>
                            <textarea
                                className="h-full rounded-xl p-2 text-neutral bg-secondary"
                                placeholder="description"
                                value={templateDesc}
                                disabled={true}
                                onChange={(e) =>
                                    setTemplateDesc(e.currentTarget.value)
                                }
                            ></textarea>
                        </div>
                        <div className="shadow-xl sm:w-2/4 p-4 max-h-72 rounded-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-black">
                            <ul className="flex flex-col gap-4">
                                {templateCriteria?.map((criteria, index) => (
                                    <li
                                        className="w-full flex items-center justify-between"
                                        key={index}
                                    >
                                        <div className="rounded-xl text-neutral bg-secondary flex items-center justify-between p-4 w-full">
                                            <p>{criteria.name}</p>
                                            {criteria.required ? (
                                                <VscVerified
                                                    size={25}
                                                ></VscVerified>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => setMessage("")}
                    className={`toast ${message === "" ? "hidden" : ""}`}
                >
                    <div className="alert bg-secondary cursor-pointer text-neutral hover:alert-warning transition-colors duration-100 ease-in-out">
                        {message}
                    </div>
                </div>
                <div
                    onClick={() => setError("")}
                    className={`toast ${error === "" ? "hidden" : ""}`}
                >
                    <div className="alert alert-error cursor-pointer text-neutral hover:alert-warning transition-colors duration-100 ease-in-out">
                        {error}
                    </div>
                </div>
            </section>
        );
    } else {
        return (
            <section className="p-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <h1 className="sm:text-3xl text-2xl skeleton h-8 w-56 bg-gray-200"></h1>
                </div>
                <div>
                    <div className="flex gap-4 justify-start items-center overflow-x-auto scrollbar-track scrollbar-thumb-black scrollbar-thin max-w-screen p-4">
                        <div
                            className={`card min-w-52 min-h-64 max-h-64 w-60 skeleton bg-gray-200`}
                        >
                            <div className="card-body overflow-auto scrollbar-thumb-black scrollbar-thin"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col sm:flex-row gap-4 my-4 sm:h-72">
                        <div className="flex shadow-xl rounded-2xl bg-inherit p-4 flex-col gap-4 sm:w-2/4">
                            <h1 className="text-2xl font-bold text-primary">Information</h1>
                            <input className="input max-w-xs skeleton bg-gray-200 rounded-md"></input>
                            <input className="input max-w-xs skeleton bg-gray-200 rounded-md"></input>
                            <textarea className="h-60 rounded-md skeleton bg-gray-200"></textarea>
                        </div>
                        <div className="shadow-xl sm:w-2/4 p-4 max-h-72 rounded-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-black">
                            <ul className="flex flex-col gap-4">
                                <li className="w-full flex items-center justify-between">
                                    <div className="flex items-center justify-between p-6 w-full skeleton bg-gray-200"></div>
                                </li>
                                <li className="w-full flex items-center justify-between">
                                    <div className="flex items-center justify-between p-6 w-full skeleton bg-gray-200"></div>
                                </li>
                                <li className="w-full flex items-center justify-between">
                                    <div className="flex items-center justify-between p-6 w-full skeleton bg-gray-200"></div>
                                </li>
                                <li className="w-full flex items-center justify-between">
                                    <div className="flex items-center justify-between p-6 w-full skeleton bg-gray-200"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => setMessage("")}
                    className={`toast ${message === "" ? "hidden" : ""}`}
                >
                    <div className="alert bg-secondary cursor-pointer text-neutral hover:alert-warning transition-colors duration-100 ease-in-out">
                        {message}
                    </div>
                </div>
                <div
                    onClick={() => setError("")}
                    className={`toast ${error === "" ? "hidden" : ""}`}
                >
                    <div className="alert alert-error cursor-pointer text-neutral hover:alert-warning transition-colors duration-100 ease-in-out">
                        {error}
                    </div>
                </div>
            </section>
        );
    }
}
