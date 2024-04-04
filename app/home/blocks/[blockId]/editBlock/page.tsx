"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Block } from "@/interfaces/block";
import axios from "axios";
import * as XLSX from "xlsx";
import { Student } from "@/interfaces/student";
import { MdDelete } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    blockId: string;
    weekId: string;
  };
}

export default function EditBlock({ params }: Props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentID, setStudentID] = useState("");

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [studentIDError, setStudentIDError] = useState(false);

  const [block, setBlock] = useState<Block>();
  const [blockName, setBlockName] = useState<string | undefined>();

  const [students, setStudents] = useState<Student[] | undefined>([]);

  const [user, setUser] = useState("");

  const [userError, setUserError] = useState(false);

  const [users, setUsers] = useState<string[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlock = async () => {
    try {
      setIsLoading(true);
      const block = await axios.get<Block>(`/api/blocks/${params.blockId}`);
      setBlock(block.data);
      setBlockName(block.data.name);
      setStudents(block.data.students);
      setUsers(block.data.users);
    } catch (error) {
      console.error("Error fetching block: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBlock();
  }, [params.blockId]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        const students: Student[] = json.map((student: any) => {
          return {
            _id: String(student["Student ID"]),
            firstName: student["First Name"],
            lastName: student["Last Name"],
          };
        });
        setStudents(students);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
    const letters = /^[A-Za-z\s]*$/;
    if (!firstName.match(letters)) {
      setFirstNameError(true);
    } else {
      setFirstNameError(false);
    }
  };
  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
    const letters = /^[A-Za-z\s]*$/;
    if (!lastName.match(letters)) {
      setLastNameError(true);
    } else {
      setLastNameError(false);
    }
  };
  const handleStudentIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStudentID(event.target.value);
    const Numbers = /^[0-9\s]*$/;
    if (!studentID.match(Numbers)) {
      setStudentIDError(true);
    } else {
      setStudentIDError(false);
    }
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const letters = /^[A-Za-z\s]*$/;
    const Numbers = /^[0-9\s]*$/;

    if (!firstName.match(letters)) {
      return;
    }
    if (!lastName.match(letters)) {
      return;
    }
    if (!studentID.match(Numbers)) {
      return;
    }

    const newStudent: Student = {
      _id: studentID.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };
    if (students?.some((student) => student._id === newStudent._id)) {
      toast.error("Student with the same Student Id already exists");
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

  const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value?.toLowerCase().trim());
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]*$/;
    if (!user.match(emailPattern)) {
      setUserError(true);
    } else {
      setUserError(false);
    }
  };

  const handleAddUser = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]*$/;
    if (!user.match(emailPattern)) {
      return;
    }
    if (users?.includes(user)) {
      toast.error("User already exists");
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
        toast.success("Block updated successfully");
      })
      .catch((error) => {
        toast.error(error.response.data);
        console.error("Error updating block: ", error);
      });
  };

  const handleDeleteBlock = async () => {
    await axios
      .delete(`/api/blocks/${params.blockId}`)
      .then((response) => {
        console.log("Block deleted successfully: ", response.data);
        toast.success("Block deleted successfully");
        router.push("/home");
      })
      .catch((error) => {
        toast.error(error.response.data);
        console.error("Error deleting block: ", error);
      });
  };

  return (
    <section className="flex flex-col items-center sm:items-start w-full">
      <div className="card w-full shadow-xl bg-white">
        <div className="card-body">
          {isLoading ? (
            <Skeleton height={60} />
          ) : (
            <div className="flex justify-between mb-8 w-full">
              <h1 className=" card-title text-2xl text-primary p-2 flex-1 rounded-lg">
                Editing {blockName}
              </h1>
              <button
                className="btn btn-primary"
                onClick={() =>
                  (
                    document.getElementById("my_modal") as HTMLDialogElement
                  ).showModal()
                }
              >
                Save
              </button>
              <dialog id="my_modal" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-lg">
                    Please confirm to update the block?
                  </h3>
                  <form method="dialog">
                    <button
                      className="btn btn-info mt-2"
                      onClick={handleEditBlock}
                    >
                      Confirm
                    </button>
                  </form>
                </div>
              </dialog>
            </div>
          )}

          <hr />
          {isLoading ? (
            <Skeleton height={240} count={2} />
          ) : (
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
                    onChange={handleFileUpload}
                    accept=".xlsx, .xls"
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
                {firstNameError && (
                  <span className="ml-6 text-red-500">
                    <p>The first name should contain letters only!</p>
                  </span>
                )}
                {lastNameError && (
                  <span className="ml-6 text-red-500">
                    <p>The last name should contain letters only!</p>
                  </span>
                )}
                {studentIDError && (
                  <span className="ml-6 text-red-500">
                    <p>The student ID should contain numbers only!</p>
                  </span>
                )}

                {students !== null &&
                students !== undefined &&
                students!.length > 0 ? (
                  <div className="w-full mt-6">
                    {students?.map((student, index) => (
                      <div key={index} className="flex items-center">
                        <div className="collapse collapse-arrow bg-base-200 my-3">
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
                          onClick={() =>
                            (
                              document.getElementById(
                                `my_modal_student_${index}`
                              ) as HTMLDialogElement
                            ).showModal()
                          }
                        >
                          <MdDelete size={20} />
                        </button>
                        <dialog
                          id={`my_modal_student_${index}`}
                          className="modal"
                        >
                          <div className="modal-box">
                            <form method="dialog">
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                ✕
                              </button>
                            </form>
                            <h3 className="inline-block font-bold text-lg">
                              Delete{" "}
                              <h3 className="inline-block font-bold text-red-500">
                                {student.firstName} {student.lastName}
                              </h3>{" "}
                              from the student list?
                            </h3>
                            <form method="dialog">
                              <button
                                className="block btn btn-info justify-center mt-2"
                                onClick={handleDeleteStudent(index)}
                              >
                                Delete
                              </button>
                            </form>
                          </div>
                        </dialog>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div role="alert" className="alert alert-warning">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>
                      There are currently no students. Please add some students
                      in the block.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <hr />
          {isLoading ? (
            <Skeleton height={240} />
          ) : (
            <div className="card w-full bg-base-100">
              <div className="card-body  bg-white gap-5">
                <h2 className="card-title">Users</h2>
                <div className="flex flex-col sm:flex-row gap-2 p-4">
                  <input
                    required
                    type="text"
                    placeholder="Users"
                    value={user}
                    onChange={handleUserChange}
                    className="input input-bordered input-primary w-full max-w-xs my-2"
                  />
                  <button
                    className="btn btn-primary my-2"
                    onClick={handleAddUser}
                  >
                    Add Users
                  </button>
                </div>
                {userError && (
                  <span className="ml-6 text-red-500">
                    <p>Please enter a valid email address!</p>
                  </span>
                )}
                {users !== undefined && (
                  <div className="p-4">
                    {users.map((user, index) => (
                      <div className="flex" key={index}>
                        <p className="bg-gray-200 rounded-md p-3 mb-2">
                          {user}
                        </p>
                        <button
                          className="btn btn-outline btn-error ml-2"
                          onClick={() =>
                            (
                              document.getElementById(
                                `my_modal_user_${index}`
                              ) as HTMLDialogElement
                            ).showModal()
                          }
                        >
                          <MdDelete size={20} />
                        </button>
                        <dialog id={`my_modal_user_${index}`} className="modal">
                          <div className="modal-box">
                            <form method="dialog">
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                ✕
                              </button>
                            </form>
                            <h3 className="inline-block font-bold text-lg">
                              Delete{" "}
                              <h3 className="inline-block font-bold text-red-500">
                                {user}
                              </h3>{" "}
                              from the block?
                            </h3>
                            <form method="dialog">
                              <button
                                className="block btn btn-info justify-center mt-2"
                                onClick={handleDeleteUser(index)}
                              >
                                Delete
                              </button>
                            </form>
                          </div>
                        </dialog>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <hr />
          {isLoading ? (
            <Skeleton height={240} />
          ) : (
            <div className="flex justify-center">
              <button
                className="btn btn-error"
                onClick={() =>
                  (
                    document.getElementById("my_modal_2") as HTMLDialogElement
                  ).showModal()
                }
              >
                Delete the Block
              </button>
              <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-lg">
                    Please confirm to delete the block?
                  </h3>
                  <form method="dialog">
                    <button
                      className="btn btn-info mt-2"
                      onClick={handleDeleteBlock}
                    >
                      Confirm
                    </button>
                  </form>
                </div>
              </dialog>
            </div>
          )}
        </div>
      </div>
      <ToastContainer closeOnClick={true} autoClose={5000} />
    </section>
  );
}
