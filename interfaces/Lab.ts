import { Gradesheet } from "./gradesheet";

export interface Lab{
    _id?:string,
    name?:string,
    gradesheets:Gradesheet[]
}