"use client"

import React from "react";
import logo from "@/app/assets/logo.png";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Skeleton from "@/app/UI/Skeleton";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href={"/"}>
          <img src={logo.src} alt="logo" width="50px" />
        </Link>
      </div>
      <AuthStatus/>
    </div>
  );
};

const AuthStatus = () => {
  //const { status, data: session } = useSession();
  let status = "authenticated"; 
  if (status === "unauthenticated")
    return <Link href={"/api/auth/signin"}>Login</Link>;

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
              <img
                alt="Tailwind CSS Navbar component"
          // src={session.user?.image!}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                {/* {session.user?.name} */}
                {/* <span className="badge">New</span> */}
              </a>
            </li>
            {/* <li>
              <a>Settings</a>
            </li> */}
            <li>
              <Link href="/api/auth/signout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    );
};
export default NavBar;
