import { LabData } from "@/types/LabData";
import React from "react";

const Data: LabData[] = [
  {
    student: "Qiaomu Lei 1",
    RxNum: ["123131", "132131", "123131"],
  },
  {
    student: "john Dao",
    RxNum: ["123123123"],
  },
];

export default function LabPage() {
  return (
    <div>
      {Data.map((item, index) => (
        <div className="collapse collapse-arrow bg-base-200" key={index}>
          <input type="radio" name="my-accordion-2" placeholder="1" />
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
  );
}
