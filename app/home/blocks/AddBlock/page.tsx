"use client";
import React, { useEffect, useState } from "react";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { Block } from "@/interfaces/block";
import { useSession } from "next-auth/react";

export default function AddBlock() {
  const [blockName, setBlockName] = useState("");
  const { blocks, addBlock } = useBlocksContext();
  const [email, setEmail] = useState("");
  let temp:string[] = []; 
  const [emails, setEmails] = useState(temp); 

  async function handleCreateBlock() {
    const newBlock: Block = {
      name: blockName,
      users: emails,
    };
    setBlockName("");
    setEmails([]); 
    await addBlock(newBlock);
  }

  function handleAddEmail(){
    setEmails([...emails, email.trim()]); 
    setEmail("");
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
          onChange={(e) => {
            setBlockName(e.currentTarget.value);
          }}
        />
        <button className="btn btn-primary" onClick={handleCreateBlock}>
          Add
        </button>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <input
          required
          type="text"
          placeholder="Assistant Email"
          className="input input-bordered input-primary w-full max-w-xs join-item my-2"
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
        />
        <button className="btn btn-primary" onClick={handleAddEmail}>
          Add
        </button>
      </div>
      <div className="flex flex-col">
        {emails.map((email) => {
          return <div className="">{email}</div>
        })}
      </div>
    </section>
  );
}
