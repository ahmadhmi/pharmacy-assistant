import { Lab } from "@/interfaces/Lab";
import { Week } from "@/interfaces/week";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";

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
    <div key={week.name} className="collapse collapse-arrow bg-base-200">
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
              className="flex justify-between items-center border p-5 rounded-lg mb-4"
            >
              <h3 className="text-xl font-semibold">{lab.name}</h3>
              <div className="flex gap-3">
                <Link
                  href={`/home/blocks/${blockId}/${week._id}/${lab._id}`}
                  className="btn btn-primary w-20"
                >
                  View
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
        <div className="flex justify-center items-center gap-5 pt-5">
          {/* <button
              className="btn btn-circle btn-success mt-3 text-2xl"
              onClick={handleAddLab}
            >
              +
            </button> */}
          <button
            className="btn btn-outline btn-accent "
            onClick={handleAddLab}
          >
            Add Lab
          </button>
          <button
            className="btn btn-outline btn-error"
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
