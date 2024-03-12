"use client"; 
import { criteria } from "@/interfaces/criteria";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props{
    params:{
        blockId:string,
        labId:string
    }
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
    ]
    
];

export default function Criteria({params}:Props){

    const [selectedCriteria, setSelectedCriteria] = useState()

    async function fetchTemplates(){

    }

    useEffect(
        () => {
            fetchTemplates;
        },
        []
    )


    return(
        <section className="p-2">
            <h1 className="text-3xl">Criteria</h1>
            <div>
                <div className="flex gap-4 items-center justify-start overflow-x-auto w-screen p-4">
                    <div className="card w-60 hover:-translate-y-2 active:bg-gray-500 cursor-pointer shadow-md hover:shadow-xl transition-all duration-150 delay-75 ease-in">
                        <div className="card-body">
                            <h2 className="card-title">Default</h2>
                            <p className="disabled">The default template as specified by the Pharmacy assistant grading program marking sheet</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}