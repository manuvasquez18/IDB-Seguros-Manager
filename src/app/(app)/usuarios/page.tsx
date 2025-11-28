'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
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
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

function getInitials(name: string) {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return name.substring(0, 2);
}


export default function UsuariosPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const usersQuery = useMemoFirebase(() => {
    // Only create the query if the user is logged in
    if (!firestore || !user) return null;
    return collection(firestore, 'users');
  }, [firestore, user]);

  const { data: users, isLoading: isUsersLoading } = useCollection<UserProfile>(usersQuery);
  
  const isLoading = isUserLoading || (user && isUsersLoading);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios y sus roles en el sistema.
          </p>
        </div>
        {/* Futuro botón para añadir usuario manualmente */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>
            Una lista de todos los usuarios en el sistema.
          </CardDescription>
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
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar_url} alt="Avatar" />
                        <AvatarFallback>
                          {user.nombre ? getInitials(user.nombre) : 'U'}
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
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
