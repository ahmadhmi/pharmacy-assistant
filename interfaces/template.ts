import { criteria } from "./criteria"

export interface Template{
    name:string,
    description?: string, 
    criteria?:criteria[]
}

export const defaultTemplate: Template = {
    name: "Default",
    description: "The default marking template as specified by a physical sample from the pharmacy assistant program",
    criteria:[
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
}