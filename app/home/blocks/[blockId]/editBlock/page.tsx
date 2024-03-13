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
import { MdDelete } from "react-icons/md";

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

  const [students, setStudents] = useState<Student[] | undefined>([]);

  const [user, setUser] = useState("");

  const [users, setUsers] = useState<string[] | undefined>([]);

  const fetchBlock = async () => {
    const block = await axios.get<Block>(`/api/blocks/${params.blockId}`);
    setBlock(block.data);
    setBlockName(block.data.name);
    setStudents(block.data.students);
    setUsers(block.data.users);
  };

  //console.log(block);

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
    const Numbers = /^[0-9]+$/;
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
    if (students?.some((student) => student._id === newStudent._id)) {
      alert("Student with the same Student Id already exists");
      return;
    }
    setStudents((prevStudents) => (prevStudents || []).concat(newStudent));
    setFirstName("");
    setLastName("");
    setStudentID("");
  };

  const handleDeleteStudent = (index: number) => () => {
    setStudents((prevStudents) =>
      (prevStudents || []).filter((_, i) => i !== index)
    );
  };

  const handleAddUser = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.match(emailPattern)) {
      alert("Please enter a valid email address");
      return;
    }
    if (users?.includes(user)) {
      alert("User already exists");
      return;
    }
    setUsers((prevUsers) => (prevUsers || []).concat(user));
    setUser("");
  };

  const handleDeleteUser = (index: number) => () => {
    setUsers((prevUsers) => (prevUsers || []).filter((_, i) => i !== index));
  };

  const handleEditBlock = async () => {
    const newBlock: Block = {
      _id: params.blockId,
      name: blockName,
      weeks: block?.weeks || [],
      students: students || [],
      users: users || [],
    };
    await axios
      .patch<Block>(`/api/blocks/${params.blockId}`, newBlock)
      .then((response) => {
        console.log("Block updated successfully: ", response.data);
      })
      .catch((error) => {
        console.error("Error updating block: ", error);
      });
  };

  return (
    <section className="flex flex-col items-center sm:items-start w-full">
      <div className="card w-full shadow-xl bg-white">
        <div className="card-body">
          <div className="flex justify-between mb-8 w-full">
            <h1 className=" card-title text-2xl text-primary p-2 flex-1 rounded-lg">
              Editing {block?.name}
            </h1>
            <button className="btn btn-primary" onClick={handleEditBlock}>
              Save
            </button>
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

              {students!.length > 0 ? (
                <div className="w-full mt-6">
                  {students?.map((student, index) => (
                    <div key={student._id} className="flex items-center">
                      <div
                        className="collapse collapse-arrow bg-base-200 my-3"
                        key={index}
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
                      <button
                        className="btn btn-outline btn-error ml-2"
                        onClick={handleDeleteStudent(index)}
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-red-500 p-14">
                  <p className="text-black">
                    There are currently no students. Please add some students in
                    the block.
                  </p>
                </div>
              )}
              {}
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
                  value={user}
                  onChange={(e) => setUser(e.target.value?.toLowerCase())}
                  className="input input-bordered input-primary w-full max-w-xs my-2"
                />
                <button
                  className="btn btn-primary my-2"
                  onClick={handleAddUser}
                >
                  Add Users
                </button>
              </div>
              {users !== undefined && (
                <div className="p-4">
                  {users.map((user, index) => (
                    <div className="flex items-center" key={index}>
                      <p className="bg-gray-200 rounded-md p-2 mb-2">{user}</p>
                      <button
                        className="btn btn-outline btn-error"
                        onClick={handleDeleteUser(index)}
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
