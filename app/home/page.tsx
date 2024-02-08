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

  const test = async () => {
    try {
      const blockId = "65bd6d9bc6248e23a7c07e02"; // Replace with the actual block ID
      const response = await fetch(`http://localhost:3000/api/blocks/0`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          block: {
            id: blockId,
          },
        }),
      });
  
      if (!response.ok) {
        // Handle the error if the response status is not okay (e.g., 404 Not Found)
        const errorData = await response.json();
        console.error(errorData.error);
      } else {
        console.log("Block deleted successfully");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  test();
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
