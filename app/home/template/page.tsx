"use client";
import { Lab } from "@/interfaces/Lab";
import { Block } from "@/interfaces/block";
import { criteria } from "@/interfaces/criteria";
import { defaultTemplate, Template } from "@/interfaces/template";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import {
    VscAdd,
    VscArrowLeft,
    VscCheck,
    VscCircle,
    VscTrash,
    VscVerified,
} from "react-icons/vsc";
import { cursorTo } from "readline";

interface Props {
    params: {
        blockId: string;
        weekId: string;
    };
}

export default function Criteria({ params }: Props) {
    const [markingTemplates, setMarkingTemplates] = useState<Template[]>();
    const [selectedTemplate, setSelectedTemplate] = useState<Template>();
    const [templateName, setTemplateName] = useState<string>("");
    const [templateDesc, setTemplateDesc] = useState<string>("");
    const [templateCriteria, setTemplateCriteria]: [
        criteria[] | undefined,
        Function
    ] = useState();
    const [templateMin, setTemplateMin] = useState<number>();
    const [newTemplateName, setNewTemplateName] = useState("");
    const [newCriteriaName, setNewCriteriaName] = useState("");
    const [newCriteriaReq, setNewCriteriaReq] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState<Template>();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function fetchTemplates() {
        try {
            const templates = (await axios.get(`/api/criteria`)).data;
            setMarkingTemplates(templates);
        } catch (error: any) {
            console.log(error);
            setError(error.response.data.error);
            setTimeout(() => setError(""), 4000);
        }
    }

    function handleOpenAddTemplate() {
        const addTemplateModal = document.getElementById("add_template_modal");
        if (addTemplateModal instanceof HTMLDialogElement) {
            addTemplateModal.showModal();
        }
    }

    function handleAddNewTemplate() {
        if (
            markingTemplates?.find(
                (template: Template) => template.name === newTemplateName
            )
        ) {
            setError("Cannot have two templates with the same name");
            setTimeout(() => setError(""), 4000);
            return;
        }
        const newTemplate: Template = {
            name: newTemplateName,
            description: "",
            criteria: [],
        };
        setSelectedTemplate(newTemplate);
        setMarkingTemplates((prevTemplates) => [
            ...(prevTemplates || []),
            newTemplate,
        ]);
        setNewTemplateName("");
    }

    function handleAddCriteria() {
        const newCriteria: criteria = {
            name: newCriteriaName,
            required: newCriteriaReq,
            pass: false,
        };
        setTemplateCriteria((prevCriteria: criteria[]) => [
            ...prevCriteria,
            newCriteria,
        ]);
        setNewCriteriaName("");
    }

    function handleOpenAddCriteria() {
        const newCriteriaModal = document.getElementById("add_criteria_modal");
        if (newCriteriaModal instanceof HTMLDialogElement) {
            newCriteriaModal.showModal();
        }
    }

    async function handleAddDefaultTemplate() {
        const newTemplate = { ...defaultTemplate };
        setMarkingTemplates((prevTemplates) => [
            ...prevTemplates!,
            newTemplate,
        ]);
        setSelectedTemplate(newTemplate);
    }

    async function saveSelection() {
        const updatedTemplate = {
            ...selectedTemplate,
            name: templateName,
            description: templateDesc,
            minimum: templateMin,
            criteria: templateCriteria,
        };
        if (selectedTemplate) {
            selectedTemplate.name = templateName;
            selectedTemplate.description = templateDesc;
            selectedTemplate.minimum = templateMin;
            selectedTemplate.criteria = templateCriteria;
        }
        //save it in the database
        try {
            if (selectedTemplate?._id) {
                setMessage("Saving ...");
                await axios.patch(`/api/criteria`, updatedTemplate);
                setMessage(
                    "Successfully updated information and selected template"
                );
                setTimeout(() => setMessage(""), 4000);
            } else {
                setMessage("Saving ...");
                const newId = await axios.post(
                    `/api/criteria`,
                    updatedTemplate
                );
                if (selectedTemplate) {
                    selectedTemplate._id = newId.data;
                }
                setMessage(
                    "Successfully updated information and selected template"
                );
                setTimeout(() => setMessage(""), 4000);
            }
        } catch (error) {
            setMessage("");
            console.log(error);
            setError("Something went wrong while updating");
            setTimeout(() => setError(""), 4000);
        } finally {
            setSelectedTemplate(undefined);
        }
    }

    async function handleDeleteTemplate(toBeDeleted: Template | undefined) {
        if (markingTemplates && markingTemplates?.length <= 1) {
            setError("There must be at least one marking template");
            setTimeout(() => setError(""), 4000);
            return;
        }
        await setMarkingTemplates((prevTemplates) =>
            prevTemplates?.filter(
                (template: Template) => template !== toBeDeleted
            )
        );
        if (selectedTemplate === toBeDeleted && markingTemplates) {
            setSelectedTemplate(markingTemplates[0]);
        }
        if(toBeDeleted?._id){
            try {
                const success = (
                    await axios.delete(`/api/criteria/${toBeDeleted?._id}`)
                ).data;
            } catch (error: any) {
                console.log(error);
                setError(error.response.data.error);
                setTimeout(() => setError(""), 4000);
            }
        }
    }

    async function handleOpenDeleteTemplateModal() {
        const deleteTemplateModal =
            document.getElementById("del_template_modal");
        if (deleteTemplateModal instanceof HTMLDialogElement) {
            deleteTemplateModal.showModal();
        }
    }

    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        if (selectedTemplate) {
            setTemplateName(selectedTemplate?.name);
            setTemplateDesc(selectedTemplate?.description || "");
            setTemplateMin(selectedTemplate.minimum || 0);
            setTemplateCriteria(selectedTemplate?.criteria);
        }
    }, [selectedTemplate]);

    if (markingTemplates) {
        return (
            <section className="p-4 bg-neutral">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold badge badge-primary rounded-md p-4 text-neutral">Templates</h1>
                    <div className="flex items-center gap-2 text-neutral">
                        <button
                            disabled={selectedTemplate == undefined}
                            className="btn btn-secondary text-neutral"
                            onClick={() => {
                                saveSelection();
                            }}
                        >
                            Save: {selectedTemplate?.name}
                            <VscCheck></VscCheck>
                        </button>
                    </div>
                </div>
                <div>
                    <dialog id="add_template_modal" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg text-primary">Add Template</h3>
                            <form method="dialog">
                                <input
                                    type="text"
                                    placeholder="Template Name"
                                    className="input input-md w-full bg-secondary text-neutral"
                                    value={newTemplateName}
                                    onChange={(e) => {
                                        setNewTemplateName(
                                            e.currentTarget.value
                                        );
                                    }}
                                ></input>
                                <div className="modal-action w-full">
                                    <button
                                        className="btn btn-secondary text-neutral"
                                        onClick={handleAddNewTemplate}
                                    >
                                        Add
                                    </button>
                                    <button className="btn btn-error text-neutral">
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                    <dialog id="add_criteria_modal" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg text-primary">Add Criteria</h3>
                            <form method="dialog">
                                <input
                                    type="text"
                                    placeholder="Eg. Professionalism"
                                    className="input input-md w-full bg-secondary text-neutral"
                                    value={newCriteriaName}
                                    onChange={(e) => {
                                        setNewCriteriaName(
                                            e.currentTarget.value
                                        );
                                    }}
                                ></input>
                                <div className="flex gap-4 mt-2 px-4">
                                    <h4 className="text-sm font-bold text-primary">
                                        Required to pass?:
                                    </h4>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-secondary"
                                        checked={newCriteriaReq}
                                        onChange={(e) => {
                                            setNewCriteriaReq(e.target.checked);
                                        }}
                                    ></input>
                                </div>
                                <div className="modal-action w-full">
                                    <button
                                        className="btn btn-secondary text-neutral"
                                        onClick={handleAddCriteria}
                                    >
                                        Add
                                    </button>
                                    <button className="btn btn-error text-neutral">
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                    <dialog id="del_template_modal" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg text-primary">
                                Delete Template: {`${toBeDeleted?.name}`}
                            </h3>
                            <form method="dialog">
                                <div className="modal-action w-full">
                                    <button
                                        className="btn btn-error text-neutral"
                                        onClick={() =>
                                            handleDeleteTemplate(toBeDeleted)
                                        }
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() =>
                                            setToBeDeleted(undefined)
                                        }
                                        className="btn btn-secondary text-neutral"
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                    <div className="flex gap-4 justify-start items-center overflow-x-auto min-h-64 scrollbar-track scrollbar-thumb-black scrollbar-thin max-w-screen p-4">
                        {markingTemplates?.map((template) => (
                            <div
                                key={template.name}
                                onClick={() => setSelectedTemplate(template)}
                                className={`text-neutral card bg-primary min-w-52 min-h-64 max-h-64 w-60 hover:-translate-y-2 active:bg-gray-500 cursor-pointer shadow-md hover:shadow-xl transition-all duration-150 delay-75 ease-in ${
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
                                                size={25}
                                                color="white"
                                            ></VscCheck>
                                        ) : (
                                            <VscCircle size={25}></VscCircle>
                                        )}
                                        <button
                                            className=""
                                            onClick={() => {
                                                handleOpenDeleteTemplateModal();
                                                setToBeDeleted(template);
                                            }}
                                        >
                                            <VscTrash
                                                size={20}
                                                color="red"
                                            ></VscTrash>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="dropdown dropdown-hover dropdown-right">
                            <div tabIndex={0} role="button" className="btn m-1 btn-secondary text-neutral">
                                <VscAdd size={20}></VscAdd>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 w-52 hover:cursor-pointer join join-vertical rounded-md"
                            >
                                <li>
                                    <button
                                        className="btn btn-sm btn-secondary join-item"
                                        onClick={handleOpenAddTemplate}
                                    >
                                        Add Template
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="btn btn-sm btn-secondary join-item"
                                        disabled={
                                            markingTemplates?.find(
                                                (template) =>
                                                    template.name === "Default"
                                            )
                                                ? true
                                                : false
                                        }
                                        onClick={handleAddDefaultTemplate}
                                    >
                                        Add Default Template
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col sm:flex-row gap-4 my-4 sm:h-72">
                        <div className="flex shadow-xl rounded-2xl bg-inherit p-4 flex-col gap-4 sm:w-2/4">
                            <h1 className="text-2xl font-bold text-primary">Edit Information</h1>
                            <input
                                type="text"
                                className="input input-md max-w-xs bg-secondary text-neutral text-lg"
                                placeholder="name"
                                value={templateName}
                                disabled={selectedTemplate == null}
                                onChange={(e) =>
                                    setTemplateName(e.currentTarget.value)
                                }
                            ></input>
                            <input
                                type="number"
                                placeholder="Minimum required eg. 5"
                                className="input input-md max-w-xs bg-secondary text-neutral text-lg"
                                disabled={selectedTemplate == null}
                                value={templateMin}
                                onChange={(e) =>
                                    setTemplateMin(
                                        Math.abs(
                                            parseInt(e.currentTarget.value)
                                        )
                                    )
                                }
                            ></input>
                            <textarea
                                className="h-full rounded-xl p-2 bg-secondary text-neutral text-md"
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
                                    <li
                                        className="w-full flex items-center justify-between join text-neutral"
                                        key={index}
                                    >
                                        <div className="bg-secondary badge gap-4 rounded-xl p-6 join-item w-5/6">
                                            <p className="text-lg">{criteria.name}</p>
                                            {criteria.required ? (
                                                <VscVerified
                                                    size={25}
                                                ></VscVerified>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
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
                                <button
                                    className="btn btn-secondary text-neutral"
                                    disabled={selectedTemplate === null}
                                    onClick={handleOpenAddCriteria}
                                >
                                    <VscAdd size={25}></VscAdd>
                                </button>
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
                    <div className="alert alert-info cursor-pointer text-white hover:alert-warning transition-colors duration-100 ease-in-out">
                        {message}
                    </div>
                </div>
                <div
                    onClick={() => setError("")}
                    className={`toast ${error === "" ? "hidden" : ""}`}
                >
                    <div className="alert alert-error cursor-pointer text-white hover:alert-warning transition-colors duration-100 ease-in-out">
                        {error}
                    </div>
                </div>
            </section>
        );
    }
}
