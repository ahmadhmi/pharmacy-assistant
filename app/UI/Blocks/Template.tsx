"use client";
import { Lab } from "@/interfaces/Lab";
import { Block } from "@/interfaces/block";
import { criteria } from "@/interfaces/criteria";
import { defaultTemplate, Template } from "@/interfaces/template";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { VscAdd, VscArrowLeft, VscCheck, VscCircle, VscTrash } from "react-icons/vsc";

interface Props {
    params: {
        blockId: string,
        weekId:string,
    };
    block?:Block
}

export default function Criteria({ params, block }: Props) {
    const [markingTemplates, setMarkingTemplates] = useState<Template[]>();
    const [selectedTemplate, setSelectedTemplate] = useState<Template>();
    const [templateName, setTemplateName] = useState<string>("");
    const [templateDesc, setTemplateDesc] = useState<string>("");
    const [templateCriteria, setTemplateCriteria]: [
        criteria[] | undefined,
        Function
    ] = useState();
    const [newTemplateName, setNewTemplateName] = useState(""); 
    const [newCriteriaName, setNewCriteriaName] = useState(""); 
    const [toBeDeleted, setToBeDeleted] = useState<Template>(); 
    const [error, setError] = useState(""); 
    const [message, setMessage] = useState(""); 


    function handleOpenAddTemplate(){
        const addTemplateModal = document.getElementById("add_template_modal"); 
        if(addTemplateModal instanceof HTMLDialogElement){
            addTemplateModal.showModal();  
        }
    }

    function handleAddNewTemplate(){
        if(markingTemplates?.find((template:Template) => template.name === newTemplateName)){
            setError("Cannot have two templates with the same name");
            setTimeout(() => setError(""), 4000);
            return;
        }
        const newTemplate:Template = {
            name: newTemplateName,
            description: "",
            criteria: []
        }
        setSelectedTemplate(newTemplate); 
        setMarkingTemplates((prevTemplates) => [...prevTemplates || [], newTemplate])
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
        // console.log("Here at save selection")
        // const newTemplate: Template = {
        //     name: (selectedTemplate?.name && templateName) || "",
        //     description: selectedTemplate?.description && selectedTemplate.description !== ""? new String(selectedTemplate.description).toString() : templateDesc,
        //     criteria: selectedTemplate?.criteria && selectedTemplate.criteria.length > 0? [...selectedTemplate.criteria] : templateCriteria,
        // };
        // await setMarkingTemplates((prevMarkingTemplates: Template[]) => {
        //     if (selectedTemplate) {
        //         const location = prevMarkingTemplates.indexOf(selectedTemplate);
        //         let toBeUpdated = prevMarkingTemplates.find(
        //             (prevTemplate: Template) =>
        //                 prevTemplate.name === selectedTemplate?.name
        //         );
        //         if (toBeUpdated && location >= 0) {
        //             prevMarkingTemplates[location] = newTemplate;
        //         }
        //         return prevMarkingTemplates;
        //     }
        // });
        // await setSelectedTemplate(markingTemplates?.find((template:Template) => template.name == newTemplate.name));
        console.log("Here at save selection: ");
        console.log(markingTemplates);
        if(selectedTemplate){
            selectedTemplate.name = templateName;
            selectedTemplate.description =  templateDesc;
            selectedTemplate.criteria = templateCriteria; 
        }
        //save it in the database
        try{
            setMessage("Saving ...")
            await axios.patch(`/api/blocks/${params.blockId}/criteria`, markingTemplates);
            setMessage("Successfully updated information and selected template");
            setTimeout(() => setMessage(""), 4000) 
        } catch(error){
            console.log(error); 
            setError("Something went wrong while updating");
            setTimeout(() => setError(""), 4000) 
        }
    }

    async function handleDeleteTemplate(){
        if(markingTemplates && markingTemplates?.length <= 1){
            setError("There must be at least one marking template");
            setTimeout(() => setError(""), 4000);
            return; 
        }
        await setMarkingTemplates((prevTemplates) => prevTemplates?.filter((template:Template) => template !== toBeDeleted)); 
        if(selectedTemplate === toBeDeleted && markingTemplates){
            setSelectedTemplate(markingTemplates[0]); 
        }
    } 

    async function handleOpenDeleteTemplateModal(){
        const deleteTemplateModal = document.getElementById("del_template_modal"); 
        if(deleteTemplateModal instanceof HTMLDialogElement){
            deleteTemplateModal.showModal(); 
        }
    }

    useEffect(
        () => {
            setMarkingTemplates(block?.markingTemplates);
        },
        [block]
    )

    useEffect(() => {
        if (selectedTemplate) {
            setTemplateName(selectedTemplate?.name);
            setTemplateDesc(selectedTemplate?.description || "");
            setTemplateCriteria(selectedTemplate?.criteria);
        }
    }, [selectedTemplate]);

    if (block && block.markingTemplates) {
        return (
            <section className="p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">{`Selected template for ${block.name}`}</h1>
                    <div className="flex items-center gap-2">
                    <button
                        className="btn"
                        onClick={() => {
                            saveSelection();
                        }}
                    >
                        Save Templates
                        <VscCheck></VscCheck>
                    </button>
                    </div>
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
                <dialog id="del_template_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete Template: {`${toBeDeleted?.name}`}</h3>
                        <form method="dialog">
                            <div className="modal-action w-full">
                                <button
                                    className="btn btn-error"
                                    onClick={handleDeleteTemplate}
                                >
                                    Delete
                                </button>
                                <button onClick={() => setToBeDeleted(undefined)} className="btn btn-primary">Close</button>
                            </div>
                        </form>
                    </div>
                </dialog>
                    <div className="flex gap-4 justify-start items-center overflow-x-auto scrollbar-track scrollbar-thumb-black scrollbar-thin max-w-screen p-4">
                        {markingTemplates?.map((template) => (
                            <div
                            key={template.name}
                                onClick={() => setSelectedTemplate(template)}
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
                                    <button className="" onClick={() => {handleOpenDeleteTemplateModal(); setToBeDeleted(template);}}>
                                        <VscTrash size={20} color="red"></VscTrash>
                                    </button>
                                    </div>
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
                                disabled={selectedTemplate == null}
                                onChange={(e) =>
                                    setTemplateName(e.currentTarget.value)
                                }
                            ></input>
                            <textarea
                                className="h-full rounded-xl p-2"
                                placeholder="description"
                                value={templateDesc}
                                disabled={selectedTemplate == null}
                                onChange={(e) =>
                                    setTemplateDesc(e.currentTarget.value)
                                }
                            ></textarea>
                        </div>
                        <div className="shadow-xl sm:w-2/4 p-4 max-h-72 rounded-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-black">
                            <ul className="flex flex-col gap-4">
                                {templateCriteria?.map((criteria, index) => (
                                    <li className="w-full flex items-center justify-between join" key={index}>
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
                                <button className="btn" disabled={selectedTemplate === null} onClick={handleOpenAddCriteria}>
                                        <VscAdd size={20}></VscAdd>
                                </button>
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
        return <section className="p-2"></section>;
    }
}
