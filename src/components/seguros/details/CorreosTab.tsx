'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Correo } from '@/lib/definitions';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GenericSubcollectionSheet } from './GenericSubcollectionSheet';
import { GenericSubcollectionTable } from './GenericSubcollectionTable';
import * as z from "zod";

interface CorreosTabProps {
  seguroId: string;
  isActive: boolean;
}

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  correo: z.string().email("Debe ser un correo electrónico válido."),
  comentario: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: 'nombre' as const, label: 'Nombre / Departamento', type: 'text' as const, placeholder: 'Ej: Dpto. de Reclamos' },
  { name: 'correo' as const, label: 'Correo Electrónico', type: 'email' as const, placeholder: 'ejemplo@seguro.com' },
  { name: 'comentario' as const, label: 'Comentario', type: 'textarea' as const, placeholder: 'Notas adicionales sobre este correo' },
];

export function CorreosTab({ seguroId, isActive }: CorreosTabProps) {
  const firestore = useFirestore();
  const { profile } = useUserProfile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Correo | undefined>(undefined);

  const subcollectionPath = `seguros/${seguroId}/correos`;

  const itemsQuery = useMemoFirebase(() => {
    if (!firestore || !isActive) return null;
    return collection(firestore, subcollectionPath);
  }, [firestore, subcollectionPath, isActive]);

  const { data: items, isLoading } = useCollection<Correo>(itemsQuery);

  const canCreate = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canEdit = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canDelete = profile?.rol === 'admin';

  const handleAdd = () => {
    if (!canCreate) return;
    setSelectedItem(undefined);
    setSheetOpen(true);
  };

  const handleEdit = (item: Correo) => {
    if (!canEdit) return;
    setSelectedItem(item);
    setSheetOpen(true);
  };
  
  const tableColumns = [
    { key: 'nombre' as const, header: 'Nombre / Depto.' },
    { key: 'correo' as const, header: 'Correo Electrónico' },
    { key: 'comentario' as const, header: 'Comentario', className: 'hidden md:table-cell' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Correos Electrónicos</CardTitle>
          <CardDescription>Direcciones de correo relevantes para esta póliza.</CardDescription>
        </div>
        {canCreate && (
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Correo
          </Button>
        )}
      </CardHeader>
      <CardContent>
         <GenericSubcollectionTable<Correo>
            items={items}
            isLoading={isLoading && isActive}
            columns={tableColumns}
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={canDelete ? 'firestore' : undefined}
            subcollectionPath={subcollectionPath}
            emptyMessage="No se encontraron correos."
        />
        {canCreate && (
          <GenericSubcollectionSheet<FormValues>
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            subcollectionPath={subcollectionPath}
            formSchema={formSchema}
            formFields={formFields}
            selectedItem={selectedItem}
            sheetTitle={selectedItem ? "Editar Correo" : "Añadir Nuevo Correo"}
            sheetDescription={selectedItem ? "Actualiza los detalles del correo." : "Rellena los datos para registrar un nuevo correo."}
          />
        )}
      </CardContent>
    </Card>
  );
}
