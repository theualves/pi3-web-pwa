"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RedefinirSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Pega o ?token= da URL

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Valida o token assim que a tela abre
  useEffect(() => {
    const validarToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/auth/validar-token?token=${token}`);
        const data = await response.json();

        if (data.valid) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        setIsTokenValid(false);
      }
    };

    validarToken();
  }, [token]);

  // Envia a nova senha
  const handleRedefinir = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem. Digite novamente.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/redefinir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });

      if (!response.ok) {
        throw new Error("Erro ao redefinir a senha");
      }

      setMensagem("Senha redefinida com sucesso! Redirecionando para o login...");
      
      // Manda pro login após 2 segundos
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (error) {
      setErro("Não foi possível redefinir a senha. O link pode ter expirado.");
    } finally {
      setIsLoading(false);
    }
  };

  // Se ainda estiver checando o token
  if (isTokenValid === null) {
    return (
      <div className="bg-[#004A8D] flex flex-col w-full min-h-screen items-center justify-center">
        <p className="text-white">Validando link de segurança...</p>
      </div>
    );
  }

  // Se o token for inválido ou não existir na URL
  if (isTokenValid === false) {
    return (
      <div className="bg-[#004A8D] flex flex-col w-full min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-slate-200 text-center p-6">
          <h2 className="text-xl font-bold text-red-600 mb-2">Link Inválido ou Expirado</h2>
          <p className="text-slate-600 mb-6">
            Este link de recuperação não é mais válido. Por favor, solicite um novo link.
          </p>
          <Button asChild variant="senac" className="w-full h-12 text-md">
            <Link href="/esqueci-senha">Solicitar novo link</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Se o token for válido, mostra o formulário
  return (
    <div className="bg-[#004A8D] flex flex-col w-full min-h-screen relative">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-slate-200">
          <CardHeader className="flex flex-col items-center justify-center text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={140}
                height={140}
                style={{ width: "140px", height: "auto" }}
                priority
              />
            </div>
            <CardTitle>Criar Nova Senha</CardTitle>
            <CardDescription>
              Digite sua nova senha abaixo. Evite usar senhas antigas.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRedefinir} className="space-y-4 flex flex-col">
              
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <Input 
                  type="password"
                  placeholder="Nova senha" 
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                  className="h-12" 
                />
                <Input 
                  type="password"
                  placeholder="Confirme a nova senha" 
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className="h-12" 
                />
              </div>

              {mensagem && (
                <div className="p-3 text-sm text-center text-green-700 bg-green-50 border border-green-100 rounded-md">
                  {mensagem}
                </div>
              )}
              {erro && (
                <div className="p-3 text-sm text-center text-red-700 bg-red-50 border border-red-100 rounded-md">
                  {erro}
                </div>
              )}

              <Button 
                type="submit" 
                variant="senac" 
                className="mt-4 h-12 text-md" 
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Redefinir senha"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}