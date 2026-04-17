import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Login() {
  return (
    <div className="bg-[#004A8D] flex flex-col w-full min-h-screen">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-slate-200">
          <CardHeader className="flex flex-col items-center justify-center text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
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
            <form className="space-y-4 flex flex-col">
              <div>
                <Select>
                  <SelectTrigger className="w-full h-12 text-base text-slate-600">
                    <SelectValue placeholder="Selecione seu perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="coordernador">Coordenador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input id="login" placeholder="Login" className="h-12" />
              </div>

              <div>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Senha"
                  className="h-12"
                />
              </div>

              <Button variant="senac" className="w-full h-12 mt-4 text-lg" asChild>
                <Link href="/home">
                  Entrar
                </Link>
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
