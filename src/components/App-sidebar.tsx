"use client";
import { useEffect, useState } from "react";
import { Home, Settings, User, Bell, BookOpen, FileCheck, Users} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = {
  coordenador: [
    { title: "Visão Geral", url: "/coordenador/home", icon: Home },
    { title: "Atividades", url: "/coordenador/atividades", icon: FileCheck },
    { title: "Estudantes", url: "/coordenador/estudante", icon: FileCheck },
    { title: "Relatórios", url: "/coordenador/relatorios", icon: BookOpen },
  ],
  gestor: [
    { title: "Visão Geral", url: "/gestor/home", icon: Home },
    { title: "Cursos", url: "/gestor/cursos", icon: BookOpen },
    { title: "Usuários", url: "/gestor/usuarios", icon: Users },
    { title: "Relatórios", url: "/gestor/relatorios", icon: FileCheck },
  ],
  aluno: [
    { title: "Visão Geral", url: "/aluno/home", icon: Home },
    { title: "Cursos", url: "/aluno/cursos", icon: Users },
    { title: "Solicitações", url: "/aluno/solicitacoes", icon: BookOpen },
  ],
};

export default function AppSidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
    setRole(user.role);
  }, []);

  const items = role ? links[role as keyof typeof links] : [];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex justify-center h-[64px] border-b border-sidebar-border/20">
        <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0 py-4">
          <SidebarGroupLabel className="px-6 mb-2">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="text-base rounded-none h-14 w-full font-semibold px-6 group-data-[collapsible=icon]:hidden"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
