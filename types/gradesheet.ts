export interface Gradesheet{
    id:string,
    rx:String,
    criteria: {
        name:string,
        pass:boolean,
    }
}