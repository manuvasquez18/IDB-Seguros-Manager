
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { useUserProfile } from '@/hooks/use-user-profile';
import { UserSheet } from '@/components/usuarios/user-sheet';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';


export default function UsuariosPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { profile } = useUserProfile();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);


  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !user || !profile || profile.rol !== 'admin') return null;
    return collection(firestore, 'users');
  }, [firestore, user, profile]);

  const { data: users, isLoading: isUsersLoading } = useCollection<UserProfile>(usersQuery);
  
  const isLoading = isUserLoading || (user && isUsersLoading);
  
  const canCreate = profile?.rol === 'admin';
  const canEdit = profile?.rol === 'admin';
  const canDelete = profile?.rol === 'admin';


  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'supervisor':
        return 'default';
      case 'usuario':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm) return users;

    return users.filter(user => 
      (user.nombre && user.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.sucursal && user.sucursal.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);
  
  const handleAddUser = () => {
    if (!canCreate) return;
    setSelectedUser(undefined);
    setSheetOpen(true);
  }

  const handleEditUser = (user: UserProfile) => {
    if (!canEdit) return;
    setSelectedUser(user);
    setSheetOpen(true);
  }

  const openDeleteDialog = (user: UserProfile) => {
    if (!canDelete) return;
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!firestore || !userToDelete || !canDelete) return;
    const docRef = doc(firestore, 'users', userToDelete.id);
    // Note: This only deletes the Firestore document, not the Firebase Auth user.
    // Additional logic with Firebase Admin SDK (on a backend) is needed for full deletion.
    deleteDocumentNonBlocking(docRef);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando usuarios...</p>
      </div>
    );
  }
  
  if (profile && profile.rol !== 'admin') {
     return (
      <div className="flex items-center justify-center h-full">
        <p>No tienes permiso para ver esta página.</p>
      </div>
    );
  }


  return (
    <>
      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>
                Administra los usuarios y sus roles en el sistema.
              </CardDescription>
            </div>
             <div className="flex items-center gap-2">
               <Input
                  type="search"
                  placeholder="Buscar por nombre, sucursal, email..."
                  className="w-full max-w-sm appearance-none bg-background shadow-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {canCreate && (
                    <Button onClick={handleAddUser}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear Usuario
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="hidden md:table-cell">Activo</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Fecha de Creación
                  </TableHead>
                  <TableHead className="text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nombre} ({user.sucursal})</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleVariant(user.rol)}>
                          {user.rol}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={user.is_active ? 'default' : 'inactive'}>
                          {user.is_active ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.created_at ? format(new Date(user.created_at), "dd/MM/yyyy") : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {canEdit && <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}><Edit className="h-4 w-4" /></Button>}
                        {canDelete && <Button variant="destructive" size="icon" onClick={() => openDeleteDialog(user)}><Trash2 className="h-4 w-4" /></Button>}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm ? 'No se encontraron usuarios con ese criterio.' : 'No se encontraron usuarios.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {canCreate && (
          <UserSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            user={selectedUser}
          />
        )}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el perfil del usuario de Firestore, pero **no** eliminará al usuario de Firebase Authentication.
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
