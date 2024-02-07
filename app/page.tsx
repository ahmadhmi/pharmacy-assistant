"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { RedirectType, redirect } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const { status, data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      redirect("/home", RedirectType.push);
    }
  }, [status]);

  return (
  <Link href="/api/auth/signin">Login</Link>
  )
}
