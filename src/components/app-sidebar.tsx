
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
    auth.signOut().then(() => {
      router.push('/login');
    });
  };

  const userCanView = (itemRoles: string[]) => {
    if (!profile || !profile.rol) return false;
    return itemRoles.includes(profile.rol);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex bg-[--sidebar-background] text-[--sidebar-foreground]">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
             <Image 
              src="https://citasprevimedicaidb.com/sia/assets/img/Logos-en-Vectores-DIAPO.png"
              alt="IDB Previmédica Logo"
              width={36}
              height={36}
              className="h-9 w-9 transition-all group-hover:scale-110"
            />
            <span className="sr-only">IDB Seguros</span>
          </Link>

          {menuItems.map((item) => (
            userCanView(item.roles) && (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${pathname.startsWith(item.href) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
           <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Cerrar Sesión</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Cerrar Sesión</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
