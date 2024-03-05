"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Block } from "@/interfaces/block";
import axios from "axios";
import CreateBlock from "@/app/UI/Blocks/CreateBlock";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { useSession } from "next-auth/react";
import { LabData } from "@/types/LabData";
import { Student } from "@/interfaces/student";

interface Props {
  params: { blockId: string };
}

export default function AddBlock() {
  const { blocks, selectedBlock } = useBlocksContext();
  const { data: session } = useSession();
  console.log(session);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentID, setStudentID] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [block, setBlock] = useState<Block>();

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };
  const handleStudentIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStudentID(event.target.value);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const letters = /^[A-Za-z]+$/;
    const Numbers = /^[1-9]+$/;
    if (!firstName.match(letters)) {
      alert("The FirstName should be all in letters ");
      return;
    }
    if (!lastName.match(letters)) {
      alert("The lastName should be all in letters");
      return;
    }
    if (!studentID.match(Numbers)) {
      alert("The studentID should be all in numbers");
      return;
    }
    const newStudent: Student = {
      _id: studentID,
      firstName: firstName,
      lastName: lastName,
    };
    setStudents([...students, newStudent]);
    setFirstName("");
    setLastName("");
    setStudentID("");
  };

  return (
    <section className="flex flex-col items-center sm:items-start w-full">
      <div className="flex justify-between mb-8 w-full">
        <h1 className="text-2xl text-primary p-2 flex-1 rounded-lg">
          Add a Block
        </h1>
        <button className="btn btn-primary">Save</button>
      </div>
      <div className="flex gap-52 w-full">
        <input
          required
          type="text"
          placeholder="Block Name"
          className="input input-bordered input-primary w-full max-w-xs join-item my-2"
        />
        <div className="flex gap-2">
          <input
            required
            type="text"
            placeholder="Users"
            className="input input-bordered input-primary w-full max-w-xs join-item my-2"
          />
          <button className="btn btn-primary join-item my-2">Add Users</button>
        </div>
      </div>
      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full max-w-xs border-gray-300 shadow-xl"
        placeholder="No"
      />
      <div className="flex flex-row items-center w-full my-4">
        <hr className="border-black w-6/12" />
        <p className="text-black mx-2">Or</p>
        <hr className="border-black w-6/12"></hr>
      </div>
      <form
        className="flex flex-col sm:flex-row gap-2 sm:join border-b-2 border-gray-300 p-4 shadow-xl w-full"
        onSubmit={handleSubmit}
      >
        <input
          required
          value={firstName}
          onChange={handleFirstNameChange}
          type="text"
          placeholder="First Name"
          className="input input-bordered input-primary w-full max-w-xs join-item"
        />
        <input
          required
          value={lastName}
          onChange={handleLastNameChange}
          type="text"
          placeholder="Last Name"
          className="input input-bordered input-primary w-full max-w-xs join-item"
        />
        <input
          required
          value={studentID}
          onChange={handleStudentIDChange}
          type="text"
          placeholder="Student ID"
          className="input input-bordered input-primary w-full max-w-xs join-item"
        />
        <button className="btn btn-primary join-item">Add students</button>
      </form>

      <div className="w-full mt-6">
        {students.map((student) => (
          <div
            className="collapse collapse-arrow bg-base-200 my-3"
            key={student._id}
          >
            <input type="checkbox" name="my-accordion-2" placeholder="1" />
            <div className="collapse-title text-xl font-medium">
              {student.firstName} {student.lastName}
            </div>
            <div className="collapse-content">{student._id}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
