import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* Suas outras configurações do Next.js podem continuar aqui dentro normalmente */
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Mantém o cache desligado no localhost!
  register: true,
  skipWaiting: true,
})(nextConfig);