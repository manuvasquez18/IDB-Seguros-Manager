
'use client';

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
import { FormEvent, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !auth) return;

    setIsSubmitting(true);
    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement).value;

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Correo enviado",
        description: "Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.",
      });
    } catch (error: any) {
      console.error("Password Reset Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo enviar el correo de restablecimiento.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
        <div className="mb-4">
            <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Iniciar Sesión
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="grid gap-4">
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Correo de Recuperación"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
