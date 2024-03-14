"use client";
import Image from "next/image";
import Link from "next/link";
import { User } from "next-auth";
import { use, useEffect, useState } from "react";
import { RedirectType, redirect, useSearchParams } from "next/navigation";
import { Block } from "@/interfaces/block";
import BlockButton from "../UI/Blocks/BlockButton";
import LinkBlock from "../UI/home/link";
import { VscArrowRight } from "react-icons/vsc";
import { useBlocksContext } from "../_utils/blocks-context";
import { useSession } from "next-auth/react";
import BlockCard from "../UI/Blocks/BlockCard";
import axios from "axios";
import { set } from "mongoose";
import Skeleton from "react-loading-skeleton";

export default function Home() {
  const { data: session } = useSession();
  // const { blocks } = useBlocksContext();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlock = async function getBlocks() {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/blocks");
      const blocks: Block[] = response.data;
      console.log(response.data);
      setBlocks(blocks);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchBlock();
  }, []);

  return (
    <div className="flex justify-center items-start text-slate-100 mt-10">
      <div className="card border justify-center shadow-xl">
        <div className="card-body gap-10">
          {isLoading ? (
            <Skeleton height={60} />
          ) : (
            <h2 className="card-title text-slate-600 self-center">
              Welcome, {session?.user?.name}
            </h2>
          )}
          <hr />
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7 lg:gap-10 w-full">
              <div className="flex flex-col gap-7">
                <Skeleton width={250} height={300} />
                <Skeleton width={250} height={300} />
              </div>
              <div className="flex flex-col gap-7">
                <Skeleton width={250} height={300} />
                <Skeleton width={250} height={300} />
              </div>
              <div className="flex flex-col gap-7">
                <Skeleton width={250} height={300} />
                <Skeleton width={250} height={300} />
              </div>
            </div>
          ) : (
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
                blocks.map((block: Block, index: number) => (
                  <div key={index}>
                    <BlockCard key={block.name} block={block} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
