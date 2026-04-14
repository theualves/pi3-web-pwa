import Link from 'next/link';
import Image from "next/image"; 

export default function Header() {
  return (
    <header className="text-white flex flex-col">
      <div>
        <Image src="/logo.png" alt="Logo" width={80} height={80} />
      </div>

      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          My App
        </Link>
      </nav>

      <div className="h-[6px] w-full bg-orange-500" />
    </header>
  );
}
