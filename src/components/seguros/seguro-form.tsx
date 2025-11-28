
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  contactoId: z.string().min(1, "El ID de contacto es obligatorio."),
  moneda: z.string().min(1, "La moneda es obligatoria."),
  rif: z.string().min(1, "El RIF es obligatorio."),
  cobertura: z.string().min(1, "La cobertura es obligatoria."),
  otrosDetalles: z.string().optional(),
});

export type SeguroFormValues = z.infer<typeof formSchema>;

interface SeguroFormProps {
  onSubmit: (data: SeguroFormValues) => void;
  defaultValues?: Partial<SeguroFormValues>;
  isEditMode: boolean;
}

export function SeguroForm({ onSubmit, defaultValues, isEditMode }: SeguroFormProps) {
  const form = useForm<SeguroFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
        contactoId: '',
        moneda: '',
        rif: '',
        cobertura: '',
        otrosDetalles: ''
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
        <FormField
          control={form.control}
          name="contactoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID de Contacto</FormLabel>
              <FormControl>
                <Input placeholder="ID del Contacto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moneda"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moneda</FormLabel>
              <FormControl>
                <Input placeholder="Ej: USD, VEF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RIF</FormLabel>
              <FormControl>
                <Input placeholder="Ej: J-12345678-9" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cobertura"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cobertura</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalles de la cobertura del seguro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otrosDetalles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Otros Detalles (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Cualquier otra información relevante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">{isEditMode ? "Guardar Cambios" : "Crear Seguro"}</Button>
        </div>
      </form>
    </Form>
  );
}
