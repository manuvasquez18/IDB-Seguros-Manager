import type { ReactNode } from "react";
import { Building } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        {children}
      </div>
      <div className="hidden bg-primary lg:flex items-center justify-center">
        <div className="flex flex-col items-center justify-center h-full text-primary-foreground text-center p-12">
            <Building className="h-20 w-20 mb-4" />
            <h1 className="text-4xl font-bold">IDB Seguros Manager</h1>
            <p className="mt-4 text-lg">La solución integral para la gestión de seguros.</p>
        </div>
      </div>
    </div>
  );
}
