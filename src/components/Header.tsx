"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { IconeSenac } from "./IconeSenac";
import { Bell, BellRing, ChevronDown, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [notificacoes, setNotificacoes] = useState([]);
  const hasNotificacoes = notificacoes.length > 0;

  // Estado unificado do usuário para evitar misturar variáveis soltas
  const [usuario, setUsuario] = useState<{ nome: string; role: string } | null>(
    null,
  );

  useEffect(() => {
    // Busca os dados do localStorage apenas no lado do cliente (navegador)
    const storage = localStorage.getItem("usuarioLogado");
    if (storage) {
      try {
        const usuarioLogado = JSON.parse(storage);
        const nome = usuarioLogado?.nome || "Usuário";
        const role = usuarioLogado?.role || "aluno";

        setUsuario({ nome, role });
      } catch (error) {
        console.error("Erro ao decodificar JSON do usuário:", error);
      }
    }
  }, []);

  // Função de logout que limpa o JWT e desloga o usuário de verdade
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    router.push("/");
  };

  // Define o crachá do perfil com base na URL atual
  let perfilExibido = "Usuário";
  if (pathname?.includes("/gestor")) {
    perfilExibido = "Gestor";
  } else if (pathname?.includes("/coordenador")) {
    perfilExibido = "Coordenador";
  } else if (pathname?.includes("/aluno")) {
    perfilExibido = "Aluno";
  }

  const homeLink = pathname?.startsWith("/coordenador")
    ? "/coordenador/home"
    : pathname?.startsWith("/gestor")
      ? "/gestor/home"
      : pathname?.startsWith("/aluno")
        ? "/aluno/home"
        : "https://www.pe.senac.br/";

  // Consideramos logado se encontramos os dados do usuário no estado do cliente
  const estaAutenticado = !!usuario;

  return (
    <header className="flex flex-col w-full">
      <div className="max-w-[1440px] mx-auto w-full flex py-3 px-4 md:px-8 justify-between items-center">
        <div className="flex items-center gap-4">
          {estaAutenticado && pathname !== "/" && (
            <SidebarTrigger className="md:hidden" />
          )}

          <Link
            href={homeLink}
            target={!homeLink.startsWith("/") ? "_blank" : undefined}
            rel={!homeLink.startsWith("/") ? "noopener noreferrer" : undefined}
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={80}
              height={80}
              className="w-[70px] md:w-[80px] h-auto"
              priority
            />
          </Link>
        </div>

        <nav className="flex items-center">
          {estaAutenticado ? (
            <div className="flex items-center gap-3 md:gap-6">
              {/* Menu de Notificações */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
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
                    notificacoes.map((nota, index) => (
                      <DropdownMenuItem
                        key={index}
                        className="cursor-pointer text-sm py-2"
                      >
                        {nota}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      Você não tem novas notificações.
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Menu de Usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer group md:shadow-sm md:border border-transparent md:border-[#DEDEDE] rounded-full md:rounded-lg p-1 md:px-3 md:py-2 bg-transparent md:bg-gray-50 hover:bg-gray-100 md:hover:bg-[#F5ECE5] transition-all duration-200">
                    <div className="flex items-center justify-center bg-white px-1 py-2 rounded-md shadow-sm group-hover:scale-105 transition-transform">
                      <IconeSenac
                        style={{ width: "24px", height: "16px" }}
                        className="text-[#004A8D]"
                      />
                    </div>
                    <span className="flex flex-col leading-tight hidden sm:flex">
                      <span className="font-semibold text-gray-800 text-sm transition-colors">
                        {usuario?.nome || "Carregando..."}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 transition-colors">
                        {perfilExibido}
                      </span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 mt-2" align="end">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-600" />
                    <span className="text-red-600 font-medium">
                      Sair do sistema
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link
              href="https://faculdadesenacpe.edu.br/contato"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-[#014A8E] hover:text-[#F19100] transition-colors duration-200"
            >
              Contato
            </Link>
          )}
        </nav>
      </div>

      <div className="h-[6px] w-full bg-[#F19100]" />
    </header>
  );
}
