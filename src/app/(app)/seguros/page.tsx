
"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { Seguro } from "@/lib/definitions";
import { SeguroSheet } from "@/components/seguros/seguro-sheet";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useUserProfile } from "@/hooks/use-user-profile";


export default function SegurosPage() {
  const firestore = useFirestore();
  const { profile } = useUserProfile();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSeguro, setSelectedSeguro] = useState<Seguro | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seguroToDelete, setSeguroToDelete] = useState<Seguro | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const segurosQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'seguros');
  }, [firestore, user]);

  const { data: seguros, isLoading: isSegurosLoading } = useCollection<Seguro>(segurosQuery);
  
  const isLoading = isUserLoading || (user && isSegurosLoading);

  const canCreate = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canEdit = profile?.rol === 'admin' || profile?.rol === 'supervisor';
  const canDelete = profile?.rol === 'admin';
  const canViewDetails = true;

  const filteredSeguros = useMemo(() => {
    if (!seguros) return [];
    if (!searchTerm) return seguros;

    return seguros.filter(seguro => 
      seguro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (seguro.contacto && seguro.contacto.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (seguro.rif && seguro.rif.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [seguros, searchTerm]);

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
      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Seguros</CardTitle>
              <CardDescription>
                Administra las pólizas de seguro de tus clientes.
              </CardDescription>
            </div>
             <div className="flex items-center gap-2">
               <Input
                  type="search"
                  placeholder="Buscar por nombre, RIF..."
                  className="w-full max-w-sm appearance-none bg-background shadow-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {canCreate && (
                    <Button onClick={handleAdd}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Añadir Seguro
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Contacto</TableHead>
                  <TableHead className="hidden lg:table-cell">RIF</TableHead>
                  <TableHead>Estatus</TableHead>
                  <TableHead className="hidden md:table-cell">Última Actualización</TableHead>
                  <TableHead>
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSeguros && filteredSeguros.length > 0 ? (
                  filteredSeguros.map((seguro) => (
                    <TableRow key={seguro.id}>
                      <TableCell className="font-medium">{seguro.nombre}</TableCell>
                      <TableCell className="hidden md:table-cell">{seguro.contacto}</TableCell>
                      <TableCell className="hidden lg:table-cell">{seguro.rif}</TableCell>
                      <TableCell>
                         <Badge variant={seguro.estatus === 'Activo' ? 'default' : 'destructive'}>
                          {seguro.estatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{seguro.updated_at ? new Date(seguro.updated_at).toLocaleDateString() : ''}</TableCell>
                      
                        <TableCell>
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      {searchTerm ? 'No se encontraron seguros con ese criterio.' : 'No se encontraron seguros.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      
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
            </dl>
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

    