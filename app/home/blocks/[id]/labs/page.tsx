import { LabData } from "@/types/LabData";
import React from "react";
import MyButton from "@/app/UI/componenttest";
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

export default function LabPage() {
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
            <div className="collapse-content">
              {item.RxNum.map((items, index) => (
                <p key={index}>{items}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className=" flex justify-center w-100% mt-4">
        <MyButton text="Export" />
      </div>
    </section>
  );
}
