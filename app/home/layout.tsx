import NavBar from "../UI/NavBar";
import SideBar from "../UI/SideBar";
import AuthProvider from "../auth/AuthProvider";
import BlocksContextProvider from "../_utils/blocks-context";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";
import { use, useEffect, useState } from "react";
import { RedirectType, redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {

  // const session = await getServerSession(authOptions);

  // useEffect(
  //   () => {
  //     if (!(session?.user)){
  //       redirect("/", RedirectType.replace); 
  //     }
  //   }
  // )

  return (
      <BlocksContextProvider>
          <SideBar>{children}</SideBar>
      </BlocksContextProvider>
  );
}
