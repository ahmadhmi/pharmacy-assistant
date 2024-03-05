import { User } from "next-auth";
import { Week } from "./week";
import { Student } from "./student";

export interface Block{
    _id?:String,
    name?:string,
    weeks?:Week[],
    students?:Student[],
    users:string[],
}