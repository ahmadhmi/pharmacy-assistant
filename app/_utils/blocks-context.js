
"use client"; 
import { useSession } from "next-auth/react";
import React from "react";
import { useContext, useState, useEffect, createContext } from "react";


const BlocksContext = createContext(); 

export default function BlocksContextProvider({children}){

    const {session, data} = useSession(); 
    const [blocks, setBlocks] = useState([]);



    async function getBlocks(){
        let newBlocks = [];

        const response = await fetch(
            "http://localhost:3000/api/blocks/1",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        
        newBlocks = await response.json(); 
        setBlocks(newBlocks); 
    }

    useEffect(
        () => {
            getBlocks(); 
        },
        [session]
    )

    return( <BlocksContext.Provider value={{blocks}}>
        {children}
    </BlocksContext.Provider>)

}

export function useBlocksContext() {
    return useContext(BlocksContext);
}