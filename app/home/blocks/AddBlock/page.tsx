"use client";
import React, { useEffect, useState } from "react";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { Block } from "@/interfaces/block";
import { useSession } from "next-auth/react";
import { VscTrash } from "react-icons/vsc";

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
    setEmails([...emails, email.trim().toLowerCase()]); 
    setEmail("");
  }
  function handleDeleteEmail(email:string){
    setEmails(emails => emails.filter(e => e !== email));
  }

  return (
    <section className="flex flex-col items-center sm:items-start">
      <div className="flex w-full justify-between items-center flex-row">
      <h1 className="text-2xl text-primary p-2 rounded-lg mb-4">Add a Block</h1>
      <button className="btn btn-primary" onClick={handleCreateBlock}>
          Add Block
      </button>
      </div>
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
      <div className="flex flex-col shadow-lg border-t-4 w-full p-2 my-4 min-h-72 max-h-72 gap-2 overflow-y-auto">
        {emails.length > 0? emails.map((email) => {
          return (
          <div key={email} className="flex flex-row justify-between items-center badge badge-primary w-full rounded-md p-4">
            <p className="text-lg">{email}</p>
            <button className="" onClick={ () => handleDeleteEmail(email)}><VscTrash size={20}></VscTrash></button>
          </div>
          )
        })
      :
      <div className="badge badge-primary w-full rounded-md p-4">Add other users by their email</div>}
      </div>
    </section>
  );
}
