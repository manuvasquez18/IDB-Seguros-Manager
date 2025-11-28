'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Notificacion } from '@/lib/definitions';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GenericSubcollectionSheet } from './GenericSubcollectionSheet';
import { GenericSubcollectionTable } from './GenericSubcollectionTable';
import * as z from "zod";
import Link from 'next/link';

interface NotificacionesTabProps {
  seguroId: string;
  isActive: boolean;
}

const formSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio."),
  cuerpo: z.string().optional(),
  url: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: 'titulo' as const, label: 'Título de la Notificación', type: 'text' as const, placeholder: 'Ej: Aviso Importante' },
  { name: 'cuerpo' as const, label: 'Cuerpo del Mensaje', type: 'textarea' as const, placeholder: 'Detalles del aviso...' },
  { name: 'url' as const, label: 'URL (Opcional)', type: 'text' as const, placeholder: 'https://ejemplo.com/info' },
];

export function NotificacionesTab({ seguroId, isActive }: NotificacionesTabProps) {
  const firestore = useFirestore();
  const { profile } = useUserProfile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Notificacion | undefined>(undefined);

  const subcollectionPath = `seguros/${seguroId}/notificaciones`;

  const itemsQuery = useMemoFirebase(() => {
    if (!firestore || !isActive) return null;
    return collection(firestore, subcollectionPath);
  }, [firestore, subcollectionPath, isActive]);

  const { data: items, isLoading } = useCollection<Notificacion>(itemsQuery);

  const canCreate = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canEdit = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canDelete = profile?.rol === 'admin';

  const handleAdd = () => {
    if (!canCreate) return;
    setSelectedItem(undefined);
    setSheetOpen(true);
  };

  const handleEdit = (item: Notificacion) => {
    if (!canEdit) return;
    setSelectedItem(item);
    setSheetOpen(true);
  };
  
  const tableColumns = [
    { key: 'titulo' as const, header: 'Título' },
    { 
      key: 'url' as const, 
      header: 'URL',
      render: (item: Notificacion) => item.url ? <Link href={item.url} target="_blank" className="text-primary underline">{item.url}</Link> : 'N/A',
      className: 'hidden md:table-cell' 
    },
    { key: 'cuerpo' as const, header: 'Cuerpo', className: 'hidden md:table-cell' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>Mensajes emergentes para mostrar en portales.</CardDescription>
        </div>
        {canCreate && (
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Notificación
          </Button>
        )}
      </CardHeader>
      <CardContent>
         <GenericSubcollectionTable<Notificacion>
            items={items}
            isLoading={isLoading && isActive}
            columns={tableColumns}
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={canDelete ? 'firestore' : undefined}
            subcollectionPath={subcollectionPath}
            emptyMessage="No se encontraron notificaciones."
        />
        {canCreate && (
          <GenericSubcollectionSheet<FormValues>
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            subcollectionPath={subcollectionPath}
            formSchema={formSchema}
            formFields={formFields}
            selectedItem={selectedItem}
            sheetTitle={selectedItem ? "Editar Notificación" : "Añadir Nueva Notificación"}
            sheetDescription={selectedItem ? "Actualiza los detalles de la notificación." : "Rellena los datos para registrar una nueva notificación."}
          />
        )}
      </CardContent>
    </Card>
  );
}
