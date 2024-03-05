
"use client"; 
import axios from 'axios'; 
import { useSession } from "next-auth/react";
import React from "react";
import { useContext, useState, useEffect, createContext } from "react";


const BlocksContext = createContext(); 

export default function BlocksContextProvider({children}){

    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState({}); 
    const {status, data} = useSession(); 



    async function getBlocks(){

        const response = await axios.get("http://localhost:3000/api/blocks/"); 

        let blocks = []
        if(response.data){
            response.data.forEach(element => {
                blocks.push({
                    _id: element._id,
                    name: element.name,
                    weeks: element.weeks,
                    users: element.users
                })
            });
        }
        console.log("Called get block")
        setBlocks(blocks); 
    }

    async function addBlock(block){
        console.log(block); 
        try{
            const response = await axios.post("http://localhost:3000/api/blocks", block); 
            setBlocks([...blocks, response.data]);
        }catch(ex){
            console.log(ex); 
        }

    }

    useEffect(
        () => {
            if(data?.user){
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