"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { RedirectType, redirect } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {

  const {status, data:session} = useSession(); 

  useEffect(
    () => {
      console.log(session?.user); 
    },
    [session]
  )

  return (
    <div className="flex flex-row justify-center items-center min-h-screen gap-20 ">
      <div>
        <h1 className="text-5xl font-bold bg-clip-text mx-11">
          Welcome To{" "}
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-green-500 to-purple-500 ">
            Pharmacy Assistant
          </span>
        </h1>
      </div>
      <div>
        <Link href="/api/auth/signin" className="btn btn-wide mx-11 text-2xl">
          Login
        </Link>
      </div>
    </div>
  );
}
