import React from "react";
import { Block } from "@/interfaces/block";
import { CiEdit } from "react-icons/ci";
import Link from "next/link";

interface Props {
  block: Block;

}

const BlockCard = ({ block }: Props) => {
  console.log(block._id);
  return (
    <div className="card w-full bg-neutral md:w-80 bg-base-100 shadow-md">
      <div className="card-body gap-6 min-h-72">
        <h2 className="card-title self-center">{block.name}</h2>
        <hr />
        <div>
          <h3 className="font-semibold mb-1">Users</h3>
          <ul>
            {block.users.map((user) => (
              <li className="break-words" key={user}>
                {user.split("@")[0]}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-actions justify-between items-center">
          <Link href={`/home/blocks/${block._id as string}/editBlock`}>
            <CiEdit
              size={30}
              color="#37cdbe"
              className="hover:cursor-pointer self-center"
            />
          </Link>
          <Link href={`/home/blocks/${block._id as string}`}>
            <button className="btn btn-primary w-20" color="#a991f7">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlockCard;
