"use client";

import WeekAccordion from "@/app/UI/Blocks/WeekAccordion";
import { Block } from "@/interfaces/block";
import { Week } from "@/interfaces/week";
import axios from "axios";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";

interface Props {
  params: {
    blockId: string;
  };
}

export default function BlockPage({ params }: Props) {
  const [block, setBlock] = useState<Block | undefined>();
  const [addedWeek, setAddedWeek] = useState("");
  const [addedLab, setAddedLab] = useState("");
  const [selectedWeek, setSelectedWeek] = useState<Week | undefined>();

  const fetchBlock = async () => {
    const block = await axios.get<Block>(`/api/blocks/${params.blockId}`);
    setBlock(block.data);
  };

  const createWeekModal = document.getElementById(
    "create_week_modal"
  ) as HTMLDialogElement;
  const createLabModal = document.getElementById(
    "create_lab_modal"
  ) as HTMLDialogElement;
  useEffect(() => {
    fetchBlock();
  }, []);
  const handleAddWeek = (event: FormEvent) => {
    event.preventDefault();
    console.log(addedWeek);
    if (block && block.weeks) {
      setBlock({
        ...block,
        weeks: [...block.weeks, { name: addedWeek }],
      });
    } else if (block && addedWeek) {
      setBlock({
        ...block,
        weeks: [{ name: addedWeek }],
      });
    }
    setAddedWeek("");
    createWeekModal?.close();
    console.log(addedWeek);
    console.log(block);
  };
  const handleCreateLab = (week: Week) => {
    setSelectedWeek(week);
    createLabModal?.showModal();
    console.log(week);
  };
  const handleAddLab = (event: FormEvent) => {
    event.preventDefault();
    setBlock((prevBlock: Block | undefined) => {
      // Creating a deep copy of the block, especially the week array and its contents to avoid mutating the state directly.
      const updatedBlock: Block = {
        ...prevBlock,
        weeks: prevBlock!.weeks!.map((week: Week) => {
          if (week.name === selectedWeek?.name && week.labs) {
            return {
              ...week,
              labs: [...week.labs!, { name: addedLab }], // Add the new lab to the labs array of week 2
            };
          } else if (week.name === selectedWeek?.name && !week.labs) {
            return {
              ...week,
              labs: [{ name: addedLab }], // Add the new lab to the labs array of week 2
            };
          }
          return week;
        }),
        users: prevBlock!.users || [], // Add a default value of an empty array for the users property
      };

      return updatedBlock;
    });
    setSelectedWeek(undefined);
    setAddedLab("");
    console.log(block);
    createLabModal?.close();
  };
  return (
    <div className="flex justify-center items-start text-slate-100 mt-10">
      <div className="card border justify-center shadow-xl w-full">
        <div className="card-body gap-5">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-slate-600 text-2xl flex-grow text-center">
              {block?.name}
            </h2>
            <div className="dropdown dropdown-hover dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-primary m-1">
                <CiEdit size={20} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 hover:cursor-pointer"
              >
                <li>
                  <a onClick={() => createWeekModal?.showModal()}>Add Week</a>
                </li>
              </ul>
            </div>
          </div>
          <hr />
          <div className=" grid grid-cols-1 gap-5 lg:gap-20 w-full">
            {!block?.weeks || block.weeks.length == 0 ? (
              <p className="text-slate-800">
                No weeks available currently.
                <button
                  className="btn btn-primary ml-4"
                  onClick={() => createWeekModal?.showModal()}
                >
                  Create Week
                </button>
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {block?.weeks?.map((week) => (
                  <WeekAccordion
                    key={week.name}
                    week={week}
                    handleAddLab={() => handleCreateLab(week)}
                  />
                ))}
              </div>
            )}
          </div>
          <dialog id="create_week_modal" className="modal">
            <div className="modal-box text-white">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Enter the name of the week:</h3>
              <form
                onSubmit={handleAddWeek}
                className="py-4 flex justify-between gap-2"
              >
                <input
                  type="text"
                  placeholder="Week Name"
                  className="input input-bordered input-primary w-full max-w-xs"
                  required
                  value={addedWeek}
                  onChange={(e) => setAddedWeek(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </form>
            </div>
          </dialog>
          <dialog id="create_lab_modal" className="modal">
            <div className="modal-box text-white">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Enter the name of the lab:</h3>
              <form
                onSubmit={handleAddLab}
                className="py-4 flex justify-between gap-2"
              >
                <input
                  type="text"
                  placeholder="Lab Name"
                  className="input input-bordered input-primary w-full max-w-xs"
                  required
                  value={addedLab}
                  onChange={(e) => setAddedLab(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </form>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}
