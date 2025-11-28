
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function AppHeader() {
  const { user } = useUser();
  const auth = useAuth();
  const { profile } = useUserProfile();
  const router = useRouter();

  const handleLogout = () => {
    if (auth) {
        auth.signOut().then(() => {
          router.push('/login');
        });
    }
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-30">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="w-full flex-1">
        {/* Search bar removed from here */}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{profile?.nombre || user?.email || 'Mi Cuenta'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">Configuración</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Soporte</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
