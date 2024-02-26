import { User } from "next-auth";
import { Week } from "./week";

export interface Block{
    _id?:string,
    name?:string,
    weeks?:Week[],
    users:string[],
}