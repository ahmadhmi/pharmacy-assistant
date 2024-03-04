"use client";
"use client";

import { Block } from "@/interfaces/block";
import { Week } from "@/interfaces/week";
import axios from "axios";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";

interface Props{
    params:{
        blockId:string
    }
}

export default function BlockPage({params}:Props){


    const [block, setBlock] = useState<Block>();

    const fetchBlock = async () => {
        const block = await axios.get<Block>(`/api/blocks/${params.blockId}`);
        setBlock(block.data);
    };

    useEffect(() => {
        // fetch block
        fetchBlock();
    }, [params.blockId]);

    
      const handleAddWeek = (event: FormEvent) => {
        
        event.preventDefault();
      };
      return (
        <div className="flex justify-center items-start text-slate-100 mt-10">
          <div className="card border justify-center shadow-xl w-full">
            <div className="card-body gap-5">
              <div className="flex items-center justify-between p-4">
                <h2 className="text-slate-600 text-2xl flex-grow text-center">
                  {block?.name}
                </h2>
                <div className="dropdown dropdown-hover">
                  <div tabIndex={0} role="button" className="btn btn-primary m-1">
                    <CiEdit size={20} />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 hover:cursor-pointer"
                  >
                    <li>
                      <a
                        onClick={() =>
                          (
                            document.getElementById(
                              "create_week_modal"
                            ) as HTMLDialogElement
                          )?.showModal()
                        }
                      >
                        Add Week
                      </a>
                    </li>
                  </ul>
                </div>
                <button
                  className="btn btn-primary md:hidden"
                  onClick={() =>
                    (
                      document.getElementById(
                        "create_week_modal"
                      ) as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  Create Week
                </button>
              </div>
              <hr />
              <div className=" grid grid-cols-1 gap-5 lg:gap-20 w-full">
                {(!block?.weeks || block.weeks.length == 0) ? (
                  <p className="text-slate-800">
                    No weeks available currently.
                    <button
                      className="btn btn-primary ml-4"
                      onClick={() =>
                        (
                          document.getElementById(
                            "create_week_modal"
                          ) as HTMLDialogElement
                        )?.showModal()
                      }
                    >
                      Create Week
                    </button>
                    <dialog id="create_week_modal" className="modal">
                      <div className="modal-box text-white">
                        <form method="dialog">
                          {/* if there is a button in form, it will close the modal */}
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <h3 className="font-bold text-lg">
                          Enter the name of the week:
                        </h3>
                        <form
                          onSubmit={handleAddWeek}
                          className="py-4 flex justify-between gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Week Name"
                            className="input input-bordered input-primary w-full max-w-xs"
                          />
                          <button className="btn btn-primary">Create</button>
                        </form>
                      </div>
                    </dialog>
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {block?.weeks?.map((week) => (
                      <div className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" defaultChecked />
                        <div className="collapse-title text-xl font-medium text-center">
                          {week.name}
                        </div>
                        <div className="collapse-content">
                          <p>{}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
}