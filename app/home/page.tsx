"use client";
import Image from "next/image";
import Link from "next/link";
import { User } from "next-auth";
import { useEffect } from "react";
import { RedirectType, redirect, useSearchParams } from "next/navigation";
import { Block } from "@/interfaces/block";
import BlockButton from "../UI/Blocks/BlockButton";
import LinkBlock from "../UI/home/link";
import { VscArrowRight } from "react-icons/vsc";
import { useBlocksContext } from "../_utils/blocks-context";
import { useSession } from "next-auth/react";
import BlockCard from "../UI/Blocks/BlockCard";

export default function Home() {
  
 
  const { data: session } = useSession();
  const { blocks } = useBlocksContext();
  // const blocks: Block[] = [
  //   {
  //     name: "Block 1",
  //     users: ["user1", "user2"],
  //   },
  //   {
  //     name: "Block 2",
  //     users: ["user3", "user4"],
  //   },
  //   {
  //     name: "Block 3",
  //     users: ["user5", "user6"],
  //   },
  // ];


  return (
    <div className="flex justify-center items-start text-slate-100 mt-10">
      <div className="card border justify-center shadow-xl">
        <div className="card-body gap-10">
          <h2 className="card-title text-slate-600 self-center">
            Welcome, {session?.user?.name}
          </h2>
          <hr />
          <div className=" grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-20 w-full">
            {blocks.length == 0 ? (
              <p className="text-slate-800">
                No blocks available currently.{" "}
                <Link
                  href={"/home/blocks/AddBlock"}
                  className="text-primary hover:text-neutral"
                >
                  Create one
                </Link>
              </p>
            ) : (
              blocks.map((block: Block) => (
                <div>
                  <BlockCard
                    key={block.name}
                    block={block}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
