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
    <div>
      <Link href="/api/auth/signin">Login</Link>
      <Link href="/home">Home</Link>
    </div>
  );
}
