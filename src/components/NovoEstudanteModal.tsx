"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NovoEstudanteModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="senac">Adicionar Estudante</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-800">Cadastrar aluno</DialogTitle>
        </DialogHeader>

        <div className="gap-4 py-4 grid">
          <div className="gap-4">
            <Label htmlFor="nome" className="text-right text-slate-600 mb-2">Nome</Label>
            <Input id="nome" />
          </div>
          <div>
            <Label htmlFor="email" className="text-right text-slate-600 mb-2">Email</Label>
            <Input id="email" />
          </div>
          <div>
            <Label htmlFor="curso" className="text-right text-slate-600 mb-2">Curso</Label>
            <Input id="curso" />
          </div>
           <div>
            <Label htmlFor="periodo" className="text-right text-slate-600 mb-2">Periodo</Label>
            <Input id="periodo" />
          </div>
          <div>
            <Label htmlFor="ch" className="text-right text-slate-600 mb-2">Carga horária exigida</Label>
            <Input id="ch" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="senac" type="submit">Cadastrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
