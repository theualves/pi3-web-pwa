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
  
  // Novos estados para a integração
  const [identificador, setIdentificador] = useState(""); // Matrícula, ID ou Identificação
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Limpa os campos quando o usuário troca de perfil
  const handleTrocarPerfil = (value: string) => {
    setPerfil(value);
    setIdentificador("");
    setEmail("");
    setErro("");
    setMensagem("");
  };

  // Função que envia os dados para o backend na porta 3001
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
      const response = await fetch("http://localhost:3001/api/auth/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // O backend pediu apenas o email no JSON, então enviamos apenas ele
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Erro ao solicitar recuperação");
      }

      setMensagem("Se os dados estiverem corretos, um link de recuperação foi gerado!");
      setIdentificador("");
      setEmail("");
    } catch (error) {
      setErro("Não foi possível processar a solicitação no momento.");
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
              
              {/* O bug do SelectTrigger foi corrigido aqui */}
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

              {perfil === "aluno" && (
                <div className="space-y-4">
                  <Input 
                    placeholder="Matrícula" 
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    required
                    className="h-12" 
                  />
                  <Input 
                    placeholder="Email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12" 
                  />
                </div>
              )}

              {perfil === "coordenador" && ( // Corrigido erro de digitação de "coordernador"
                <div className="space-y-4">
                  <Input 
                    placeholder="ID do coordenador" 
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    required
                    className="h-12" 
                  />
                  <Input 
                    placeholder="Email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12" 
                  />
                </div>
              )}

              {perfil === "gestor" && (
                <div className="space-y-4">
                  <Input 
                    placeholder="Identificação administrativa" 
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    required
                    className="h-12" 
                  />
                  <Input 
                    placeholder="Email" 
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

              {/* Link para voltar para o login */}
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