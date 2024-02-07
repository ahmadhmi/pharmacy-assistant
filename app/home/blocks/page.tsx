"use client";
import React, { useEffect } from "react";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { Block } from "@/interfaces/block";

export default function Home(){
    const {blocks} = useBlocksContext(); 

    return(
        <div className="text-black">
            {blocks.length > 0? blocks[0].name : "Nothing to show"}
        </div>
    )
}