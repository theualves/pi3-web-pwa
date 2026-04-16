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
        <Link href="/" className="text-xl">
          Contato
        </Link>
      </nav>
      </div>

      <div className="h-[6px] w-full bg-orange-500" />
    </header>
  );
}
