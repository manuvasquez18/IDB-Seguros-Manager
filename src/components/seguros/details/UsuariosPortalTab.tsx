'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { UsuarioPortal } from '@/lib/definitions';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GenericSubcollectionSheet } from './GenericSubcollectionSheet';
import { GenericSubcollectionTable } from './GenericSubcollectionTable';
import * as z from "zod";

interface UsuariosPortalTabProps {
  seguroId: string;
  isActive: boolean;
}

const formSchema = z.object({
  usuario: z.string().min(1, "El nombre de usuario es obligatorio."),
  password: z.string().optional(),
  comentario: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UsuariosPortalTab({ seguroId, isActive }: UsuariosPortalTabProps) {
  const firestore = useFirestore();
  const { profile } = useUserProfile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UsuarioPortal | undefined>(undefined);

  const subcollectionPath = `seguros/${seguroId}/usuarios_portal`;

  const itemsQuery = useMemoFirebase(() => {
    if (!firestore || !isActive) return null;
    return collection(firestore, subcollectionPath);
  }, [firestore, subcollectionPath, isActive]);

  const { data: items, isLoading } = useCollection<UsuarioPortal>(itemsQuery);

  const canCreate = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canEdit = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canDelete = profile?.rol === 'admin';
  
  const formFields = [
    { name: 'usuario' as const, label: 'Nombre de Usuario', type: 'text' as const, placeholder: 'Ej: analista_claims' },
    { name: 'password' as const, label: 'Contraseña', type: 'text' as const, placeholder: canEdit ? 'Dejar en blanco para no cambiar' : '' },
    { name: 'comentario' as const, label: 'Comentario', type: 'textarea' as const, placeholder: 'Notas adicionales' },
  ];

  const handleAdd = () => {
    if (!canCreate) return;
    setSelectedItem(undefined);
    setSheetOpen(true);
  };

  const handleEdit = (item: UsuarioPortal) => {
    if (!canEdit) return;
    setSelectedItem({...item, password: ''}); // Clear password for edit form
    setSheetOpen(true);
  };
  
  const tableColumns = [
    { key: 'usuario' as const, header: 'Usuario' },
    { key: 'password' as const, header: 'Contraseña', className: 'hidden sm:table-cell' },
    { key: 'comentario' as const, header: 'Comentario', className: 'hidden md:table-cell' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Usuarios de Portal</CardTitle>
          <CardDescription>Credenciales de acceso para portales de clientes.</CardDescription>
        </div>
        {canCreate && (
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Usuario
          </Button>
        )}
      </CardHeader>
      <CardContent>
         <GenericSubcollectionTable<UsuarioPortal>
            items={items}
            isLoading={isLoading && isActive}
            columns={tableColumns}
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={canDelete ? 'firestore' : undefined}
            subcollectionPath={subcollectionPath}
            emptyMessage="No se encontraron usuarios de portal."
        />
        {canCreate && (
          <GenericSubcollectionSheet<FormValues>
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            subcollectionPath={subcollectionPath}
            formSchema={formSchema}
            formFields={formFields}
            selectedItem={selectedItem}
            sheetTitle={selectedItem ? "Editar Usuario de Portal" : "Añadir Nuevo Usuario de Portal"}
            sheetDescription={selectedItem ? "Actualiza los detalles del usuario." : "Rellena los datos para registrar un nuevo usuario."}
            omitEmptyPassword
          />
        )}
      </CardContent>
    </Card>
  );
}
