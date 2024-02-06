import React from "react";

const CreateBlock = () => {
  return (
    <main className=" flex flex-col justify-center items-center">
      <p className="mt-10 mb-2">Currently there are no students in this block</p>
      <p className="mb-4">You can upload the class-list or add them manually</p>
      <input
        type="file"
        className="file-input file-input-bordered file-input-info w-full max-w-xs"
      />
      <p className="m-10">or</p>
      <p className="mb-4">Enter the names of the students below:</p>
      <form className="flex flex-col mb-4">
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-info w-full max-w-xs"
        />
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-info w-full max-w-xs"
        />
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-info w-full max-w-xs"
        />
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-info w-full max-w-xs"
        />
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-info w-full max-w-xs"
        />
      </form>
      <button className="btn btn-info">Add students</button>
    </main>
  );
};

export default CreateBlock;
