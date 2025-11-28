
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser, useAuth } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useToast } from '@/hooks/use-toast';
import { UserSheet } from '@/components/usuarios/user-sheet';


function getInitials(name: string) {
  if (!name) return 'U';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return name.substring(0, 2);
}


export default function UsuariosPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { profile } = useUserProfile();
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();


  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !user || !profile || !['admin', 'supervisor'].includes(profile.rol)) return null;
    return collection(firestore, 'users');
  }, [firestore, user, profile]);

  const { data: users, isLoading: isUsersLoading } = useCollection<UserProfile>(usersQuery);
  
  const isLoading = isUserLoading || (user && isUsersLoading);
  
  const canCreate = profile?.rol === 'admin';

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
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);
  
  const handleAddUser = () => {
    if (!canCreate) return;
    setSheetOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando usuarios...</p>
      </div>
    );
  }
  
  if (profile && !['admin', 'supervisor'].includes(profile.rol)) {
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
                  placeholder="Buscar por nombre, email..."
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
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Avatar</span>
                  </TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="hidden md:table-cell">Activo</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Fecha de Creación
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar_url} alt="Avatar" />
                          <AvatarFallback>
                            {getInitials(user.nombre)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.nombre}</TableCell>
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
                            <DropdownMenuItem>Editar Rol</DropdownMenuItem>
                            <DropdownMenuItem>
                              {user.is_active ? 'Desactivar' : 'Activar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
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
        />
      )}
    </>
  );
}
