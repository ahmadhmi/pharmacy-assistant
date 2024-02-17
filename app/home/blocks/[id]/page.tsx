import React, { EffectCallback, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Block } from "@/interfaces/block";

interface Props{
    params:{
        id:string
    }
}

export default function BlockPage({params}:Props){

    const [block, setBlock]:[Block | undefined, Function] = useState(); 
    const getBlock = async () => {
        const data = await axios.get(`${process.env.APPLICATION_DOMAIN_URL}/api/blocks/${params.id}`);
        return data.data
    }
    useEffect(
        async () => {
            let block:Block = await getBlock(); 
            setBlock(block); 
        }
    )


    return(
        <section>
            {}
        </section>
    )
}