"use client";

import BlockCard from "@/app/UI/Blocks/BlockCard";
import { useBlocksContext } from "@/app/_utils/blocks-context";
import { Block } from "@/interfaces/block";
import { useSession } from "next-auth/react";

export default function Blocks() {
  const { data: session } = useSession();
  const blocks: Block[] = [
    {
      name: "Block 1",
      users: ["user1", "user2"],
    },
    {
      name: "Block 2",
      users: ["user3", "user4"],
    },
    {
      name: "Block 3",
      users: ["user5", "user6"],
    },
  ];
  return (
    <div className="flex justify-center items-start text-slate-100 mt-10">
      <div className="card border justify-center shadow-xl">
        <div className="card-body gap-10">
          <h2 className="card-title text-slate-600 self-center">
            Blocks for {session?.user?.email}
          </h2>
          <hr />
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-20 w-full">
            {blocks.map((block: Block) => (
              <BlockCard
                key={block.name}
                block={block}
                handleEditBlock={() => {
                  console.log("Edit block");
                }}
                handleViewBlock={() => {
                  console.log("View block");
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
