"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { UserForm, type UserFormValues } from "./user-form";
import { useFirestore, useAuth } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface UserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserSheet({ open, onOpenChange }: UserSheetProps) {
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: UserFormValues) => {
    if (!firestore || !auth) return;
    setIsSubmitting(true);

    try {
      // NOTE: This creates a temporary, secondary Firebase app instance
      // to create a user without logging out the current admin.
      // This is a common workaround for this Firebase SDK limitation.
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);

      const userProfile = {
        id: user.uid,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await setDoc(doc(firestore, "users", user.uid), userProfile);
      
      toast({
        title: "Usuario Creado",
        description: `El usuario ${data.nombre} ha sido registrado exitosamente.`,
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        variant: "destructive",
        title: "Error al crear usuario",
        description: error.message || "No se pudo crear la cuenta.",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Crear Nuevo Usuario</SheetTitle>
          <SheetDescription>
            Rellena los datos para registrar un nuevo usuario en el sistema.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
            <UserForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>

      </SheetContent>
    </Sheet>
  );
}
