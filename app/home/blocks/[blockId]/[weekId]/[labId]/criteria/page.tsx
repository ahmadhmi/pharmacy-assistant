"use client";
import { Lab } from "@/interfaces/Lab";
import { Block } from "@/interfaces/block";
import { criteria } from "@/interfaces/criteria";
import { Template } from "@/interfaces/template";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VscAdd, VscArrowLeft, VscCheck, VscCircle, VscTrash } from "react-icons/vsc";

interface Props {
    params: {
        blockId: string,
        weekId:string,
        labId: string,
    };
}

export default function Criteria({ params }: Props) {
    const [markingTemplates, setMarkingTemplates] = useState<Template[]>();
    const [selectedTemplate, setSelectedTemplate] = useState<Template>();
    const [lab, setLab] = useState<Lab>();
    const [block, setBlock] = useState<Block>();
    const [templateName, setTemplateName] = useState<string | undefined>("");
    const [templateDesc, setTemplateDesc] = useState<string | undefined>("");
    const [templateCriteria, setTemplateCriteria] = useState<criteria[]>();
    const [error, setError] = useState(""); 
    const [message, setMessage] = useState(""); 

    async function fetchLab() {
        try{
            const retrievedBlock = await axios.get(
                `/api/blocks/${params.blockId}`
            );
            const retrievedLab = await axios.get(`/api/blocks/${params.blockId}/${params.weekId}/${params.labId}`)
            setBlock(retrievedBlock.data);
            setLab(retrievedLab.data); 
            setMarkingTemplates(retrievedBlock.data.markingTemplates);
            setSelectedTemplate(retrievedLab.data.selectedTemplate);
        } catch(error){
            setError("Something went wrong while loading");
            setTimeout(() => setError(""), 4000) 
        }
    }

    async function saveSelection() {
        //save it in the database
        try{
            setMessage("Saving ...")
            await axios.put(`/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/criteria/`, selectedTemplate); 
            setMessage("Successfully set template");
            setTimeout(() => setMessage(""), 4000) 
        } catch(error){
            console.log(error); 
            setError("Something went wrong while updating");
            setTimeout(() => setError(""), 4000) 
        }
    }

    useEffect(() => {
        fetchLab();
    }, []);

    useEffect(() => {
        if (selectedTemplate) {
            setTemplateName(selectedTemplate?.name);
            setTemplateDesc(selectedTemplate?.description);
            setTemplateCriteria(selectedTemplate?.criteria);
        }
    }, [selectedTemplate]);

    if (block && lab) {
        return (
            <section className="p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl">{`Selected template for ${lab.name}`}</h1>
                    <div className="flex items-center gap-2">
                    <Link className="btn" href={`/home/blocks/${params.blockId}/${params.weekId}/${params.labId}`}>
                        <VscArrowLeft></VscArrowLeft>
                        Back
                    </Link>
                    <button
                        className="btn"
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
                                onClick={() => setSelectedTemplate({...template})}
                                className={`text-black card min-w-52 min-h-64 max-h-64 w-60 hover:-translate-y-2 active:bg-gray-500 cursor-pointer shadow-md hover:shadow-xl transition-all duration-150 delay-75 ease-in ${
                                    template.name === selectedTemplate?.name
                                        ? "opacity-70 bg-gray-300 border-4 border-primary"
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
                                            color="green"
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
                            <h1 className="text-2xl">Information</h1>
                            <input
                                type="text"
                                className="input input-md max-w-xs text-white"
                                placeholder="name"
                                value={templateName}
                                disabled={true}
                                onChange={(e) =>
                                    setTemplateName(e.currentTarget.value)
                                }
                            ></input>
                            <textarea
                                className="h-full rounded-xl p-2 text-white"
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
                                    <li className="w-full flex items-center justify-between" key={index}>
                                        <p className="badge p-6 w-full">
                                            {criteria.name}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div onClick={() => setMessage("")} className={`toast ${message === ""? "hidden": ""}`}>
                    <div className="alert alert-info cursor-pointer text-white hover:alert-warning transition-colors duration-100 ease-in-out">
                        {message}
                    </div>
                </div>
                <div onClick={() => setError("")} className={`toast ${error === ""? "hidden": ""}`}>
                    <div className="alert alert-error cursor-pointer text-white hover:alert-warning transition-colors duration-100 ease-in-out">
                        {error}
                    </div>
                </div>
            </section>
        );
    } else {
        return <section className="p-2">
                            <div onClick={() => setMessage("")} className={`toast ${message === ""? "hidden": ""}`}>
                    <div className="alert alert-info cursor-pointer text-white hover:alert-warning transition-colors duration-100 ease-in-out">
                        {message}
                    </div>
                </div>
                <div onClick={() => setError("")} className={`toast ${error === ""? "hidden": ""}`}>
                    <div className="alert alert-error cursor-pointer text-white hover:alert-warning transition-colors duration-100 ease-in-out">
                        {error}
                    </div>
                </div>
        </section>;
    }
}
