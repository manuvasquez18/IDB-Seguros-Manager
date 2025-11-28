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

const seguros = [
  {
    id: "SEG-001",
    nombre: "Seguro de Vida Individual",
    contacto: "Juan Pérez",
    moneda: "USD",
    rif: "V-12345678-9",
    estado: "Activo",
  },
  {
    id: "SEG-002",
    nombre: "Póliza de Salud Colectiva",
    contacto: "Maria Rodriguez",
    moneda: "VES",
    rif: "J-98765432-1",
    estado: "Activo",
  },
  {
    id: "SEG-003",
    nombre: "Seguro de Automóvil",
    contacto: "Carlos López",
    moneda: "USD",
    rif: "V-87654321-0",
    estado: "Vencido",
  },
  {
    id: "SEG-004",
    nombre: "Seguro Patrimonial",
    contacto: "Ana Martínez",
    moneda: "USD",
    rif: "J-11223344-5",
    estado: "Activo",
  },
];

export default function SegurosPage() {
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
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Contacto</TableHead>
                <TableHead className="hidden lg:table-cell">Moneda</TableHead>
                <TableHead className="hidden md:table-cell">RIF</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seguros.map((seguro) => (
                <TableRow key={seguro.id}>
                  <TableCell className="font-medium">{seguro.nombre}</TableCell>
                  <TableCell className="hidden md:table-cell">{seguro.contacto}</TableCell>
                  <TableCell className="hidden lg:table-cell">{seguro.moneda}</TableCell>
                  <TableCell className="hidden md:table-cell">{seguro.rif}</TableCell>
                  <TableCell>
                    <Badge variant={seguro.estado === "Activo" ? "secondary" : "destructive"}>
                      {seguro.estado}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
