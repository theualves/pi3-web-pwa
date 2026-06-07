"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const storage = localStorage.getItem("usuarioLogado");
    if (storage) {
      try {
        const usuario = JSON.parse(storage);
        
        // Direcionamento inteligente pelo tipo de perfil
        if (usuario.role === "coordenador") {
          router.push("/coordenador/home");
        } else if (usuario.role === "gestor") {
          router.push("/gestor/home");
        } else {
          router.push("/aluno/home"); 
        }
      } catch (error) {
        // Limpeza de segurança caso o dado salvo esteja corrompido
        localStorage.clear();
      }
    }
  }, [router]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Banner />
      </main>
      <Footer />
    </div>
  );
}
