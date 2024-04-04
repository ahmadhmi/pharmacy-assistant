import { criteria } from "./criteria"

export interface Template{
    _id?:string, 
    name:string,
    user?:string,
    description?: string, 
    minimum?: number, 
    criteria?:criteria[]
}

export const defaultTemplate: Template = {
    name: "Default",
    minimum: 3,
    description: "The default marking template as specified by a physical sample from the pharmacy assistant program",
    criteria:[
        {
            name: "Drug Selected",
            required: true,
            pass: false,
        },
        {
            name: "Patient Profile",
            required: true,
            pass: false,
        },
        {
            name: "Prescriber",
            required: true,
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