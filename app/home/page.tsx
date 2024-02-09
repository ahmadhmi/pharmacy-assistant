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

export default function Home() {

  const {blocks} = useBlocksContext();  

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
      <div>
        <h2 className="text-xl text-primary font-bold min-w-56 border-b-2 border-primary">Quick Links</h2>
        <div className="flex flex-col gap-2 shadow-xl py-4 px-2 rounded-lg">
          <LinkBlock href="/home/blocks/AddBlock" Icon={VscArrowRight} IconSize={25}>
            New Block
          </LinkBlock>
          <LinkBlock href="/home/blocks" Icon={VscArrowRight} IconSize={25}>Blocks</LinkBlock>
          <LinkBlock href="/home/Labpage" Icon={VscArrowRight} IconSize={25}>Labs</LinkBlock>
        </div>
      </div>
      <div>
      <h2 className="text-xl text-primary font-bold min-w-56 border-b-2 border-primary">Recent Blocks</h2>
      <div className="flex flex-col gap-2 shadow-xl py-4 px-2 rounded-lg">
      {blocks.slice(1,5).map(
        (block:Block) => {
          return <LinkBlock key={block.id} href={`/home/blocks/${block.id}`} Icon={VscArrowRight} IconSize={25}>{block.name}</LinkBlock>
        }
      )}
        </div>
      </div>
    </div>
  );
}
