import React from "react";
import { Block } from "@/interfaces/block";

const BlockCard = () => {
  const block: Block = {
    name: "Block A",
    users: [
      "amd.heshmati@gmail.com",
      "john.doe@yahoo.com",
      "john.smith@msn.com",
    ],
  };
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title self-center mb-3">{block.name}</h2>
        <hr />
        <div>
          <h3 className="font-semibold mb-1">Users</h3>
          <ul>
            {block.users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default BlockCard;
