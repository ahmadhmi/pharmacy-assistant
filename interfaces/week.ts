import { StudentLab } from "./Lab";

export interface Week{
    id?:string,
    name:string,
    labs?:StudentLab[]
}