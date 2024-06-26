import NavBar from "./UI/NavBar";
import SideBar from "./UI/SideBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./auth/AuthProvider";
import BlocksContextProvider from "./_utils/blocks-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PharmaGrades",
  description: "Just another grading app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body data-theme="mytheme" className={inter.className + " min-h-screen"}>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
