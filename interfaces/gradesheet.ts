import { criteria } from "./criteria";

export interface Gradesheet{
    _id?:string,
    studentID:string,
    studentName?:string,
    labId?:string, 
    date:Date, 
    rx:String,
    criteria?: criteria[],
    comment?:string,
}