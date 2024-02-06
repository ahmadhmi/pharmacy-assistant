import { User } from "next-auth";
import { Week } from "./week";

export interface Block{
    id?:string,
    name?:string,
    weeks?:Week[],
    users:string,
}