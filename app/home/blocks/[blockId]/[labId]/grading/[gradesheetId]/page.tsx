

interface Props{
    params:{
        blockId:string,
        labId:string,
        gradesheetId:string
    }
}

export default function Grade({params}:Props){

    return(
        <section>
            BlockID: {params.blockId} LabId: {params.labId} GradesheetId: {params.gradesheetId}
        </section>
    )
}