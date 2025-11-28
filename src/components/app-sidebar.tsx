
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Building,
  User,
} from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";


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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-[220px] flex-col border-r bg-sidebar text-sidebar-foreground sm:flex">
        <div className="flex h-20 items-center justify-center px-4 mb-4">
             <Link href="/seguros">
                 <Image 
                  src="https://lh3.googleusercontent.com/d/1sIw-gKnfRYk5B4-KJCiKUW4iq-TSKHPu"
                  alt="IDB Clinicas Logo"
                  width={220}
                  height={68}
                  className="object-contain"
                  priority
                />
             </Link>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              userCanView(item.roles) && (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
    </aside>
  );
}
