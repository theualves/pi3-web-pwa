import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative w-full h-[740px] md:h-[520px] lg:h-[700px] flex items-center justify-center lg:justify-start overflow-hidden bg-[#35577D]">
      <div className="absolute inset-0 z-0 block md:hidden">
        <Image
          src="/banner-mobile.png" 
          alt="Conexão Acadêmica"
          fill
          className="object-cover object-top"
          priority
        />
      </div>
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/banner-desktop.png" 
          alt="Conexão Acadêmica"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-[1040px] mx-auto px-6 flex flex-col items-center lg:items-start">
        <div className="mt-[400px] md:mt-[200px] lg:mt-[250px]">
          <Button 
            variant="senac" 
            size="lg" 
            className="h-14 px-10 rounded-full shadow-2xl transition-transform hover:scale-105" 
            asChild
          >
            <Link href="/login" className="text-xl font-bold uppercase tracking-wider">
              Acessar Plataforma
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
