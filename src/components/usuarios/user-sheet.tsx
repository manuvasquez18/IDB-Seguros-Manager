
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
import type { UserProfile } from "@/lib/definitions";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";


interface UserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserProfile;
}

export function UserSheet({ open, onOpenChange, user }: UserSheetProps) {
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!user;

  const handleSubmit = async (data: UserFormValues) => {
    if (!firestore || !auth) return;
    setIsSubmitting(true);

    try {
        if(isEditMode) {
            // Editing an existing user
            const userRef = doc(firestore, "users", user.id);
            const updatedProfile = {
                nombre: data.nombre,
                rol: data.rol,
                updated_at: new Date().toISOString(),
            };
            setDocumentNonBlocking(userRef, updatedProfile, { merge: true });
            toast({
                title: "Usuario Actualizado",
                description: `Los datos de ${data.nombre} han sido actualizados.`,
            });
        } else {
            // Creating a new user
            const { user: newUser } = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const userProfile: Omit<UserProfile, 'last_login' | 'avatar_url' | 'telefono'> = {
                id: newUser.uid,
                nombre: data.nombre,
                email: data.email,
                rol: data.rol,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            await setDoc(doc(firestore, "users", newUser.uid), userProfile);
            toast({
                title: "Usuario Creado",
                description: `El usuario ${data.nombre} ha sido registrado exitosamente.`,
            });
        }
        onOpenChange(false);
    } catch (error: any) {
      console.error("Error processing user:", error);
      toast({
        variant: "destructive",
        title: isEditMode ? "Error al actualizar" : "Error al crear usuario",
        description: error.message || "No se pudo completar la operación.",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</SheetTitle>
          <SheetDescription>
            {isEditMode 
                ? 'Actualiza los detalles del usuario. El email y la contraseña no se pueden cambiar aquí.'
                : 'Rellena los datos para registrar un nuevo usuario en el sistema.'
            }
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
            <UserForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                defaultValues={user}
                isEditMode={isEditMode}
            />
        </div>

      </SheetContent>
    </Sheet>
  );
}
