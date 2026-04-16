import Link from 'next/link';
import Image from "next/image"; 

export default function Header() {
  return (
    <header className="flex flex-col w-full bg-[#f2f2f2]">
      <div className='max-w-[1500px] mx-auto w-full flex p-4 justify-between items-center'>
      <div className=''>
        <Image src="/logo.png" alt="Logo" width={80} height={80} />
      </div>

      <nav className="flex items-center">
        <Link href="https://www.pe.senac.br/contato/" className="text-xl text-[#014A8E] hover:text-orange-500 transition-all duration-300 ease-in-out">
          Contato
        </Link>
      </nav>
      </div>

      <div className="h-[6px] w-full bg-orange-500" />
    </header>
  );
}
