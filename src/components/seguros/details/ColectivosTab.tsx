'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Colectivo } from '@/lib/definitions';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GenericSubcollectionSheet } from './GenericSubcollectionSheet';
import { GenericSubcollectionTable } from './GenericSubcollectionTable';
import * as z from "zod";

interface ColectivosTabProps {
  seguroId: string;
  isActive: boolean;
}

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  descripcion: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: 'nombre' as const, label: 'Nombre del Colectivo', type: 'text' as const, placeholder: 'Ej: Empleados Corporativos' },
  { name: 'descripcion' as const, label: 'Descripción', type: 'textarea' as const, placeholder: 'Detalles sobre el colectivo' },
];


export function ColectivosTab({ seguroId, isActive }: ColectivosTabProps) {
  const firestore = useFirestore();
  const { profile } = useUserProfile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Colectivo | undefined>(undefined);

  const subcollectionPath = `seguros/${seguroId}/colectivos`;

  const itemsQuery = useMemoFirebase(() => {
    if (!firestore || !isActive) return null;
    return collection(firestore, subcollectionPath);
  }, [firestore, subcollectionPath, isActive]);

  const { data: items, isLoading } = useCollection<Colectivo>(itemsQuery);

  const canCreate = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canEdit = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canDelete = profile?.rol === 'admin';

  const handleAdd = () => {
    if (!canCreate) return;
    setSelectedItem(undefined);
    setSheetOpen(true);
  };

  const handleEdit = (item: Colectivo) => {
    if (!canEdit) return;
    setSelectedItem(item);
    setSheetOpen(true);
  };
  
  const tableColumns = [
    { key: 'nombre' as const, header: 'Nombre' },
    { key: 'descripcion' as const, header: 'Descripción', className: 'hidden md:table-cell' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Colectivos</CardTitle>
            <CardDescription>Grupos asociados a esta póliza de seguro.</CardDescription>
        </div>
        {canCreate && (
            <Button onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Colectivo
            </Button>
        )}
      </CardHeader>
      <CardContent>
         <GenericSubcollectionTable<Colectivo>
            items={items}
            isLoading={isLoading && isActive}
            columns={tableColumns}
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={canDelete ? 'firestore' : undefined}
            subcollectionPath={subcollectionPath}
            emptyMessage="No se encontraron colectivos."
        />
        {canCreate && (
            <GenericSubcollectionSheet<FormValues>
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                subcollectionPath={subcollectionPath}
                formSchema={formSchema}
                formFields={formFields}
                selectedItem={selectedItem}
                sheetTitle={selectedItem ? "Editar Colectivo" : "Añadir Nuevo Colectivo"}
                sheetDescription={selectedItem ? "Actualiza los detalles del colectivo." : "Rellena los datos para registrar un nuevo colectivo."}
            />
        )}
      </CardContent>
    </Card>
  );
}
