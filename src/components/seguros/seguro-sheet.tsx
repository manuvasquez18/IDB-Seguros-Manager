
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SeguroForm, type SeguroFormValues } from "./seguro-form";
import type { Seguro } from "@/lib/definitions";
import { useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { v4 as uuidv4 } from 'uuid';


interface SeguroSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seguro?: Seguro;
}

export function SeguroSheet({ open, onOpenChange, seguro }: SeguroSheetProps) {
  const firestore = useFirestore();

  const isEditMode = !!seguro;

  const handleSubmit = (data: SeguroFormValues) => {
    if (!firestore) return;
    
    const seguroId = isEditMode ? seguro.id : uuidv4();
    // Reference the document in the root 'seguros' collection
    const docRef = doc(firestore, `seguros`, seguroId);

    const dataToSave: Seguro = {
      ...data,
      id: seguroId,
      nombre: data.nombre,
      estatus: data.estatus,
      tipo_seguro: data.tipo_seguro,
      updated_at: new Date().toISOString(),
      ...(isEditMode ? { created_at: seguro.created_at } : { created_at: new Date().toISOString() }),
    };
    
    setDocumentNonBlocking(docRef, dataToSave, { merge: isEditMode });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
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
