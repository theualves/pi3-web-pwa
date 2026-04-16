"use client";

import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Banner />
        <h1 className="max-w-[1500px] mx-auto text-2xl font-semibold mt-[60px]">
          Cadastre, acompanhe e valide atividades <br /> de forma rápida e
          organizada.
        </h1>
        <div className="flex justify-center w-full mt-6">
          <Button
            variant="senac"
            className="my-[60px]"
          >
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
