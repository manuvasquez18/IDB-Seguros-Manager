
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
import { onAuthStateChanged, User } from "firebase/auth";

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This state will hold the details from the form to be used by the auth state listener
  const [pendingUserDetails, setPendingUserDetails] = useState<{ email: string; firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    if (!auth || !firestore || !pendingUserDetails) return;

    // This effect runs when a user is successfully created by Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      // Check if there's a new user and if their email matches the one from the form
      if (user && user.email === pendingUserDetails.email) {
        
        // Create the user profile document in Firestore
        const userRef = doc(firestore, `users/${user.uid}`);
        setDocumentNonBlocking(userRef, {
            id: user.uid,
            nombre: `${pendingUserDetails.firstName} ${pendingUserDetails.lastName}`.trim(),
            email: user.email,
            rol: 'supervisor', // Default role
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }, { merge: true }); // Use merge to be safe
        
        // Clear the pending details to prevent this from running again
        setPendingUserDetails(null);
        
        // Redirect to the main app page
        router.push("/seguros");
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [auth, firestore, router, pendingUserDetails]);


  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;

    // Store form details to be used by the useEffect listener
    setPendingUserDetails({ email, firstName, lastName });
    
    // Initiate the non-blocking sign-up process.
    // The useEffect above will handle profile creation and redirection.
    initiateEmailSignUp(auth, email, password);
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

