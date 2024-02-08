
"use client"; 
import { useSession } from "next-auth/react";
import React from "react";
import { useContext, useState, useEffect, createContext } from "react";


const BlocksContext = createContext(); 

export default function BlocksContextProvider({children}){

    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState({}); 
    const {status, data} = useSession(); 



    async function getBlocks(){
        let newBlocks = [];

        const response = await fetch(
            "http://localhost:3000/api/blocks",
            {
                method: "",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        
        newBlocks = await response.json(); 
        setBlocks(newBlocks); 
    }

    async function addBlock(block){

        const response = await fetch(
            "http://localhost:3000/api/blocks/addBlock/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:{
                    block:block
                }
            }
        )
    }

    useEffect(
        () => {
            if(data.user){
                getBlocks()
            }
        },
        [status]
    )


    return( <BlocksContext.Provider value={{blocks, addBlock, selectedBlock, setSelectedBlock}}>
        {children}
    </BlocksContext.Provider>)

}

export function useBlocksContext() {
    return useContext(BlocksContext);
}