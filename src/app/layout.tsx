import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Urbanist } from "next/font/google";
import VLibrasWrapper from "@/components/VLibrasWrapper";
import UserWayWrapper from "@/components/UserWayWrapper";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Senac Horas+",
  description: "Gestão de Horas Complementares",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#004A8D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      className={cn("font-urbanist", urbanist.variable)}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
         <VLibrasWrapper />
         <UserWayWrapper />
      </body>
    </html>
  );
}
