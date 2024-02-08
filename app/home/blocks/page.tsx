"use client";
import React, { useEffect } from "react";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { Block } from "@/interfaces/block";

export default function Home(){
    const {blocks} = useBlocksContext(); 

    return(
        <section className="flex flex-col items-center sm:items-start">
        <h1 className="text-2xl text-primary p-2 rounded-lg mb-4">
          Add a Block
        </h1>
        <input
            required
            type="text"
            placeholder="Block Name"
            className="input input-bordered input-primary w-full max-w-xs join-item my-2"
          />
          <button>
            
          </button>
      </section>
    )
}