import { Gradesheet } from "./gradesheet";

export interface Lab{
    id?:string,
    name?:string,
    gradesheets:Gradesheet[]
}