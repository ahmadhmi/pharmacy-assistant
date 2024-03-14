"use client";
import { Lab } from "@/interfaces/Lab";
import { criteria } from "@/interfaces/criteria";
import { Template } from "@/interfaces/template";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VscCheck, VscTrash } from "react-icons/vsc";

interface Props {
    params: {
        blockId: string;
        labId: string;
    };
}

const markingTemplates: criteria[][] = [
    [
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
    ],
    [
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
    ],
];

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
    const [templateName, setTemplateName] = useState("");
    const [templateDesc, setTemplateDesc] = useState("");
    const [templateCriteria, setTemplateCriteria]: [
        criteria[] | undefined,
        Function
    ] = useState();
    async function fetchLab() {
        const retrievedLab = await axios.get(
            `/api/blocks/${params.blockId}/1/${params.labId}`
        );
        setLab(retrievedLab.data);
        setMarkingTemplates(retrievedLab.data.markingTemplates);
        setSelectedTemplate(retrievedLab.data.selectedTemplate);
    }

    async function saveSelection() {
        //save template locally
        const newTemplate: Template = {
            name: (selectedTemplate?.name && templateName) || "",
            description: selectedTemplate?.description && templateDesc,
            criteria: selectedTemplate?.criteria && templateCriteria,
        };
        setMarkingTemplates((prevMarkingTemplates: Template[]) => {
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
        setSelectedTemplate(newTemplate);
    }

    useEffect(() => {
        fetchLab();
    }, []);

    useEffect(() => {
        if (selectedTemplate && selectedTemplate.description) {
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
                    <div className="flex gap-4 justify-start overflow-x-auto max-w-screen p-4">
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
