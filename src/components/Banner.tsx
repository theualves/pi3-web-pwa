import Image from "next/image";

export default function Banner() {
  return (
    <section className="relative w-full h-[260px] flex flex-col justify-end pb-8">
      <Image
        src="/banner.png"
        alt="Banner"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="relative z-10 px-6 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold text-white ">
          Gerencie Atividades Complementares
        </h1>
      </div>
    </section>
  );
}
