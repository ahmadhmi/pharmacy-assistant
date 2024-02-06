"use client"; 
import Image from "next/image";
import Link from "next/link";
import { User } from "next-auth";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { RedirectType, redirect } from "next/navigation";
import BlockButton from "./UI/Blocks/BlockButton";

export default function Home() {

  const {status, data:session} = useSession(); 

  useEffect(
    () => {
      if(session?.user){
        redirect("/blocks", RedirectType.push); 
      }
    },
    [status]
  )


  return (
    <div className="bg-red-600">
      <nav>Pharmacy Assistant</nav>
      <BlockButton />
      <Link href="Blocks/AddBlock" style={{ display: "block" }}>
        Add Block
      </Link>
      <Link href="/Labpage" style={{ display: "block" }}>
        Lab Page
      </Link>
      <Link href="/api/auth/signin">Login</Link>
    </div>
  );
}
