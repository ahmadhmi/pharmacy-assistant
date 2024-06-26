import { Lab } from "@/interfaces/Lab";
import { Week } from "@/interfaces/week";
import { truncate } from "fs";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

interface Props {
  week: Week;
  handleAddLab: () => void;
  handleDeleteLab: (lab: Lab) => void;
  handleDeleteWeek: (week: Week) => void;
  blockId: string;
}

const WeekAccordion = ({
  week,
  handleAddLab,
  handleDeleteLab,
  handleDeleteWeek,
  blockId,
}: Props) => {
  return (
    <div key={week.name} className="collapse collapse-arrow bg-accent">
      <input type="radio" name="my-accordion-2" defaultChecked />
      <div className="flex justify-between items-center collapse-title text-xl font-medium text-center">
        <div className="flex-grow">{week.name}</div>
      </div>

      <div className="collapse-content">
        <hr className="pt-3 pb-3" />
        {!week.labs || week.labs!.length == 0 ? (
          <p className="text-slate-100">
            No labs available currently.
            {/* <button className="btn btn-primary ml-7" onClick={handleAddLab}>
              Create Lab
            </button> */}
          </p>
        ) : (
          week.labs?.map((lab) => (
            // <div key={lab.name} className="card bg-base-100">
            //   <div className="card-body">
            //     <h2 className="card-title">{lab.name}</h2>
            //     <hr />
            //     <div>
            //       <h3 className="font-semibold mb-1">Description</h3>
            //       <p>{lab.name}</p>
            //     </div>
            //     <div className="card-actions justify-between items-center">
            //       <button className="btn btn-primary w-20">View</button>
            //     </div>
            //   </div>
            // </div>
            <div
              key={lab._id}
              className="flex flex-wrap justify-between items-center border p-5 rounded-lg mb-4 min-w-0"
            >
              <h3 className="text-lg sm:text-xl font-semibold break-words">{lab.name}</h3>
              <div className="flex gap-3">
                <Link
                  href={`/home/blocks/${blockId}/${week._id}/${lab._id}`}
                  className=" hidden sm:inline-flex btn btn-secondary w-20"
                >
                  View
                </Link>
                <Link
                  href={`/home/blocks/${blockId}/${week._id}/${lab._id}`}
                  className=" sm:hidden btn btn-secondary w-12"
                >
                  <FaEye size={15} />
                </Link>
                <button
                  className="btn btn-active btn-error w-12"
                  onClick={() => handleDeleteLab(lab)}
                >
                  <FaRegTrashCan size={15} />
                </button>
              </div>
            </div>
          ))
        )}
        <div className="flex flex-wrap justify-center items-center gap-5 pt-5">
          {/* <button
              className="btn btn-circle btn-success mt-3 text-2xl"
              onClick={handleAddLab}
            >
              +
            </button> */}
          <button className="btn btn-secondary " onClick={handleAddLab}>
            Add Lab
          </button>
          <button
            className="btn btn-error"
            onClick={() => handleDeleteWeek(week)}
          >
            Delete Week
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeekAccordion;
