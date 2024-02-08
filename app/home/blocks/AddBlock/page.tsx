"use client";
import React, { useEffect, useState } from "react";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { Block } from "@/interfaces/block";
import { useSession } from "next-auth/react";

export default function AddBlock() {
  
    const [blockName, setBlockName] = useState("");
    const {blocks, addBlock} = useBlocksContext(); 
    const {data:session} = useSession();  

    async function handleCreateBlock(){
        const newBlock:Block = {
            name:blockName,
            users: [] 
        }
        setBlockName(""); 
        await addBlock(newBlock); 
    }

  return (
    <section className="flex flex-col items-center sm:items-start">
      <h1 className="text-2xl text-primary p-2 rounded-lg mb-4">Add a Block</h1>
      <div className="flex flex-row gap-2 items-center">
        <input
          required
          type="text"
          placeholder="Block Name"
          className="input input-bordered input-primary w-full max-w-xs join-item my-2"
          value={blockName}
          onChange={(e) => {setBlockName(e.currentTarget.value);}}
        />
        <button className="btn btn-primary" onClick={handleCreateBlock}>Add</button>
      </div>
    </section>
  );
}
