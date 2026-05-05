"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Loading from "@/components/Loading";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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

export default function Login() {
  const router = useRouter();
  
  const [perfil, setPerfil] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!perfil) {
      setErro("Por favor, selecione o seu perfil.");
      return;
    }

    setIsAuthenticating(true);

    try {
      // Fazendo a requisição real para o backend
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // O backend espera "email", então mapeamos o estado "login" para "email"
        body: JSON.stringify({ email: login, senha }), 
      });

      if (!response.ok) {
        setIsAuthenticating(false);
        setErro("Dados incorretos. Verifique seu login ou senha.");
        return;
      }

      // Recebendo e formatando os dados da API
      const data = await response.json();
      const usuario = data.usuario;
      const perfilBackend = usuario.tipo.toLowerCase(); // Ex: "GESTOR" vira "gestor"

      // Opcional: Valida se o perfil que o usuário escolheu no Select bate com o do banco de dados
      if (perfil !== perfilBackend) {
        setIsAuthenticating(false);
        setErro(`O perfil selecionado está incorreto. Este usuário é um(a) ${perfilBackend}.`);
        return;
      }

      // Salvando no localStorage para o Sidebar e o Header lerem
      localStorage.setItem("usuarioLogado", JSON.stringify({
        id: usuario.id,
        nome: usuario.nome,
        role: perfilBackend,
      }));

      // Redirecionamento dinâmico baseado no banco de dados
      if (perfilBackend === "coordenador") {
        router.push("/coordenador/home");
      } else if (perfilBackend === "gestor") {
        router.push("/gestor/home");
      } else {
        router.push("/aluno/home"); 
      }

    } catch (error) {
      console.error("Erro ao comunicar com a API:", error);
      setIsAuthenticating(false);
      setErro("Erro de conexão com o servidor. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="bg-[#004A8D] flex flex-col w-full min-h-screen relative">
      
      {isAuthenticating && <Loading />}

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
            <CardTitle>Informe seus dados para prosseguir</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4 flex flex-col">
              <div>
                <Select onValueChange={setPerfil} required disabled={isAuthenticating}>
                  <SelectTrigger className="w-full h-12 text-base text-slate-600">
                    <SelectValue placeholder="Selecione seu perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="coordenador">Coordenador</SelectItem> 
                    <SelectItem value="gestor">Gestor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input 
                  id="login" 
                  placeholder="Login (E-mail)" 
                  className="h-12" 
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                  disabled={isAuthenticating}
                />
              </div>

              <div>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Senha"
                  className="h-12"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={isAuthenticating}
                />
              </div>

              {erro && (
                <div className="text-sm text-red-600 font-medium text-center bg-red-50 border border-red-100 p-2 rounded-md">
                  {erro}
                </div>
              )}

              <Button type="submit" variant="senac" className="w-full h-12 mt-4 text-lg" disabled={isAuthenticating}>
                Entrar
              </Button>

              <Link
                href="/esqueci-senha"
                className="text-sm text-center block text-[#004A8D] hover:underline mt-2"
              >
                Esqueci minha senha
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}