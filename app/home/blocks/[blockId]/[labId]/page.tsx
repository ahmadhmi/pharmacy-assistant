"use client";
import { LabData } from "@/types/LabData";
import React from "react";
import MyButton from "@/app/UI/componenttest";
import axios from "axios";
import { useEffect, useState } from "react";
import { group } from "console";
const Data: LabData[] = [
  {
    student: "Qiaomu Lei 1",
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
  {
    student: "john Dao",
    RxNum: ["123123123"],
  },
  {
    student: "john Dao",
    RxNum: ["123123123"],
  },
  {
    student: "john Dao",
    RxNum: ["123123123"],
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
interface Props {
  params: {
    blockId: string;
    labId: string;
  };
}
interface gradeSheet {
  comment: string;
  criteria: object;
  date: Date;
  labId: string;
  rx: string;
  studentID: string;
  studentName: string;
  _id: string;
}

export default function LabPage({ params }: Props) {
  const [gradeSheets, setGradeSheets] = useState([]);
  // const [labData, setLabData] = useState<
  //   Record<string, gradeSheet[]> | undefined
  // >(undefined);
  async function fetchGradingSheets() {
    const data =
      // await axios.get(`/api/blocks/${params.blockId}/${params.labId}/grading`)
      (
        await axios.get(
          `/api/blocks/65cbe1af929966312830eea0/65e6c4517fdb6a053a93de8a/grading`
        )
      ).data;
    setGradeSheets(data);
    console.log(data);
  }
  useEffect(() => {
    fetchGradingSheets();
  }, []);

  if (gradeSheets) {
    const result = gradeSheets.reduce(
      (
        groupedGradeSheets: Record<string, gradeSheet[]>,
        gradeSheet: gradeSheet
      ) => {
        const studentID = gradeSheet.studentID;
        if (groupedGradeSheets[studentID] == null)
          groupedGradeSheets[studentID] = [];
        groupedGradeSheets[studentID].push(gradeSheet);
        return groupedGradeSheets;
      },
      {}
    );
    console.log(result);
  }

  return (
    <section className="display-flex justify-center h-screen w-100% px-8 py-10">
      <h1 className="text-center mb-6 text-3xl">Lab Page</h1>
      <div className="border-y overflow-y-auto" style={{ height: "80%" }}>
        {Data.map((item, index) => (
          <div className="collapse collapse-arrow bg-base-200 my-3" key={index}>
            <input type="checkbox" name="my-accordion-2" placeholder="1" />
            <div className="collapse-title text-xl font-medium">
              {item.student}
            </div>
            <div className="collapse-content bg-primary">
              {item.RxNum.map((items, index) => (
                <div
                  className="flex flex-row items-center justify-between text-black my-2 "
                  key={index}
                >
                  <input
                    title="checkbox"
                    type="checkbox"
                    defaultChecked
                    className=" checkbox border-black"
                  />
                  <p className="font-bold">{items}</p>
                  <div>
                    <button className="btn btn-sm">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className=" flex justify-center w-100% mt-4 gap-3">
        <MyButton text="Export" />
        <MyButton text="Grading" />
      </div>
    </section>
  );
}
