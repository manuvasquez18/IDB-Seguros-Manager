import type { ReactNode } from "react";
import AppSidebar from "@/components/app-sidebar";
import AppHeader from "@/components/app-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/40">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
