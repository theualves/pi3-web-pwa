"use client";
import { useState } from "react";
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

export default function EsqueciSenha() {
  const [perfil, setPerfil] = useState<string>("");

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
            <form className="space-y-4 flex flex-col">
              <Select onValueChange={(value) => setPerfil(value)}>
                <SelectTrigger className="w-full h-12 text-base text-slate-600">
                  <SelectValue placeholder="Selecione seu perfil"></SelectValue>
                  <SelectContent>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="coordernador">Coordenador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                  </SelectContent>
                </SelectTrigger>
              </Select>

              {perfil === "aluno" && (
                <div className="space-y-4">
                  <Input placeholder="Matricula" className="h-12" />
                  <Input placeholder="Email" type="email" className="h-12" />
                </div>
              )}

              {perfil === "coordernador" && (
                <div className="space-y-4">
                  <Input placeholder="ID do coordenador" className="h-12" />
                  <Input placeholder="Email" type="email" className="h-12" />
                </div>
              )}

              {perfil === "gestor" && (
                <div className="space-y-4">
                  <Input placeholder="Identificação administrativa" className="h-12" />
                  <Input placeholder="Email" type="email" className="h-12" />
                </div>
              )}

              <Button variant="senac" className="mt-4" disabled={!perfil}>
                Enviar link
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
