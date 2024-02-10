
interface Props{
    params:{
        id:string
    }
}

export default function BlockPage({params}:Props){
    return(
        <section>
            {"Block: " + params.id}
        </section>
    )
}