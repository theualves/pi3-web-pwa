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
      <AppSidebar />

      <main className="flex-1 flex flex-col w-full min-h-screen bg-[#F7F7FB]">
        <div className="border-b border-slate-200 bg-white flex items-center min-h-[64px]">
          <Header isLoggedIn={true} />
        </div>

        <div className="p-6 flex-1 w-full max-w-[1400px] mx-auto ">
          {children}
        </div>
//#0165AA
        <footer className="bg-[#003D86] text-white py-4 text-center text-sm">
          <p>© {new Date().getFullYear()} - Todos os direitos reservados</p>
        </footer>
      </main>
    </SidebarProvider>
  );
}
