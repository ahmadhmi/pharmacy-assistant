"use client"; 
import React from "react";
import { Block } from "@/interfaces/block";
import BlockButton from "../../UI/Blocks/BlockButton";
import CreateBlock from "@/app/UI/Blocks/CreateBlock";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { useSession } from "next-auth/react";
import { LabData } from "@/types/LabData";

export default function AddBlock(){

  const {blocks, selectedBlock} = useBlocksContext(); 

  const Data: LabData[] = [
    {
      student: "Qiaomu Lei",
      RxNum: ["123131", "132131", "123131"],
    },
    {
      student: "john Dao",
      RxNum: ["123123123"],
    },
    {
      student: "john Dao",
      RxNum: ["123123123"],
    },
  ];

  if(!(blocks.length <= 0)){
    return (
      <section className="flex flex-col items-center sm:items-start">
      <h1 className="text-2xl text-primary p-2 rounded-lg mb-4">Add a Block</h1>
      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full max-w-xs border-gray-300 shadow-xl"
      />
      <div className="flex flex-row items-center w-full my-4">
        <hr className="border-black w-6/12"/>
        <p className="text-black mx-2">Or</p>
        <hr className="border-black w-6/12"></hr>
      </div>
      <form className="flex flex-col sm:flex-row gap-2 sm:join border-b-2 border-gray-300 p-4 shadow-xl w-full">
        <input
          type="text"
          placeholder="First Name"
          className="input input-bordered input-primary w-full max-w-xs join-item"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="input input-bordered input-primary w-full max-w-xs join-item"
        />
        <input
          type="text"
          placeholder="Student ID"
          className="input input-bordered input-primary w-full max-w-xs join-item"
        />
        <button className="btn btn-primary join-item">Add students</button>
      </form>

      <div className="w-full mt-6">
      {Data.map((item, index) => (
          <div className="collapse collapse-arrow bg-base-200 my-3" key={index}>
            <input type="checkbox" name="my-accordion-2" placeholder="1" />
            <div className="collapse-title text-xl font-medium">
              {item.student}
            </div>
            <div className="collapse-content">
              {item.RxNum.map((items, index) => (
                <p key={index}>{items}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>)
  }
  else{
    return(
      <p>Select a block to continue</p>
    )
  }
};

