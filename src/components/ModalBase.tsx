import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  submitText?: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode; //os inputs específicos de cada tela
}

export function ModalBase({
  isOpen,
  onClose,
  title,
  description,
  icon,
  submitText = "Salvar",
  onSubmit,
  children,
}: ModalBaseProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-bold text-2xl text-[#004A8D]">
            {icon && icon}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-slate-500">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <form
          id="form-modal-generico"
          onSubmit={onSubmit}
          className="grid gap-6 py-4"
        >
          {children}
        </form>

        <DialogFooter className="flex justify-between sm:justify-between w-full border-t border-slate-100 pt-4 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-slate-500"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            form="form-modal-generico"
            className="bg-[#F28322] hover:bg-[#D9751E] text-white"
          >
            {submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
