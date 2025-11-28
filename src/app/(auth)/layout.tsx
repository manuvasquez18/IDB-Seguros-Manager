
import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            data-ai-hint="logo"
            src="https://idbclinicas.com/wp-content/uploads/2017/09/IDB-clinicas-logo.png"
            alt="Image"
            width="192"
            height="54"
            className="h-auto w-48 object-contain"
          />
        </div>
        {children}
      </div>
      <footer className="absolute bottom-4 text-center text-xs text-muted-foreground w-full px-4">
        <p>© Grupo de Clínicas IDB, RIF: J-31045674-7, RIF: J-30372913-4, RIF: J-30988796-3</p>
      </footer>
    </div>
  );
}
