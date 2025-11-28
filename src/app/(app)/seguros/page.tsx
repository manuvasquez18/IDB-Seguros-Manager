"use client";

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
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Seguro } from "@/lib/definitions";

export default function SegurosPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const segurosQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, `users/${user.uid}/seguros`);
  }, [firestore, user?.uid]);

  const { data: seguros, isLoading } = useCollection<Omit<Seguro, 'id'>>(segurosQuery);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando seguros...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Seguros</h1>
          <p className="text-muted-foreground">
            Administra los seguros, pólizas y clientes.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Seguro
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seguros Registrados</CardTitle>
          <CardDescription>
            Una lista de todos los seguros en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="hidden md:table-cell">Contacto ID</TableHead>
                <TableHead className="hidden lg:table-cell">Moneda</TableHead>
                <TableHead className="hidden md:table-cell">RIF</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seguros && seguros.length > 0 ? (
                seguros.map((seguro) => (
                  <TableRow key={seguro.id}>
                    <TableCell className="font-medium">{seguro.id}</TableCell>
                    <TableCell className="hidden md:table-cell">{seguro.contactoId}</TableCell>
                    <TableCell className="hidden lg:table-cell">{seguro.moneda}</TableCell>
                    <TableCell className="hidden md:table-cell">{seguro.rif}</TableCell>
                    <TableCell>
                      <Badge variant={"secondary"}>
                        Activo
                      </Badge>
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
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No se encontraron seguros.
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
