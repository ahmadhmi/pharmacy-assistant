"use client";

import WeekAccordion from "@/app/UI/Blocks/WeekAccordion";
import { Block } from "@/interfaces/block";
import { Week } from "@/interfaces/week";
import axios from "axios";
import { error } from "console";
import { redirect } from "next/dist/server/api-utils";
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
  const [errorOcurred, setErrorOcurred] = useState(false);
  const [labErrorOccurred, setLabErrorOccurred] = useState(false); // State to track lab errors

  const fetchBlock = async () => {
    const block = await axios.get<Block>(`/api/blocks/${params.blockId}`);
    setBlock(block.data);
  };

  const patchBlock = async () => {
    await axios.patch(`/api/blocks/${params.blockId}`, block);
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
    event.preventDefault(); // Prevent default form submission behavior

    if (!block) return; // Exit if block is undefined

    const weekExists = block.weeks?.some((week) => week.name === addedWeek);

    if (weekExists) {
      setErrorOcurred(true); // Set error state to display the error message
      console.log("Week already exists");
    } else {
      const updatedWeeks = [...(block.weeks || []), { name: addedWeek }];
      setBlock({ ...block, weeks: updatedWeeks });
      patchBlock();
      setAddedWeek(""); // Reset the input field only if the week is added
      setErrorOcurred(false); // Reset error state
      createWeekModal?.close(); // Close modal only if the week is added
    }
  };
  const handleCreateLab = (week: Week) => {
    setSelectedWeek(week);
    createLabModal?.showModal();
    console.log(week);
  };

  const handleAddLab = (event: FormEvent) => {
    event.preventDefault(); // Prevent the form from submitting

    if (!block || !selectedWeek) return; // Exit if block or selectedWeek is undefined

    let labExists = false;
    for (const week of block.weeks || []) {
      if (week.labs?.some((lab) => lab.name === addedLab)) {
        labExists = true;
        break;
      }
    }

    if (labExists) {
      setLabErrorOccurred(true); // Set error state to display the error message
      console.log("Lab already exists in one of the weeks");
    } else {
      // Add lab to the selected week
      setBlock((prevBlock: Block | undefined) => {
        const updatedBlock: Block = {
          ...prevBlock,
          weeks: prevBlock!.weeks!.map((week: Week) => {
            if (week.name === selectedWeek?.name) {
              return {
                ...week,
                labs: [...(week.labs || []), { name: addedLab }],
              };
            }
            return week;
          }),
          users: prevBlock?.users || [], // Ensure users property is always assigned an empty array if it is undefined
        };
        return updatedBlock;
      });
      patchBlock();
      setAddedLab(""); // Reset the input field only if the lab is added
      setLabErrorOccurred(false); // Reset error state
      createLabModal?.close(); // Close modal only if the lab is added
    }
  };
  const handleDeleteLab = (week: Week) => {
    if (!block) return; // Exit if block is undefined

    const updatedWeeks = block.weeks?.map((w) => {
      if (w.name === week.name) {
        w.labs?.pop();
      }
      return w;
    });

    setBlock({ ...block, weeks: updatedWeeks });
    patchBlock();
  };

  const handleViewLab = (week: Week) => {
    console.log("View lab", week);
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
                <li>
                  <Link href={`/home/blocks/${params.blockId}/editBlock`}>
                    Edit Block
                  </Link>
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
                    handleDeleteLab={() => handleDeleteLab(week)}
                    handleViewLab={() => handleViewLab(week)}
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
                className="py-4 flex flex-col justify-between gap-2 "
              >
                <div className="flex justify-between gap-2 ">
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
                </div>
                {errorOcurred && (
                  <p className="text-red-700">
                    Week with this name already exists!
                  </p>
                )}
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
                className="py-4 flex flex-col justify-between gap-2"
              >
                <div className="flex justify-between gap-2 ">
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
                </div>
                {labErrorOccurred && (
                  <p className="text-red-700">
                    Lab with this name already exists!
                  </p>
                )}
              </form>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}
