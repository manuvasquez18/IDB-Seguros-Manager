
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
import { useAuth, initiateEmailSignUp, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '', firstName: '', lastName: '' });

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;

    setFormValues({ email, password, firstName, lastName });
    setIsSubmitting(true);
    
    // Non-blocking call to Firebase Auth
    initiateEmailSignUp(auth, email, password);
  };
  
  useEffect(() => {
    if (!auth || !firestore || !isSubmitting) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // We only want to act when the user is created and matches the form submission
      if (user && user.email === formValues.email) {
        
        // Create user profile document in Firestore
        const userRef = doc(firestore, `users/${user.uid}`);
        setDocumentNonBlocking(userRef, {
            id: user.uid,
            nombre: `${formValues.firstName} ${formValues.lastName}`.trim() || user.email?.split('@')[0],
            email: user.email,
            rol: 'supervisor', // Assign supervisor role
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }, { merge: true });
        
        // The custom claim logic is removed. We rely on the Firestore document now.
        // A short delay helps ensure the Firestore write has initiated before redirecting.
        setTimeout(() => {
            router.push("/seguros");
            // No need to reset submission state here, as we are navigating away.
        }, 1000); 
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [auth, firestore, router, isSubmitting, formValues]);


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
