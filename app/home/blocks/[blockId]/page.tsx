"use client";

import WeekAccordion from "@/app/UI/Blocks/WeekAccordion";
import { Lab } from "@/interfaces/Lab";
import { Block } from "@/interfaces/block";
import { defaultTemplate } from "@/interfaces/template";
import { Week } from "@/interfaces/week";
import axios, { AxiosError } from "axios";
import { set } from "mongoose";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import Skeleton from "react-loading-skeleton";

interface Props {
    params: {
        blockId: string;
    };
}

export default function BlockPage({ params }: Props) {
    const [block, setBlock] = useState<Block>();
    const [addedWeek, setAddedWeek] = useState("");
    const [addedLab, setAddedLab] = useState("");
    const [selectedWeek, setSelectedWeek] = useState<Week | undefined>();
    const [errorOcurred, setErrorOcurred] = useState(false);
    const [labErrorOccurred, setLabErrorOccurred] = useState(false); // State to track lab errors
    const [selectedLabToDelete, setSelectedLabToDelete] = useState<Lab>();
    const [selectedWeekToDelete, setSelectedWeekToDelete] = useState<Week>();
    const [isCreateWeekModalOpen, setCreateWeekModalOpen] = useState(false);
    const [isCreateLabModalOpen, setCreateLabModalOpen] = useState(false);
    const [deleteLabModalOpen, setDeleteLabModalOpen] = useState(false);
    const [deleteWeekModalOpen, setDeleteWeekModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBlock = async () => {
        setIsLoading(true);
        try {
            const block = await axios.get<Block>(
                `/api/blocks/${params.blockId}`
            );
            setBlock(block.data);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    const postWeek = async (week: Week) => {
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/blocks/${params.blockId}`, week);
            const newWeek: Week = res.data;
            setIsLoading(false);
            return newWeek;
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const postLab = async (weekId: string, lab: Lab) => {
        setIsLoading(true);
        try {
            const res = await axios.post(
                `/api/blocks/${params.blockId}/${weekId}`,
                lab
            );
            const newLab: Lab = res.data;
            console.log(newLab);
            setIsLoading(false);
            return newLab;
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const deleteLab = async (week: Week, lab: Lab) => {
        setIsLoading(true);
        try {
            const res = await axios.delete(
                `/api/blocks/${params.blockId}/${week._id}/${lab._id}`
            );
            setIsLoading(false);
            return res.data;
        } catch (error: any) {
            //temp code
            alert(error.response.data.error);
            console.log(error);
            setIsLoading(false);
        }
    };
    const deleteWeek = async (week: Week) => {
        setIsLoading(true);
        try {
            const res = await axios.delete(
                `/api/blocks/${params.blockId}/${week._id}`
            );
            setIsLoading(false);
            return res.data;
        } catch (error: any) {
            //temp code
            alert(error.response.data.error);
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlock();
    }, [params.blockId]);

    const handleAddWeek = async (event: FormEvent) => {
        event.preventDefault();

        if (!block) return;

        const weekExists = block?.weeks?.some(
            (week) => week.name === addedWeek
        );

        if (weekExists) {
            setErrorOcurred(true);
            console.log("Week already exists");
        } else {
            setErrorOcurred(false);
            const newWeek = { name: addedWeek, labs: [] };
            const returnedWeek = (await postWeek(newWeek)) as Week;
            const updatedWeeks = [...(block?.weeks || []), returnedWeek];
            setBlock((prevBlock) => ({
                ...prevBlock,
                weeks: updatedWeeks,
                users: block?.users || [],
            }));
            setAddedWeek("");
            setCreateWeekModalOpen(false);
        }
    };
    const handleCreateLab = (week: Week) => {
        setSelectedWeek(week);
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
            const newLab = (await postLab(weekId, {
                name: addedLab,
                selectedTemplate: block?.markingTemplates
                    ? block?.markingTemplates[0]
                    : defaultTemplate,
            } as Lab)) as Lab;
            const updatedWeeks = block?.weeks?.map((week) => {
                if (week.name === selectedWeek.name) {
                    return {
                        ...week,
                        labs: [...(week.labs || []), newLab],
                    };
                }
                return week;
            });
            setBlock((prevBlock) => ({
                ...prevBlock,
                weeks: updatedWeeks,
                users: block?.users || [],
            }));
            setLabErrorOccurred(false);
            setAddedLab("");
            setCreateLabModalOpen(false);
        }
    };

    const handleRemoveLab = (week: Week, lab: Lab) => {
        setSelectedWeek(week);
        setSelectedLabToDelete(lab);
        setDeleteLabModalOpen(true);
    };
    const handleDeleteLab = async (event: FormEvent) => {
        event.preventDefault();

        if (!selectedWeek || !selectedLabToDelete) return;
        const res = await deleteLab(selectedWeek, selectedLabToDelete);

        if (res) {
            const updatedWeeks = block?.weeks?.map((week: Week) => {
                if (week.name === selectedWeek.name) {
                    return {
                        ...week,
                        labs: week.labs?.filter(
                            (lab) => lab.name !== selectedLabToDelete.name
                        ),
                    };
                }
                return week;
            });
            setBlock((prevBlock) => ({
                ...prevBlock,
                weeks: updatedWeeks,
                users: block?.users || [],
            }));
        }
        setDeleteLabModalOpen(false);
    };

    const handleRemoveWeek = async (week: Week) => {
        setSelectedWeek(week);
        setDeleteWeekModalOpen(true);
    };

    const handleDeleteWeek = async (event: FormEvent) => {
        event.preventDefault();

        if (!selectedWeek) return;

        const res = await deleteWeek(selectedWeek);
        console.log(res);

        const updatedWeeks = block?.weeks?.filter(
            (week) => week.name !== selectedWeek.name
        );
        setBlock((prevBlock) => ({
            ...prevBlock,
            weeks: updatedWeeks,
            users: block?.users || [],
        }));
        setDeleteWeekModalOpen(false);
        setSelectedWeek(undefined);
    };

    return (
        <div className="flex justify-center items-start text-slate-100 mt-10">
            <div className="card border justify-center shadow-xl w-full">
                <div className="card-body gap-5">
                    {isLoading ? (
                        <Skeleton height={100} />
                    ) : (
                        <div className="flex items-center justify-between p-4">
                            <h2 className="text-slate-600 text-2xl flex-grow text-center">
                                {block?.name}
                            </h2>
                            <div className="dropdown dropdown-hover dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-primary m-1"
                                >
                                    <CiEdit size={20} />
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 hover:cursor-pointer"
                                >
                                    <li>
                                        <button
                                            onClick={() =>
                                                setCreateWeekModalOpen(true)
                                            }
                                        >
                                            Add Week
                                        </button>
                                    </li>
                                    <li>
                                        <Link
                                            href={`/home/blocks/${params.blockId}/editBlock`}
                                        >
                                            Edit Block
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <hr />
                    {isLoading ? (
                        <Skeleton height={100} count={3} />
                    ) : (
                        <div className=" grid grid-cols-1 gap-5 lg:gap-20 w-full">
                            {!block?.weeks || block.weeks.length == 0 ? (
                                <p className="text-slate-800">
                                    No weeks available currently.
                                    <button
                                        className="btn btn-primary ml-4"
                                        onClick={() =>
                                            setCreateWeekModalOpen(true)
                                        }
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
                                                handleAddLab={() =>
                                                    handleCreateLab(week)
                                                }
                                                handleDeleteLab={(
                                                    labToDelete
                                                ) =>
                                                    handleRemoveLab(
                                                        week,
                                                        labToDelete
                                                    )
                                                }
                                                handleDeleteWeek={(
                                                    weekToDelete
                                                ) =>
                                                    handleRemoveWeek(
                                                        weekToDelete
                                                    )
                                                }
                                                blockId={params.blockId}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <dialog
                        id="create_week_modal"
                        className={`modal ${
                            isCreateWeekModalOpen ? "modal-open" : ""
                        }`}
                    >
                        <div className="modal-box text-white">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button
                                    onClick={() =>
                                        setCreateWeekModalOpen(false)
                                    }
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                    disabled={isLoading}
                                >
                                    ✕
                                </button>
                            </form>
                            <h3 className="font-bold text-lg">
                                Enter the name of the week:
                            </h3>
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
                                        onChange={(e) =>
                                            setAddedWeek(e.target.value)
                                        }
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                    >
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
                        className={`modal ${
                            isCreateLabModalOpen ? "modal-open" : ""
                        }`}
                    >
                        <div className="modal-box text-white">
                            <form method="dialog">
                                <button
                                    onClick={() => setCreateLabModalOpen(false)}
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
                                    disabled={isLoading}
                                >
                                    ✕
                                </button>
                            </form>
                            <h3 className="font-bold text-lg">
                                Enter the name of the lab:
                            </h3>
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
                                        onChange={(e) =>
                                            setAddedLab(e.target.value)
                                        }
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                    >
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
                    <dialog
                        id="delete_lab_modal"
                        className={`modal ${
                            deleteLabModalOpen ? "modal-open" : ""
                        }`}
                    >
                        <div className="modal-box text-white">
                            <form method="dialog">
                                <button
                                    onClick={() => setDeleteLabModalOpen(false)}
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
                                    disabled={isLoading}
                                >
                                    ✕
                                </button>
                            </form>
                            <form
                                onSubmit={handleDeleteLab}
                                className="py-4 flex flex-col justify-between gap-2"
                            >
                                <div className="flex justify-between gap-2 items-center">
                                    <p>
                                        Do you want to delete{" "}
                                        {selectedLabToDelete?.name}?
                                    </p>
                                    <button
                                        type="submit"
                                        className="btn btn-error"
                                        disabled={isLoading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                    <dialog
                        id="delete_week_modal"
                        className={`modal ${
                            deleteWeekModalOpen ? "modal-open" : ""
                        }`}
                    >
                        <div className="modal-box text-white">
                            <form method="dialog">
                                <button
                                    onClick={() =>
                                        setDeleteWeekModalOpen(false)
                                    }
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
                                    disabled={isLoading}
                                >
                                    ✕
                                </button>
                            </form>
                            <form
                                onSubmit={handleDeleteWeek}
                                className="py-4 flex flex-col justify-between gap-2"
                            >
                                <div className="flex justify-between gap-2 items-center">
                                    <p>
                                        Do you want to delete{" "}
                                        {selectedWeek?.name}?
                                    </p>
                                    <button
                                        type="submit"
                                        className="btn btn-error"
                                        disabled={isLoading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                </div>
            </div>
        </div>
    );
}
