"use client";
import Image from "next/image";
import Link from "next/link";
import { User } from "next-auth";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { RedirectType, redirect } from "next/navigation";
import { Block } from "@/interfaces/block";
import BlockButton from "../UI/Blocks/BlockButton";

export default function Home() {

  return (
    <div className="bg-red-600">
      <nav>Pharmacy Assistant</nav>
      <BlockButton />
      <Link href="home/blocks/AddBlock" style={{ display: "block" }}>
        Add Block
      </Link>
      <Link href="/home/Labpage" style={{ display: "block" }}>
        Lab Page
      </Link>
    </div>
  );
}
