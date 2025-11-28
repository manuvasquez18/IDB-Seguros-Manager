
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { ArrowRight } from "lucide-react";


export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.push("/seguros");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);


  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !auth) return;

    setIsSubmitting(true);
    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (event.currentTarget.elements.namedItem("password") as HTMLInputElement).value;
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle the redirect.
    } catch (error: any) {
      console.error("Login Error:", error);
       toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: error.message || "Por favor, comprueba tus credenciales.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full max-w-sm">
      <Image
        src="https://idbclinicas.com/wp-content/uploads/2017/09/IDB-clinicas-logo.png"
        alt="IDB Clínicas Logo"
        width={200}
        height={50}
        className="mb-4"
      />
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Accede a tu panel de control.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
      <footer className="text-center text-xs text-muted-foreground">
        <p>© Grupo de Clínicas IDB</p>
        <p>RIF: J-31045674-7, RIF: J-30372913-4, RIF: J-30988796-3</p>
      </footer>
    </div>
  );
}
