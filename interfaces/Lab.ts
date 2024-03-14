import { Gradesheet } from "./gradesheet";
import { criteria } from "./criteria";
import { Template } from "./template";

export interface Lab{
    _id?:string,
    name?:string,
    selectedTemplate?: Template,
    markingTemplates?: Template[],
}