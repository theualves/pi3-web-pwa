import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import AppSidebar from "@/components/App-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {/* 1. A Sidebar agora será auto-suficiente e cuidará do seu próprio botão */}
      <AppSidebar />

      {/* 2. Área principal de conteúdo */}
      <main className="flex-1 flex flex-col w-full min-h-screen">
        <div className="border-b border-slate-200 bg-white flex items-center min-h-[64px]">
          <Header isLoggedIn={true} />
        </div>

        <div className="p-6 flex-1 w-full max-w-[1220px] mx-auto">
          {children}
        </div>

        <footer className="bg-[#0165AA] text-white py-4 text-center text-sm">
          <p>© {new Date().getFullYear()} - Todos os direitos reservados</p>
        </footer>
      </main>
    </SidebarProvider>
  );
}
