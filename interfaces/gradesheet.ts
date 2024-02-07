import { criteria } from "./criteria";

export interface Gradesheet{
    id?:string,
    studentID:string,
    rx:String,
    criteria: criteria[]
}