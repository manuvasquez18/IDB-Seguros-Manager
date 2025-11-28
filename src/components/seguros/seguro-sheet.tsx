
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SeguroForm, type SeguroFormValues } from "./seguro-form";
import type { Seguro } from "@/lib/definitions";
import { useUser, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { v4 as uuidv4 } from 'uuid';


interface SeguroSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seguro?: Seguro;
}

export function SeguroSheet({ open, onOpenChange, seguro }: SeguroSheetProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const isEditMode = !!seguro;

  const handleSubmit = (data: SeguroFormValues) => {
    if (!firestore || !user?.uid) return;
    
    const seguroId = isEditMode ? seguro.id : uuidv4();
    const docRef = doc(firestore, `users/${user.uid}/seguros`, seguroId);

    const dataToSave = {
        ...data,
        id: seguroId,
    };
    
    setDocumentNonBlocking(docRef, dataToSave, { merge: isEditMode });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Editar Seguro" : "Añadir Nuevo Seguro"}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Actualiza los detalles de la póliza de seguro."
              : "Rellena los datos para registrar una nueva póliza de seguro."}
          </SheetDescription>
        </SheetHeader>
        
        <SeguroForm
          onSubmit={handleSubmit}
          defaultValues={seguro}
          isEditMode={isEditMode}
        />

      </SheetContent>
    </Sheet>
  );
}
