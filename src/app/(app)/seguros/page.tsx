
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { Seguro } from "@/lib/definitions";
import { SeguroSheet } from "@/components/seguros/seguro-sheet";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useUserProfile } from "@/hooks/use-user-profile";


export default function SegurosPage() {
  const firestore = useFirestore();
  const { profile } = useUserProfile();
  const { user } = useUser();
  const router = useRouter();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSeguro, setSelectedSeguro] = useState<Seguro | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seguroToDelete, setSeguroToDelete] = useState<Seguro | null>(null);

  const segurosQuery = useMemoFirebase(() => {
    // Only run the query if the user is authenticated and firestore is available
    if (!firestore || !user) return null;
    return collection(firestore, 'seguros');
  }, [firestore, user]);

  const { data: seguros, isLoading } = useCollection<Seguro>(segurosQuery);

  const canCreate = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canEdit = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canDelete = profile?.rol === 'admin';
  const canViewDetails = true; // All roles can view details

  const handleAdd = () => {
    if (!canCreate) return;
    setSelectedSeguro(undefined);
    setSheetOpen(true);
  };

  const handleEdit = (seguro: Seguro) => {
    if (!canEdit) return;
    setSelectedSeguro(seguro);
    setSheetOpen(true);
  };
  
  const handleViewDetails = (seguro: Seguro) => {
    router.push(`/seguros/${seguro.id}`);
  };

  const openDeleteDialog = (seguro: Seguro) => {
    if (!canDelete) return;
    setSeguroToDelete(seguro);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!firestore || !seguroToDelete || !canDelete) return;
    const docRef = doc(firestore, 'seguros', seguroToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setDeleteDialogOpen(false);
    setSeguroToDelete(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando seguros...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Seguros</h1>
            <p className="text-muted-foreground">
              Administra los seguros, pólizas y clientes.
            </p>
          </div>
          {canCreate && (
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Seguro
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seguros Registrados</CardTitle>
            <CardDescription>
              Una lista de todos los seguros en el sistema. Haz clic en un seguro para ver sus detalles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Contacto</TableHead>
                  <TableHead className="hidden lg:table-cell">RIF</TableHead>
                  <TableHead>Estatus</TableHead>
                  {(canEdit || canDelete || canViewDetails) && (
                    <TableHead>
                      <span className="sr-only">Acciones</span>
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {seguros && seguros.length > 0 ? (
                  seguros.map((seguro) => (
                    <TableRow key={seguro.id} className="cursor-pointer" onClick={() => handleViewDetails(seguro)}>
                      <TableCell className="font-medium">{seguro.nombre}</TableCell>
                      <TableCell className="hidden md:table-cell">{seguro.contacto}</TableCell>
                      <TableCell className="hidden lg:table-cell">{seguro.rif}</TableCell>
                      <TableCell>
                         <Badge variant={seguro.estatus === 'Activo' ? 'default' : 'destructive'}>
                          {seguro.estatus}
                        </Badge>
                      </TableCell>
                      {(canEdit || canDelete || canViewDetails) && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                               {canViewDetails && <DropdownMenuItem onSelect={() => handleViewDetails(seguro)}><Eye className="mr-2"/>Ver Detalles</DropdownMenuItem>}
                              {canEdit && <DropdownMenuItem onSelect={() => handleEdit(seguro)}><Edit className="mr-2"/>Editar</DropdownMenuItem>}
                              {canDelete && <DropdownMenuItem onSelect={() => openDeleteDialog(seguro)} className="text-destructive"><Trash2 className="mr-2"/>Eliminar</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No se encontraron seguros.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {canCreate && (
          <SeguroSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            seguro={selectedSeguro}
          />
      )}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el
              seguro de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
