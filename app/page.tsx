"use client";
import React, { useEffect } from "react";
import { RedirectType, redirect, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/router";
import LinkBlock from "./UI/home/link";
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";
import { useSession } from "next-auth/react";


export default function Login() {

  const {status} = useSession(); 
  const searchParams = useSearchParams(); 
  const callBackUrl = searchParams.get('callbackUrl') || '/home/';

  useEffect(
    () => {
      if (status === "authenticated"){
        redirect("/home/", RedirectType.push)
      }
    },
    [status]
  )


  return (
    <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen gap-20 ">
      <div>
        <h1 className="text-2xl  sm:text-5xl font-bold bg-clip-text mx-11">
          Welcome To{" "}
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-green-500 to-purple-500 text-6xl py-2 ">
            PharmaGrades
          </span>
        </h1>
      </div>
      <div>
        <LinkBlock
          href={`/api/auth/signin?callbackUrl=${encodeURIComponent(callBackUrl)}`}
          Icon={VscArrowRight}
          IconSize={25}
          className="btn-wide btn-accent text-white"
        >
          Get Started
        </LinkBlock>
      </div>
    </div>
  );
}
