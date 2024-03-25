"use client";
import { Lab } from "@/interfaces/Lab";
import { criteria } from "@/interfaces/criteria";
import { Template } from "@/interfaces/template";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VscAdd, VscCheck, VscTrash } from "react-icons/vsc";

interface Props {
    params: {
        blockId: string,
        weekId:string,
        labId: string,
    };
}

export default function Criteria({ params }: Props) {
    const [markingTemplates, setMarkingTemplates]: [
        Template[] | undefined,
        Function
    ] = useState();
    const [selectedTemplate, setSelectedTemplate]: [
        Template | undefined,
        Function
    ] = useState();
    const [lab, setLab]: [Lab | undefined, Function] = useState();
    const [templateName, setTemplateName] = useState<string | undefined>("");
    const [templateDesc, setTemplateDesc] = useState<string | undefined>("");
    const [templateCriteria, setTemplateCriteria]: [
        criteria[] | undefined,
        Function
    ] = useState();
    const [newTemplateName, setNewTemplateName] = useState(""); 
    const [newCriteriaName, setNewCriteriaName] = useState(""); 

    async function fetchLab() {
        const retrievedLab = await axios.get(
            `/api/blocks/${params.blockId}/${params.weekId}/${params.labId}`
        );
        setLab(retrievedLab.data);
        setMarkingTemplates(retrievedLab.data.markingTemplates);
        setSelectedTemplate((retrievedLab.data.markingTemplates.find((template:Template) => template.name === retrievedLab.data.selectedTemplate.name) ));
    }

    function handleOpenAddTemplate(){
        const addTemplateModal = document.getElementById("add_template_modal"); 
        if(addTemplateModal instanceof HTMLDialogElement){
            addTemplateModal.showModal();  
        }
    }

    function handleAddNewTemplate(){
        const newTemplate:Template = {
            name: newTemplateName,
            description: "",
            criteria: []
        }
        setSelectedTemplate(newTemplate); 
        setMarkingTemplates((prevTemplates:Template[]) => [...prevTemplates, newTemplate])
        setNewTemplateName("");
    }

    function handleAddCriteria(){
        const newCriteria:criteria = {
            name: newCriteriaName,
            pass: false
        }
        setTemplateCriteria((prevCriteria:criteria[]) => [...prevCriteria, newCriteria]); 
        setNewCriteriaName(""); 
    }

    function handleOpenAddCriteria(){
        const newCriteriaModal = document.getElementById("add_criteria_modal"); 
        if (newCriteriaModal instanceof HTMLDialogElement){
            newCriteriaModal.showModal(); 
        }
    }

    async function saveSelection() {
        //save template locally
        const newTemplate: Template = {
            name: (selectedTemplate?.name && templateName) || "",
            description: selectedTemplate?.description || templateDesc,
            criteria: selectedTemplate?.criteria && templateCriteria,
        };
        console.log(templateCriteria)
        await setMarkingTemplates((prevMarkingTemplates: Template[]) => {
            if (selectedTemplate) {
                const location = prevMarkingTemplates.indexOf(selectedTemplate);
                let toBeUpdated = prevMarkingTemplates.find(
                    (prevTemplate: Template) =>
                        prevTemplate.name === selectedTemplate?.name
                );
                if (toBeUpdated && location >= 0) {
                    prevMarkingTemplates[location] = newTemplate;
                }
                return prevMarkingTemplates;
            }
        });
        await setSelectedTemplate(() => newTemplate);

        //save it in the database
        try{
            await axios.patch(`/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/criteria/`, markingTemplates);
            await axios.put(`/api/blocks/${params.blockId}/${params.weekId}/${params.labId}/criteria/`, newTemplate); 
        } catch(error){
            console.log(error); 
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

    if (lab) {
        return (
            <section className="p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl">{`Selected template for ${lab.name}`}</h1>
                    <button
                        className="btn"
                        onClick={() => {
                            saveSelection();
                        }}
                    >
                        Save
                    </button>
                </div>
                <div>
                <dialog id="add_template_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Add Template</h3>
                        <form method="dialog">
                            <input
                                type="text"
                                placeholder="Template Name"
                                className="input input-md w-full"
                                value={newTemplateName}
                                onChange={(e) => {
                                    setNewTemplateName(e.currentTarget.value);
                                }}
                            ></input>
                            <div className="modal-action w-full">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAddNewTemplate}
                                >
                                    Add
                                </button>
                                <button className="btn btn-error">Close</button>
                            </div>
                        </form>
                    </div>
                </dialog>
                <dialog id="add_criteria_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Add Criteria</h3>
                        <form method="dialog">
                            <input
                                type="text"
                                placeholder="Eg. Professionalism"
                                className="input input-md w-full"
                                value={newCriteriaName}
                                onChange={(e) => {
                                    setNewCriteriaName(e.currentTarget.value);
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
                    <div className="flex gap-4 justify-start items-center overflow-x-auto max-w-screen p-4">
                        {markingTemplates?.map((template) => (
                            <div
                                onClick={() => setSelectedTemplate(template)}
                                className={`text-black card min-w-52 min-h-64 max-h-64 w-60 hover:-translate-y-2 active:bg-gray-500 cursor-pointer shadow-md hover:shadow-xl transition-all duration-150 delay-75 ease-in ${
                                    template.name === selectedTemplate?.name
                                        ? "opacity-50 bg-gray-300 border-4 border-primary"
                                        : ""
                                }`}
                            >
                                <div className="card-body overflow-auto">
                                    <h2 className="card-title">
                                        {template.name}
                                    </h2>
                                    <p>{template.description}</p>
                                    {selectedTemplate?.name ===
                                    template.name ? (
                                        <VscCheck
                                            size={20}
                                            color="green"
                                        ></VscCheck>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="btn" onClick={handleOpenAddTemplate}>
                            <VscAdd size={20}></VscAdd>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col sm:flex-row gap-4 my-4 sm:h-72">
                        <div className="flex shadow-xl rounded-2xl bg-inherit p-4 flex-col gap-4 sm:w-2/4">
                            <h1 className="text-2xl">Edit Information</h1>
                            <input
                                type="text"
                                className="input input-md max-w-xs"
                                placeholder="name"
                                value={templateName}
                                onChange={(e) =>
                                    setTemplateName(e.currentTarget.value)
                                }
                            ></input>
                            <textarea
                                className="h-full rounded-xl p-2"
                                placeholder="description"
                                value={templateDesc}
                                onChange={(e) =>
                                    setTemplateDesc(e.currentTarget.value)
                                }
                            ></textarea>
                        </div>
                        <div className="shadow-xl sm:w-2/4 p-4 max-h-72 rounded-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-black">
                            <ul className="flex flex-col gap-4">
                                {templateCriteria?.map((criteria) => (
                                    <li className="w-full flex items-center justify-between join">
                                        <p className="badge p-6 join-item w-5/6">
                                            {criteria.name}
                                        </p>
                                        <button
                                            className="join-item btn btn-error w-1/6"
                                            onClick={() => {
                                                setTemplateCriteria(
                                                    (
                                                        prevCriteria: criteria[]
                                                    ) =>
                                                        prevCriteria.filter(
                                                            (
                                                                preCriteria: criteria
                                                            ) =>
                                                                preCriteria !==
                                                                criteria
                                                        )
                                                );
                                            }}
                                        >
                                            <VscTrash size={20}></VscTrash>
                                        </button>
                                    </li>
                                ))}
                                <li className="btn" onClick={handleOpenAddCriteria}>
                                    <VscAdd size={20}></VscAdd>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    } else {
        return <section className="p-2"></section>;
    }
}
