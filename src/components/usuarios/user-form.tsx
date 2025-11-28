
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserProfile } from "@/lib/definitions";


const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  sucursal: z.string().min(1, "La sucursal es obligatoria."),
  email: z.string().email("Debe ser un correo electrónico válido."),
  // Make password optional, but if provided, must be at least 6 chars
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.").optional().or(z.literal('')),
  rol: z.enum(["admin", "supervisor", "usuario"]),
});

// For edit mode, we don't require a password
const editSchema = formSchema.omit({ password: true, email: true });


export type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: UserProfile | null;
  isEditMode: boolean;
}

export function UserForm({ onSubmit, isSubmitting, defaultValues, isEditMode }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(isEditMode ? editSchema : formSchema),
    defaultValues: defaultValues || {
      nombre: '',
      sucursal: '',
      email: '',
      password: '',
      rol: 'usuario',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sucursal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sucursal</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Principal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} disabled={isEditMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isEditMode && (
             <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        )}
        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="usuario">Usuario</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
                ? (isEditMode ? 'Guardando...' : 'Creando...')
                : (isEditMode ? 'Guardar Cambios' : 'Crear Usuario')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
