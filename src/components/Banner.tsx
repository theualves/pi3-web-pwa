import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Anton, Open_Sans } from "next/font/google";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
});

export default function Banner() {
  return (
    <section className="w-full bg-gradient-to-r from-[#023787] to-[#1F76C3] overflow-hidden min-h-fit lg:min-h-[700px] flex">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-stretch">
        <div className="w-full lg:w-1/2 text-white flex flex-col justify-center items-center text-center lg:items-start lg:text-left py-12 lg:py-12 z-10">
          <Image
          src="/horaMais.svg"
          alt="logo Hora Mais - Senac"
          width={800}
          height={216}
          className="mb-6 w-[280px] lg:w-[450px] h-auto"
          />
          <p
            className={`text-base font-semibold md:text-xl text-[#EDEDED] mb-10 max-w-lg mx-auto lg:mx-0 ${openSans.className}`}
          >
            Um ambiente para envio, análise e validação de horas acadêmicas de
            forma ágil e segura.
          </p>

          <Button
            variant="senac"
            size="lg"
            className="w-fit h-14 px-10 rounded-full shadow-lg transition-transform hover:scale-105"
            asChild
          >
            <Link href="/login" className="text-lg font-bold uppercase">
              Acessar Plataforma
            </Link>
          </Button>
        </div>

        <div className="w-full relative flex items-end justify-center md:pt-4 lg:pt-12 lg:mt-0">
          <div className="relative w-full h-[280px] md:h-[650px] lg:h-[730px] lg:-mr-20 xl:-mr-40">
            <Image
              src="/banner-image.png"
              alt="Conexão Acadêmica"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain object-bottom lg:object-right-bottom"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
