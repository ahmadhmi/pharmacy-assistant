"use client";

import WeekAccordion from "@/app/UI/Blocks/WeekAccordion";
import { Lab } from "@/interfaces/Lab";
import { Block } from "@/interfaces/block";
import { Week } from "@/interfaces/week";
import axios from "axios";
import { error } from "console";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { FormEvent, use, useEffect, useRef, useState } from "react";
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
  const [selectedLabToDelete, setSelectedLabToDelete] = useState<
    Week | undefined
  >();

  const [isCreateWeekModalOpen, setCreateWeekModalOpen] = useState(false);
  const [isCreateLabModalOpen, setCreateLabModalOpen] = useState(false);
  const [deleteLabModalOpen, setDeleteLabModalOpen] = useState(false);

  const fetchBlock = async () => {
    const block = await axios.get<Block>(`/api/blocks/${params.blockId}`);
    setBlock(block.data);
  };

  // const patchBlock = async () => {
  //   console.log("Patching block", block);
  //   //await axios.patch(`/api/blocks/${params.blockId}`, block);
  // };

  const postWeek = async (week: Week) => {
    const res = await axios.post(`/api/blocks/${params.blockId}`, week);
    const newWeek: Week = res.data;
    // setBlock((prevBlock: Block | undefined) => {
    //   const updatedWeeks = prevBlock?.weeks?.map((week) => {
    //     if (week.name === newWeek.name) {
    //       return newWeek;
    //     }
    //     return week;
    //   });
    //   return {
    //     ...prevBlock,
    //     weeks: updatedWeeks,
    //     users: prevBlock?.users || [],
    //   };
    // });
    return newWeek;
  };

  const postLab = async (weekId: string, lab: Lab) => {
    const res = await axios.post(`/api/blocks/${params.blockId}/${weekId}`, lab);
    const newLab: Lab = res.data;
    console.log(newLab);
    return newLab;
    // setBlock((prevBlock: Block | undefined) => {
    //   const updatedWeeks = prevBlock?.weeks?.map((week) => {
    //     if (week._id === weekId) {
    //       return {
    //         ...week,
    //         labs: [...(week.labs || []), newLab],
    //       };
    //     }
    //     return week;
    //   });
    //   return {
    //     ...prevBlock,
    //     weeks: updatedWeeks,
    //     users: prevBlock?.users || [],
    //   }
    // });
  };

  // const createWeekModal = document.getElementById(
  //   "create_week_modal"
  // ) as HTMLDialogElement;
  // const createLabModal = document.getElementById(
  //   "create_lab_modal"
  // ) as HTMLDialogElement;

  const firstUpdate = useRef(true);

  useEffect(() => {
    fetchBlock();
  }, [params.blockId]);

  // useEffect(() => {
  //   if (firstUpdate.current) {
  //     firstUpdate.current = false;
  //     return;
  //   }

  //   if (block) {
  //     patchBlock();
  //   }
  // }, [block]);

  const handleAddWeek = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!block) return;

    const weekExists = block?.weeks?.some((week) => week.name === addedWeek);

    if (weekExists) {
      setErrorOcurred(true);
      console.log("Week already exists");
    } else {
      setErrorOcurred(false);
      const newWeek = { name: addedWeek, labs: [] };
      const returnedWeek = await postWeek(newWeek);
      const updatedWeeks = [...(block?.weeks || []), returnedWeek];
      setBlock({ weeks: updatedWeeks, users: block?.users || [] });
      setAddedWeek("");
      setCreateWeekModalOpen(false);
    }

    // setBlock((prevBlock: Block | undefined) => {
    //   if (weekExists) {
    //     setErrorOcurred(true);
    //     console.log("Week already exists");
    //     return prevBlock; // Return the current state if the week exists
    //   } else {
    //     const updatedWeeks = [...(prevBlock?.weeks || []), { name: addedWeek }];
    //     setErrorOcurred(false);
    //     newWeek.name = addedWeek;
    //     postWeek(newWeek);
    //     setAddedWeek("");
    //     // createWeekModal?.close();
    //     setCreateWeekModalOpen(false);
    //     return {
    //       ...prevBlock,
    //       weeks: updatedWeeks,
    //       users: prevBlock?.users || [],
    //     };
    //   }
    // });
  };
  const handleCreateLab = (week: Week) => {
    setSelectedWeek(week);
    // createLabModal?.showModal();
    setCreateLabModalOpen(true);
    console.log(week);
  };

  const handleAddLab = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedWeek) return;

    const labExists = block?.weeks?.some((week) =>
      week.labs?.some((lab) => lab.name === addedLab)
    );

    if (labExists) {
      setLabErrorOccurred(true);
      console.log("Lab already exists in one of the weeks");
    } else {
      const weekId = selectedWeek._id!;
      const newLab = await postLab(weekId, {name: addedLab} as Lab);
      const updatedWeeks = block?.weeks?.map((week) => {
        if (week.name === selectedWeek.name) {
          return {
            ...week,
            labs: [...(week.labs || []), newLab],
          };
        }
        return week;
      });
      setBlock({ weeks: updatedWeeks, users: block?.users || [] });
      setLabErrorOccurred(false);
      setAddedLab("");
      setCreateLabModalOpen(false);
    }

    // setBlock((prevBlock: Block | undefined) => {
    //   const weekExists = prevBlock?.weeks?.some((week) =>
    //     week.labs?.some((lab) => lab.name === addedLab)
    //   );

    //   if (weekExists) {
    //     setLabErrorOccurred(true);
    //     console.log("Lab already exists in one of the weeks");
    //     return prevBlock;
    //   } else {
    //     const updatedWeeks = prevBlock?.weeks?.map((week) => {
    //       if (week.name === selectedWeek.name) {
    //         return {
    //           ...week,
    //           labs: [...(week.labs || []), { name: addedLab }],
    //         };
    //       }
    //       return week;
    //     });
    //     setLabErrorOccurred(false);
    //     setAddedLab("");
    //     // createLabModal?.close();
    //     setCreateLabModalOpen(false);
    //     return {
    //       ...prevBlock,
    //       weeks: updatedWeeks,
    //       users: prevBlock?.users || [],
    //     };
    //   }
    // });
  };
  const handleDeleteLab = (weekToDelete: Week, labToDelete: Lab) => {
    setBlock((prevBlock: Block | undefined) => {
      const updatedWeeks = prevBlock?.weeks?.map((week) => {
        if (week.name === weekToDelete.name) {
          return { ...week, labs: week.labs?.slice(0, -1) }; // Removes the last lab
        }
        return week;
      });
      return {
        ...prevBlock,
        weeks: updatedWeeks,
        users: prevBlock?.users || [],
      };
    });
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
                  <a onClick={() => setCreateWeekModalOpen(true)}>Add Week</a>
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
                  onClick={() => setCreateWeekModalOpen(true)}
                >
                  Create Week
                </button>
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {block?.weeks?.map((week) => (
                  <div>
                    <WeekAccordion
                      key={week.name}
                      week={week}
                      handleAddLab={() => handleCreateLab(week)}
                      handleDeleteLab={(labToDelete) =>
                        handleDeleteLab(week, labToDelete)
                      }
                      blockId={params.blockId}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <dialog
            id="create_week_modal"
            className={`modal ${isCreateWeekModalOpen ? "modal-open" : ""}`}
          >
            <div className="modal-box text-white">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  onClick={() => setCreateWeekModalOpen(false)}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
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
          <dialog
            id="create_lab_modal"
            className={`modal ${isCreateLabModalOpen ? "modal-open" : ""}`}
          >
            <div className="modal-box text-white">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  onClick={() => setCreateLabModalOpen(false)}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
                >
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
          {/* <dialog
            id="delete_lab_modal"
            className={`modal ${isCreateLabModalOpen ? "modal-open" : ""}`}
          >
            <div className="modal-box text-white">
              <form method="dialog">
                <button
                  onClick={() => setCreateLabModalOpen(false)}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
                >
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">Enter the name of the lab:</h3>
              <form
                onSubmit={() => handleDeleteLab}
                className="py-4 flex flex-col justify-between gap-2"
              >
                <div className="flex justify-between gap-2 ">
                  <p>Do you want to delete {selectedLabToDelete?.name}</p>
                  <button type="submit" className="btn btn-error">
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </dialog> */}
        </div>
      </div>
    </div>
  );
}
