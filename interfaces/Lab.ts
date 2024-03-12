import { Gradesheet } from "./gradesheet";
import { criteria } from "./criteria";

export interface Lab{
    _id?:string,
    name?:string,
    gradesheets?:Gradesheet[]
    selectedTemplate?:criteria[],
    markingTemplates?: criteria[][],
}