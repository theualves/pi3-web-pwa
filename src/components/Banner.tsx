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
    <section className="w-full bg-gradient-to-b from-[#FFFFFF] to-[#CACACA] overflow-hidden min-h-[500px] lg:min-h-[700px] flex">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-stretch">
        <div className="w-full lg:w-1/3 text-white flex flex-col justify-center items-center text-center lg:items-start lg:text-left py-12 z-10">
          <h1
            className={`flex flex-col items-center lg:items-start mb-6 uppercase text-[#005594] tracking-wide ${anton.className}`}
          >
            <span className="text-4xl md:text-5xl lg:text-5xl leading-none">
              CONEXÃO ACADÊMICA
            </span>
            <span className="text-[#FFDE59] bg-[#5B89A6] text-5xl md:text-6xl lg:text-8xl mt-2 md:mt-2 leading-none w-fit px-4 py-2">
              INTELIGENTE
            </span>
          </h1>
          <p
            className={`text-lg md:text-xl text-[#656565] mb-10 max-w-lg mx-auto lg:mx-0 ${openSans.className}`}
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

        <div className="w-full  relative flex items-end justify-center lg:justify-end mt-8 lg:mt-0">
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[650px] lg:-mr-20 xl:-mr-40">
            <Image
              src="/image-banner.png"
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
