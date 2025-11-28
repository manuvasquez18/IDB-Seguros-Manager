
import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="w-full">{children}</div>
        <footer className="absolute bottom-4 text-center text-xs text-muted-foreground w-full px-4">
          <p>© Grupo de Clínicas IDB, RIF: J-31045674-7, RIF: J-30372913-4, RIF: J-30988796-3</p>
        </footer>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          data-ai-hint="logo"
          src="https://idbclinicas.com/wp-content/uploads/2017/09/IDB-clinicas-logo.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-contain p-20"
        />
      </div>
    </div>
  );
}
