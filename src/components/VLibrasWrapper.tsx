"use client";

import { useEffect } from "react";

export default function VLibrasWrapper() {
  useEffect(() => {
    // 1. Trava de segurança: impede duplicação
    if (document.querySelector("[vw]")) return;

    // 2. Cria o elemento principal EXATAMENTE como o VLibras exige (sem divs extras em volta)
    const vwContainer = document.createElement("div");
    vwContainer.setAttribute("vw", "");
    vwContainer.className = "enabled";
    vwContainer.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    
    // Injeta direto no body
    document.body.appendChild(vwContainer);

    // 3. Injeta o script oficial do governo
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    
    script.onload = () => {
      // Quando o script baixar, liga o motor do avatar
      if (typeof window !== "undefined" && (window as any).VLibras) {
        new (window as any).VLibras.Widget("https://vlibras.gov.br/app");
      }
    };
    
    document.body.appendChild(script);
  }, []);

  // Continua retornando null para o React não enxergar a mutação
  return null;
}