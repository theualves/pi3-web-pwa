import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#014A8E] flex flex-col w-full px-4 py-6">
      <div className="max-w-[1500px] mx-auto w-full">
        <Image
          src="/logo-white.png"
          alt="Logo"
          width={140}
          height={140}
          style={{ width: "140px", height: "auto" }}
        />
      </div>
    </footer>
  );
}
