"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Shield,
  Users,
  BookUser,
  Mail,
  UserCog,
  MessageSquare,
  File,
  Settings,
  LogOut,
  Building,
} from "lucide-react";
import { useAuth } from "@/firebase";

const menuItems = [
  { href: "/seguros", label: "Seguros", icon: Shield },
  { href: "/colectivos", label: "Colectivos", icon: Users },
  { href: "/contactos", label: "Contactos", icon: BookUser },
  { href: "/correos", label: "Correos", icon: Mail },
  { href: "/usuarios", label: "Usuarios de Portal", icon: UserCog },
  { href: "/popups", label: "Popups", icon: MessageSquare },
  { href: "/archivos", label: "Archivos", icon: File },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const auth = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Building className="w-8 h-8 text-sidebar-foreground" />
          <h1 className="text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            IDB Seguros
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                tooltip={{children: item.label, side: "right"}}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{children: "Configuración", side: "right"}}>
              <Link href="/settings">
                <Settings />
                <span>Configuración</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} asChild tooltip={{children: "Cerrar Sesión", side: "right"}}>
              <Link href="/login">
                <LogOut />
                <span>Cerrar Sesión</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
