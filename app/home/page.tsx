"use client";
import Image from "next/image";
import Link from "next/link";
import { User } from "next-auth";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { RedirectType, redirect } from "next/navigation";
import { Block } from "@/interfaces/block";
import BlockButton from "../UI/Blocks/BlockButton";
import LinkBlock from "../UI/home/link";
import { VscArrowRight } from "react-icons/vsc";

export default function Home() {

  const {status, data:session} = useSession();

  // const test = async () => {
  //   try {
  //     const blockId = "65bd6d9bc6248e23a7c07e02"; // Replace with the actual block ID
  //     const response = await fetch(`http://localhost:3000/api/blocks/0`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         block: {
  //           id: blockId,
  //         },
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       // Handle the error if the response status is not okay (e.g., 404 Not Found)
  //       const errorData = await response.json();
  //       console.error(errorData.error);
  //     } else {
  //       console.log("Block deleted successfully");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };
  // test();

  // const test1 = async () => {
  //   try {
  //     const blockId = "65bd6d9bc6248e23a7c07e02"; // Replace with the actual block ID
  //     const response = await fetch(`http://localhost:3000/api/blocks/1`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         block: {
  //           id: blockId,
  //         },
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       // Handle the error if the response status is not okay (e.g., 404 Not Found)
  //       const errorData = await response.json();
  //       console.error(errorData.error);
  //     } else {
  //       console.log("Block deleted successfully");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };
  // test1();

  // const test2 = async () => {
  //   try {
  //     const blockId = "65c25ddc239a2f9abed3c8aa"; // Replace with the actual block ID
  //     const newName = "Block 10"
  //     const response = await fetch(`http://localhost:3000/api/blocks/1`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         block: {
  //           id: blockId,
  //           newName: newName
  //         },
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       // Handle the error if the response status is not okay (e.g., 404 Not Found)
  //       const errorData = await response.json();
  //       console.error(errorData.error);
  //     } else {
  //       console.log("Block updated successfully");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };
  // test2();

  return (
    <div className="flex flex-row flex-wrap gap-4">
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
      <h2 className="text-xl text-primary font-bold min-w-56 border-b-2 border-primary">{status}</h2>
      </div>
    </div>
  );
}
