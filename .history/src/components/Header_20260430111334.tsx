import Link from "next/link";
import Image from "next/image";
import { Bell, UserCircle, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export default function Header({
  isLoggedIn = false,
  userName = "Usuário",
}: HeaderProps) {
  return (
    <header className="flex flex-col w-full">
      <div className="max-w-[1440px] mx-auto w-full flex py-4 px-8 justify-between items-center">
        <div className="">
          <Link href="/home" className="">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} />
          </Link>
        </div>

        <nav className="flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center gap-6">
              <button className="">
                <Bell size={24} />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="text-gray-600 group-hover:text-[#35577D] transition-colors">
                      <UserCircle size={26} strokeWidth={1.5} />
                    </div>
                    <span className="font-medium text-blue-700 hidden sm:block group-hover:text-[#35577D] transition-colors ">
                      {userName}
                    </span>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 mt-2">
                  <DropdownMenuItem asChild className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <Link href="/" className="flex items-center w-full cursor-pointer text-gray-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair do sistema</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/" className="text-xl">
              Contato
            </Link>
          )}
        </nav>
      </div>

      <div className="h-[8px] w-full bg-[#F19100]" />
    </header>
  );
}
