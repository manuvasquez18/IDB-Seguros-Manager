'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Archivo } from '@/lib/definitions';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GenericSubcollectionSheet } from './GenericSubcollectionSheet';
import { GenericSubcollectionTable } from './GenericSubcollectionTable';
import * as z from "zod";
import Link from 'next/link';

interface ArchivosTabProps {
  seguroId: string;
}

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  url_storage: z.string().url("Debe ser una URL de almacenamiento válida."),
  comentario: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: 'nombre' as const, label: 'Nombre del Archivo', type: 'text' as const, placeholder: 'Ej: Póliza General 2024' },
  { name: 'url_storage' as const, label: 'URL del Archivo', type: 'text' as const, placeholder: 'https://firebasestorage.googleapis.com/...' },
  { name: 'comentario' as const, label: 'Comentario', type: 'textarea' as const, placeholder: 'Notas sobre el archivo' },
];

export function ArchivosTab({ seguroId }: ArchivosTabProps) {
  const firestore = useFirestore();
  const { profile } = useUserProfile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Archivo | undefined>(undefined);

  const subcollectionPath = `seguros/${seguroId}/archivos`;

  const itemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, subcollectionPath);
  }, [firestore, subcollectionPath]);

  const { data: items, isLoading } = useCollection<Archivo>(itemsQuery);

  const canCreate = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canEdit = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canDelete = profile?.rol === 'admin';

  const handleAdd = () => {
    if (!canCreate) return;
    setSelectedItem(undefined);
    setSheetOpen(true);
  };

  const handleEdit = (item: Archivo) => {
    if (!canEdit) return;
    setSelectedItem(item);
    setSheetOpen(true);
  };
  
  const tableColumns = [
    { key: 'nombre' as const, header: 'Nombre' },
    { 
      key: 'url_storage' as const, 
      header: 'URL',
      render: (item: Archivo) => item.url_storage ? <Link href={item.url_storage} target="_blank" className="text-primary underline">Ver Archivo</Link> : 'N/A',
      className: 'hidden sm:table-cell'
    },
    { key: 'comentario' as const, header: 'Comentario', className: 'hidden md:table-cell' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Archivos</CardTitle>
          <CardDescription>Documentos y archivos adjuntos a la póliza.</CardDescription>
        </div>
        {canCreate && (
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Archivo
          </Button>
        )}
      </CardHeader>
      <CardContent>
         <GenericSubcollectionTable<Archivo>
            items={items}
            isLoading={isLoading}
            columns={tableColumns}
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={canDelete ? 'firestore' : undefined}
            subcollectionPath={subcollectionPath}
            emptyMessage="No se encontraron archivos."
        />
        {canCreate && (
          <GenericSubcollectionSheet<FormValues>
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            subcollectionPath={subcollectionPath}
            formSchema={formSchema}
            formFields={formFields}
            selectedItem={selectedItem}
            sheetTitle={selectedItem ? "Editar Archivo" : "Añadir Nuevo Archivo"}
            sheetDescription={selectedItem ? "Actualiza los detalles del archivo." : "Rellena los datos para registrar un nuevo archivo."}
          />
        )}
      </CardContent>
    </Card>
  );
}
