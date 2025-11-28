
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
import { useAuth, initiateEmailSignUp } from "@/firebase";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";

export default function RegisterPage() {
  const auth = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth) return;

    // This listener will simply redirect the user once they are logged in.
    // The user profile creation is now handled by a server-side Cloud Function.
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // User is signed in, redirect to the main app.
        router.push("/seguros");
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [auth, router]);


  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !auth) return;

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // Initiate the sign-up process.
    // The onAuthStateChanged listener will handle redirection upon success.
    initiateEmailSignUp(auth, email, password);

    // No need to manually set isSubmitting to false, as the redirect will unmount the component.
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Regístrate</CardTitle>
        <CardDescription>
          Ingresa tu información para crear una cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Nombre</Label>
              <Input id="first-name" name="first-name" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Apellido</Label>
              <Input id="last-name" name="last-name" placeholder="Robinson" required />
            </div>
          </div>
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
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Crear una cuenta"}
          </Button>
          <Button variant="outline" className="w-full" disabled>
            Registrarse con Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="underline">
            Inicia Sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
