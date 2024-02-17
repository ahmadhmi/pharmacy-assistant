import { criteria } from "./criteria";

export interface Gradesheet{
    _id?:string,
    studentID:string,
    rx:String,
    criteria: criteria[]
}