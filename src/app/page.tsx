"use client";

import Banner from "@/components/Banner";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Header />
      <Banner />
      <h1 className="text-2xl font-semibold mt-[60]">Cadastre, acompanhe e valide atividades de forma rápida e organizada.</h1>
      <div className="flex justify-center w-full mt-6">
        <Button
          className="mt-4"
          onClick={() => alert("O Shadcn está funcionando")}
        >
          Entrar
        </Button>
      </div>
    </div>
  );
}
