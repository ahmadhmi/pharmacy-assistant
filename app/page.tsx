import Image from "next/image";
import Link from "next/link";
import { User } from "next-auth";
import BlockButton from "./UI/Blocks/BlockButton";

export default async function Home() {
  return (
    <div className="bg-red-600">
      <nav>Pharmacy Assistant</nav>
      <BlockButton />
      <Link href="Blocks/AddBlock" style={{ display: "block" }}>
        Add Block
      </Link>
      <Link href="/Labpage" style={{ display: "block" }}>
        Lab Page
      </Link>
      <Link href="/api/auth/signin">Login</Link>
    </div>
  );
}
