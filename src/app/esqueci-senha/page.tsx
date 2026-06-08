"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function EsqueciSenha() {
  const [perfil, setPerfil] = useState<string>("");
  
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTrocarPerfil = (value: string) => {
    setPerfil(value);
    setEmail("");
    setErro("");
    setMensagem("");
  };

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!email) {
      setErro("Por favor, preencha o e-mail.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://api-horas-complementares.onrender.com/api/auth/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Lemos o JSON de resposta para pegar as mensagens exatas do backend
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao solicitar recuperação");
      }

      setMensagem("Se os dados estiverem corretos, um link de recuperação foi enviado para o seu e-mail!");
      setEmail("");
    } catch (error: any) {
      // Exibe "Usuário não encontrado" ou erros de servidor
      setErro(error.message || "Não foi possível processar a solicitação no momento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#004A8D] flex flex-col w-full min-h-screen">
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
            <CardTitle>Informações para recuperação de acesso</CardTitle>
            <CardDescription>
              Um link para redefinição de senha será enviado para o seu e-mail
              cadastrado no sistema. <br />
              <br /> Caso não receba o e-mail, verifique sua caixa de spam ou
              entre em contato com a secretaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            <form onSubmit={handleRecuperar} className="space-y-4 flex flex-col">
              
              <Select onValueChange={handleTrocarPerfil}>
                <SelectTrigger className="w-full h-12 text-base text-slate-600">
                  <SelectValue placeholder="Selecione seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluno">Aluno</SelectItem>
                  <SelectItem value="coordenador">Coordenador</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                </SelectContent>
              </Select>

              {/* 👉 O código ficou muito mais enxuto aqui! */}
              {perfil && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <Input 
                    placeholder="E-mail cadastrado" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12" 
                  />
                </div>
              )}

              {/* Mensagens de Sucesso e Erro */}
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
                disabled={!perfil || isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar link"}
              </Button>

              <Link
                href="/"
                className="text-sm text-center block text-[#004A8D] hover:underline mt-4"
              >
                Voltar para o Login
              </Link>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}