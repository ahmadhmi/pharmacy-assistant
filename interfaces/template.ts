import { criteria } from "./criteria"

export interface Template{
    name:string,
    description?: string, 
    criteria?:criteria[]
}