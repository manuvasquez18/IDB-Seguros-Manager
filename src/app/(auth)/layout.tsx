
import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted/40 p-4">
      {children}
    </div>
  );
}
