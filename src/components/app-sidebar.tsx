
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Building,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";


const menuItems = [
  { href: "/seguros", label: "Seguros", icon: Building, roles: ['admin', 'supervisor', 'usuario'] },
  { href: "/usuarios", label: "Usuarios", icon: User, roles: ['admin', 'supervisor'] },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { profile } = useUserProfile();
  const router = useRouter();


  const handleLogout = () => {
    if(!auth) return;
    auth.signOut().then(() => {
      router.push('/login');
    });
  };

  const userCanView = (itemRoles: string[]) => {
    if (!profile || !profile.rol) return true; // Show all for now if no profile
    return itemRoles.includes(profile.rol);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-[280px] flex-col border-r bg-background sm:flex bg-[--sidebar-background] text-[--sidebar-foreground]">
        <div className="flex flex-col gap-2 p-4">
          <div className="flex h-16 items-center justify-center px-6 mb-4">
             <Link href="/seguros">
                 <Image 
                  src="https://citasprevimedicaidb.com/sia/assets/img/Logos-en-Vectores-DIAPO.png"
                  alt="IDB Previmédica Logo"
                  width={200}
                  height={50}
                  className="object-contain"
                />
             </Link>
          </div>
          
          <nav className="flex flex-col gap-2 px-4">
            {menuItems.map((item) => (
              userCanView(item.roles) && (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent ${pathname.startsWith(item.href) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
        <nav className="mt-auto flex flex-col gap-2 p-4">
              <Link
                href="/settings"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sidebar-foreground/80 hover:text-sidebar-foreground`}
              >
                <Settings className="h-5 w-5" />
                 <span>Configuración</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-sidebar-foreground"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
        </nav>
    </aside>
  );
}

    