"use client";

import React, { useEffect } from "react";
import logo from "@/app/assets/logo.png";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Skeleton from "@/app/UI/Skeleton";
import { RedirectType, redirect } from "next/navigation";
import { VscAccount } from "react-icons/vsc";
import Image from "next/image";

const NavBar = () => {
  const { status } = useSession();

  return (
    <div className="navbar bg-base-100 flex flex-row justify-between">
      <div className="flex flex-row gap-5">
        <Link href={status === "authenticated" ? "/home" : "/"}>
          <Image src={logo.src} alt="logo" width={50} />
        </Link>
        <div className="text-xl tracking-wider">
        PharmaGrades
      </div>
      </div>
      <AuthStatus />
    </div>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === "loading") return <Skeleton width="3rem" />;
  if (status === "authenticated")
    return (
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {session.user?.image?  
              <Image
                alt="Tailwind CSS Navbar component"
                src={session.user?.image!}
              /> :
              <VscAccount size={40}></VscAccount>}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a>{session.user?.name}</a>
            </li>
            <li>
              <Link href="/api/auth/signout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    );
};
export default NavBar;
