import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({ subsets: ["latin"], variable: '--font-urbanist'  });
const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br" className={cn("font-urbanist", urbanist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
