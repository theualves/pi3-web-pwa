"use client";

import Link from "next/link";
import Image from "next/image";
import { IconeSenac } from "./IconeSenac";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  let perfil = "Usuário";

  if (pathname?.includes("/gestor")) {
    perfil = "Gestor";
  } else if (pathname?.includes("/coordenador")) {
    perfil = "Coordenador";
  } else if (pathname?.includes("/aluno") || pathname?.includes("/home")) {
    perfil = "Aluno";
  }
  return (
    <header className="flex flex-col w-full">
      <div className="max-w-[1440px] mx-auto w-full flex py-3 px-8 justify-between items-center">
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
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer group border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 hover:bg-[#E07604] hover:border-[#E07604] shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-center bg-white px-1 py-2 rounded-md shadow-sm group-hover:scale-105 transition-transform">
                      <IconeSenac
                        style={{ width: "24px", height: "16px" }}
                        className="text-[#004A8D]"
                      />
                    </div>

                    {/* Texto: Melhor hierarquia entre Nome e Cargo */}
                    <span className="flex flex-col leading-tight hidden sm:flex">
                      <span className="font-semibold text-gray-800 text-sm group-hover:text-white transition-colors">
                        {userName}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 group-hover:text-orange-100 transition-colors">
                        {perfil}
                      </span>
                    </span>

                    {/* Opcional: Um ícone de setinha para indicar o dropdown */}
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 mt-2">
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Link
                      href="/"
                      className="flex items-center w-full cursor-pointer text-gray-700"
                    >
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
