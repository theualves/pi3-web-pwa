"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading"; // Altere o caminho se necessário

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Busca os dados do usuário logado
    const usuarioLogadoRaw = localStorage.getItem("usuarioLogado");
    const token = localStorage.getItem("token");

    // 2. Se não houver token ou dados, manda para o login
    if (!token || !usuarioLogadoRaw) {
      router.replace("/login");
      return;
    }

    try {
      const usuarioLogado = JSON.parse(usuarioLogadoRaw);

      // 3. ABAIXO FICA A REGRA DE OURO:
      // Verifica se a role gravada é exatamente "coordenador"
      if (usuarioLogado.role !== "aluno") {
        // Se for outro perfil (ex: aluno), manda para a home correta dele ou login
        router.replace(`/${usuarioLogado.role}/home`);
        return;
      }

      // Se passou em todas as validações, autoriza a renderização da tela
      setIsAuthorized(true);
    } catch (error) {
      // Caso o JSON esteja corrompido, limpa e desloga
      localStorage.clear();
      router.replace("/login");
    }
  }, [router]);

  // Enquanto verifica o perfil, exibe a tela de carregamento para evitar o "piscar" de conteúdo proibido
  if (!isAuthorized) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <Loading />
      </div>
    );
  }


  return <>{children}</>;
}
