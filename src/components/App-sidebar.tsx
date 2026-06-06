"use client";
import { useEffect, useState } from "react";
import {
  Home,
  Settings,
  User,
  Bell,
  BookOpen,
  FileCheck,
  Users,
} from "lucide-react";
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
  useSidebar, // 👈 Hook nativo do shadcn adicionado aqui
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

  // 1. Puxamos o controle de estado mobile do próprio shadcn
  const { setOpenMobile, isMobile } = useSidebar();

  // 2. Estados para capturar o movimento do dedo
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
    setRole(user.role);
  }, []);

  const items = role ? links[role as keyof typeof links] : [];

  // 3. Funções que calculam o deslize
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50; // Margem de segurança de 50px

    if (isLeftSwipe && isMobile) {
      setOpenMobile(false);
    }

    setTouchStartX(0);
    setTouchEndX(0);
  };

  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader className="flex justify-center h-[64px] border-b border-sidebar-border/20">
        <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
      </SidebarHeader>
      
      {/* 4. Eventos aplicados diretamente no conteúdo, sem criar divs extras! */}
      <SidebarContent
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
                      className={`text-sm rounded-none h-10 w-full px-4 transition-all 
            group-data-[collapsible=icon]:!w-full 
            group-data-[collapsible=icon]:!h-10 
            group-data-[collapsible=icon]:!p-0 
            group-data-[collapsible=icon]:justify-center
            ${isActive ? "font-semibold bg-[#F78C21] text-white" : "font-medium text-sidebar-foreground/70"}
          `}
                    >
                      {/* 5. UX Bônus: Fechar a barra se o aluno clicar no próprio link usando o celular */}
                      <Link href={item.url} onClick={() => isMobile && setOpenMobile(false)}>
                        <item.icon className="shrink-0 size-4" />
                        <span className="group-data-[collapsible=icon]:!hidden">
                          {item.title}
                        </span>
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