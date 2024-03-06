"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Block } from "@/interfaces/block";
import axios from "axios";
import CreateBlock from "@/app/UI/Blocks/CreateBlock";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { useSession } from "next-auth/react";
import { LabData } from "@/types/LabData";
import { Student } from "@/interfaces/student";
import { set } from "mongoose";

interface Props {
  params: { blockId: string };
}

export default function EditBlock({ params }: Props) {
  const { blocks, selectedBlock } = useBlocksContext();
  const { data: session } = useSession();
  console.log(session);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentID, setStudentID] = useState("");

  const [block, setBlock] = useState<Block>();
  const [blockName, setBlockName] = useState<string | undefined>();

  const [students, setStudents] = useState<Student[]>([]);

  const fetchBlock = async () => {
    const block = await axios.get<Block>(`/api/blocks/${params.blockId}`);
    setBlock(block.data);
    setBlockName(block.data.name);
  };

  console.log(block);

  useEffect(() => {
    fetchBlock();
  }, [params.blockId]);

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
      <div className="card w-full bg-base-100 shadow-xl bg-white">
        <div className="card-body">
          <div className="flex justify-between mb-8 w-full">
            <h1 className=" card-title text-2xl text-primary p-2 flex-1 rounded-lg">
              Editing {block?.name}
            </h1>
            <button className="btn btn-primary">Save</button>
          </div>
          <hr />
          <div className="card w-full bg-base-100 ">
            <div className="card-body  bg-white">
              <h2 className="card-title">Block Name & Student List</h2>
              <div className="p-4">
                <input
                  required
                  type="text"
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  className="block input input-bordered input-primary w-full max-w-xs join-item my-2"
                />
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-primary w-full max-w-xs border-gray-300 shadow-xl"
                  placeholder="No"
                />
              </div>
              <div className="flex flex-row items-center w-full my-4">
                <hr className="border-black w-6/12" />
                <p className="text-black mx-2">Or</p>
                <hr className="border-black w-6/12"></hr>
              </div>
              <form
                className="flex flex-col sm:flex-row gap-2 sm:join  p-4  w-full"
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
                <button className="btn btn-primary join-item">
                  Add students
                </button>
              </form>

              <div className="w-full mt-6">
                {students.map((student) => (
                  <div
                    className="collapse collapse-arrow bg-base-200 my-3"
                    key={student._id}
                  >
                    <input
                      type="checkbox"
                      name="my-accordion-2"
                      placeholder="1"
                    />
                    <div className="collapse-title text-xl font-medium">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="collapse-content">{student._id}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr />
          <div className="card w-full bg-base-100">
            <div className="card-body  bg-white gap-5">
              <h2 className="card-title">Users</h2>
              <div className="flex flex-col sm:flex-row gap-2 p-4">
                <input
                  required
                  type="text"
                  placeholder="Users"
                  className="input input-bordered input-primary w-full max-w-xs my-2"
                />
                <button className="btn btn-primary my-2">Add Users</button>
              </div>
              <div className="p-4">
                {block?.users?.map((user) => (
                  <p className="flex flex-row items-center bg-gray-200 rounded-md p-2 mb-2">
                    {user}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
