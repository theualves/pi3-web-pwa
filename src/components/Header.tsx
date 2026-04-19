import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export default function Header({ isLoggedIn = false }: HeaderProps) {
  return (
    <header className="flex flex-col w-full">
      <div className="max-w-[1220px] mx-auto w-full flex p-4 justify-between items-center">
        <div className="">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} />
        </div>

        <nav className="flex items-center">
          {isLoggedIn ? (
            <button className="">
              <Bell size={24} />
            </button>
          ) : (
            <Link href="/" className="text-xl">
              Contato
            </Link>
          )}
        </nav>
      </div>

      <div className="h-[6px] w-full bg-[#F19100]" />
    </header>
  );
}
