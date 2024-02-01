import Image from "next/image";
import Link from "next/link";
import { User } from "next-auth";

export default function Home() {
  return (
    <div>
      <nav>Pharmacy Assistant</nav>
      <Link href="/api/auth/signin">Login</Link>
    </div>
  );
}
