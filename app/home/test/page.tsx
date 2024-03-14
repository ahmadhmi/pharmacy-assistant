"use client"; 
import { getAllBlocks } from "@/app/_services/databaseService"
import { Block } from "@/interfaces/block";
import { useEffect, useState } from "react"

export default function Page(){
    const [blocks, setBlocks]:[Block[] | undefined, Function] = useState(); 

    async function fetchBlocks(){
        const blocks = await getAllBlocks("johndao789@gmail.com");
        setBlocks(blocks); 
    }

    useEffect(
        () => {fetchBlocks()},
        []
    )

    return(
        <section>{blocks?.map((block) => <li>{block.name}</li>)}</section>
    )
}