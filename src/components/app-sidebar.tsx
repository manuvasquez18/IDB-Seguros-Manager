
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Building,
  User,
} from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { cn } from "@/lib/utils";


const menuItems = [
  { href: "/seguros", label: "Seguros", icon: Building, roles: ['admin', 'supervisor', 'usuario'] },
  { href: "/usuarios", label: "Usuarios", icon: User, roles: ['admin'] },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { profile } = useUserProfile();

  const userCanView = (itemRoles: string[]) => {
    if (!profile || !profile.rol) return true; // Show all for now if no profile
    return itemRoles.includes(profile.rol);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-[220px] flex-col border-r bg-card sm:flex">
        <div className="flex h-20 items-center justify-center px-6">
             <Link href="/seguros" className="flex items-center gap-2 font-semibold">
                 <Image 
                  src="https://idbclinicas.com/wp-content/uploads/2017/09/IDB-clinicas-logo.png"
                  alt="IDB Clinicas Logo"
                  width={120}
                  height={34}
                  className="object-contain"
                  priority
                />
             </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-4 text-sm font-medium">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                userCanView(item.roles) && (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary",
                      isActive && "bg-muted text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              );
            })}
          </nav>
        </div>
    </aside>
  );
}
