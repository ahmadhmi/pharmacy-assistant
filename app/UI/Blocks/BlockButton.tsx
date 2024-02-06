import React from "react";

const BlockButton = () => {
  return (
    <main className=" flex flex-col justify-center items-center">
      <div className="mt-20 mb-20">
        <p className="mb-10">Welcome to Pharmacy Assistant Grading WebApp!</p>
        <p className="mb-2">Currently there are no blocks available</p>
        <p>Please create a new block</p>
      </div>
      <button className="btn btn-info">Create New Block</button>
    </main>
  );
};

export default BlockButton;
