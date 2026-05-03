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

const usuariosMock = [
  { login: "aluno", senha: "123", role: "aluno", nome: "João Silva" },
  { login: "coordenador", senha: "123", role: "coordenador", nome: "Prof. Carlos Eduardo" },
  { login: "gestor", senha: "123", role: "gestor", nome: "Secretaria Acadêmica" }
];

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

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const usuario = usuariosMock.find(
      (u) => u.login === login && u.senha === senha && u.role === perfil
    );

    if (usuario) {
      localStorage.setItem("usuarioLogado", JSON.stringify({
        nome: usuario.nome,
        role: usuario.role,
      }));

      if (usuario.role === "coordenador") {
        router.push("/coordenador/home");
      } else if (usuario.role === "gestor") {
        router.push("/gestor/home");
      } else if (usuario.role === "aluno") {
        router.push("/aluno/home"); 
      }
    } else {
      setIsAuthenticating(false);
      setErro("Dados incorretos. Verifique seu perfil, login ou senha.");
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
                  placeholder="Login" 
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