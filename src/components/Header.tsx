"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IconeSenac } from "./IconeSenac";
import { Bell, BellRing, ChevronDown, LogOut } from "lucide-react"; 
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

  const [notificacoes, setNotificacoes] = useState(["Aviso 1", "Aviso 2"]);
  const hasNotificacoes = notificacoes.length > 0;

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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* O "relative" aqui é crucial para o balãozinho vermelho grudar no sino */}
                  <button className="relative text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100">
                    {hasNotificacoes ? (
                      <>
                        <BellRing size={24} className="text-[#004A8D]" />
                        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full">
                          {notificacoes.length > 9 ? "9+" : notificacoes.length}
                        </span>
                      </>
                    ) : (
                      <Bell size={24} />
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64 p-2 mt-2" align="end">
                  <div className="px-2 py-1.5 font-semibold text-sm border-b mb-1">
                    Notificações
                  </div>
                  
                  {hasNotificacoes ? (
                    // Se tem notificações, faz um loop para mostrar
                    notificacoes.map((nota, index) => (
                      <DropdownMenuItem key={index} className="cursor-pointer text-sm py-2">
                        {nota}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    // Se NÃO tem notificações, mostra essa mensagem
                    <div className="py-4 text-center text-sm text-gray-500">
                      Você não tem novas notificações.
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>


              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer group shadow-sm border border-[#DEDEDE] rounded-lg px-3 py-2 bg-gray-50 hover:bg-[#F5ECE5] hover:border-[#F6BF87] transition-all duration-200">
                    <div className="flex items-center justify-center bg-white px-1 py-2 rounded-md shadow-sm group-hover:scale-105 transition-transform">
                      <IconeSenac
                        style={{ width: "24px", height: "16px" }}
                        className="text-[#004A8D]"
                      />
                    </div>
                    <span className="flex flex-col leading-tight hidden sm:flex">
                      <span className="font-semibold text-gray-800 text-sm transition-colors">
                        {userName}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 transition-colors">
                        {perfil}
                      </span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 mt-2" align="end">
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