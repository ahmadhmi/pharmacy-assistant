import React from "react";
import { Text } from "@/types/LabData";

const MyButton: React.FC<Text> = ({text}) => {
  return (
    <button className="btn  sm:btn-md lg:btn-lg">{text}</button>
  );
};

export default MyButton;
