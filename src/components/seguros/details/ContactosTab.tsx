'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Contacto } from '@/lib/definitions';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GenericSubcollectionSheet } from './GenericSubcollectionSheet';
import { GenericSubcollectionTable } from './GenericSubcollectionTable';
import * as z from "zod";

interface ContactosTabProps {
  seguroId: string;
}

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  telefono: z.string().optional(),
  comentario: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: 'nombre' as const, label: 'Nombre del Contacto', type: 'text' as const, placeholder: 'Ej: Juan Pérez' },
  { name: 'telefono' as const, label: 'Teléfono', type: 'text' as const, placeholder: 'Ej: +58 414-1234567' },
  { name: 'comentario' as const, label: 'Comentario', type: 'textarea' as const, placeholder: 'Notas adicionales sobre el contacto' },
];

export function ContactosTab({ seguroId }: ContactosTabProps) {
  const firestore = useFirestore();
  const { profile } = useUserProfile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Contacto | undefined>(undefined);

  const subcollectionPath = `seguros/${seguroId}/contactos`;

  const itemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, subcollectionPath);
  }, [firestore, subcollectionPath]);

  const { data: items, isLoading } = useCollection<Contacto>(itemsQuery);

  const canCreate = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canEdit = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canDelete = profile?.rol === 'admin';

  const handleAdd = () => {
    if (!canCreate) return;
    setSelectedItem(undefined);
    setSheetOpen(true);
  };

  const handleEdit = (item: Contacto) => {
    if (!canEdit) return;
    setSelectedItem(item);
    setSheetOpen(true);
  };
  
  const tableColumns = [
    { key: 'nombre' as const, header: 'Nombre' },
    { key: 'telefono' as const, header: 'Teléfono', className: 'hidden md:table-cell' },
    { key: 'comentario' as const, header: 'Comentario', className: 'hidden lg:table-cell' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Contactos</CardTitle>
          <CardDescription>Personas de contacto para esta póliza.</CardDescription>
        </div>
        {canCreate && (
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Contacto
          </Button>
        )}
      </CardHeader>
      <CardContent>
         <GenericSubcollectionTable<Contacto>
            items={items}
            isLoading={isLoading}
            columns={tableColumns}
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={canDelete ? 'firestore' : undefined}
            subcollectionPath={subcollectionPath}
            emptyMessage="No se encontraron contactos."
        />
        {canCreate && (
          <GenericSubcollectionSheet<FormValues>
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            subcollectionPath={subcollectionPath}
            formSchema={formSchema}
            formFields={formFields}
            selectedItem={selectedItem}
            sheetTitle={selectedItem ? "Editar Contacto" : "Añadir Nuevo Contacto"}
            sheetDescription={selectedItem ? "Actualiza los detalles del contacto." : "Rellena los datos para registrar un nuevo contacto."}
          />
        )}
      </CardContent>
    </Card>
  );
}
