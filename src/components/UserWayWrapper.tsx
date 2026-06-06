"use client";

import { useEffect } from "react";

export default function UserWayWrapper() {
  useEffect(() => {
    // 1. Trava de segurança: impede que o React duplique o widget
    if (document.getElementById("userway-script")) return;

    // 2. Cria e configura o script oficial do UserWay
    const script = document.createElement("script");
    script.id = "userway-script";
    
    // 👇 Substitua pelo seu ID
    script.setAttribute("data-account", "ELpy0GsUYO"); 
    script.setAttribute("data-position", "5"); // 2 = Middle Right
    
    // Configuração para forçar a posição no Centro-Esquerda (espelhando o VLibras)
    
    script.src = "https://cdn.userway.org/widget.js";
    script.async = true;

    // 3. Injeta silenciosamente no corpo da página
    document.body.appendChild(script);
  }, []);

  // O componente retorna null para evitar conflitos com o Virtual DOM do Next.js
  return null;
}