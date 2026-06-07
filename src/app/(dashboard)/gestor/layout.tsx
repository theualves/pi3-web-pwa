"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading"; 

export default function GestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const usuarioLogadoRaw = localStorage.getItem("usuarioLogado");
    const token = localStorage.getItem("token");

    if (!token || !usuarioLogadoRaw) {
      router.replace("/login");
      return;
    }

    try {
      const usuarioLogado = JSON.parse(usuarioLogadoRaw);

      if (usuarioLogado.role !== "gestor") {
        router.replace(`/${usuarioLogado.role}/home`);
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      localStorage.clear();
      router.replace("/login");
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}
