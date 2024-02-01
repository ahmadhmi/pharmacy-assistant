import Image from "next/image";
import Link from "next/link";
import run from './_services/databaseService';

export default function Home() {
  
  run(); 
  return (
    <div>
      <nav>Pharmacy Assistant</nav>
      <Link href="/Labpage" style={{display:"block"}}>Lab Page</Link>
      <Link href="/api/auth/signin">Login</Link>
    </div>
  );
}
