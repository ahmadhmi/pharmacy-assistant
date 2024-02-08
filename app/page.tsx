"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { RedirectType, redirect } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/router";
import LinkBlock from "./UI/home/link";
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";
export default function Login() {
  const { status, data: session } = useSession();

  useEffect(() => {
    console.log(session?.user);
  }, [session]);

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen gap-20 ">
      <div>
        <h1 className="text-2xl  sm:text-5xl font-bold bg-clip-text mx-11">
          Welcome To{" "}
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-green-500 to-purple-500 text-6xl p-2 ">
            Pharmacy Assistant
          </span>
        </h1>
      </div>
      <div>
        <LinkBlock
          href="/api/auth/signin"
          Icon={VscArrowRight}
          IconSize={25}
          className="btn-wide btn-accent"
        >
          Get Started
        </LinkBlock>
      </div>
    </div>
  );
}
