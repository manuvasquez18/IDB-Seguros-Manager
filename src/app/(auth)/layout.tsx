
import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        {children}
      </div>
      <div className="hidden bg-primary lg:flex items-center justify-center p-12">
        <div className="flex flex-col items-center justify-center h-full text-primary-foreground text-center">
            <Image
                src="https://citas.previmedicaidb.com/sia/assets/img/Logos-en-Vectores-DIAPO.png"
                alt="IDB Seguros Logo"
                width={250}
                height={100}
                className="mb-4 w-64 h-auto"
            />
            <h1 className="text-4xl font-bold mt-4">IDB Seguros Manager</h1>
            <p className="mt-4 text-lg">La solución integral para la gestión de seguros.</p>
        </div>
      </div>
    </div>
  );
}
