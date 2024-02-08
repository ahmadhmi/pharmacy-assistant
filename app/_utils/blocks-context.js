
"use client"; 
import { useSession } from "next-auth/react";
import React from "react";
import { useContext, useState, useEffect, createContext } from "react";


const BlocksContext = createContext(); 

export default function BlocksContextProvider({children}){

    const {status, data} = useSession(); 
    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState({}); 



    async function getBlocks(){
        let newBlocks = [];

        const response = await fetch(
            "http://localhost:3000/api/blocks/1",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    email : data.user.email
                }
            }
        )
        
        newBlocks = await response.json(); 
        setBlocks(newBlocks); 
    }

    async function addBlock(block){

        const response = await fetch(
            "http://localhost:3000/api/blocks/1",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    }

    useEffect(
        () => {
            getBlocks(); 
        },
        [data?.user]
    )

    return( <BlocksContext.Provider value={{blocks, selectedBlock, setSelectedBlock}}>
        {children}
    </BlocksContext.Provider>)

}

export function useBlocksContext() {
    return useContext(BlocksContext);
}