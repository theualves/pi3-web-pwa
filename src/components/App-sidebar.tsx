"use client"; // 1. Obrigatório para usar hooks de navegação

import { Home, Settings, User, Bell } from "lucide-react";
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

const items = [
  { title: "Visão Geral", url: "/home", icon: Home },
  { title: "Atividades", url: "/atividades", icon: Home },
  { title: "Estudante", url: "/estudante", icon: User },
  { title: "Relatórios", url: "/relatorios", icon: User },
];

export default function AppSidebar() {
  const pathname = usePathname();

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
