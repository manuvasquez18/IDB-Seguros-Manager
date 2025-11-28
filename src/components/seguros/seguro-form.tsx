
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  estatus: z.enum(["Activo", "Suspendido"]),
  tipo_seguro: z.enum(["Seguro Nacional", "Seguro Internacional"]),
  contacto: z.string().optional(),
  moneda: z.string().optional(),
  rif: z.string().optional(),
  cobertura: z.string().optional(),
  plazo_pago: z.string().optional(),
  direccion: z.string().optional(),
  forma_pago: z.string().optional(),
  tipo_precio: z.string().optional(),
  baremo: z.string().optional(),
  portal_web: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  
  // Facturación
  fact_a_nombre: z.string().optional(),
  fact_formato: z.string().optional(),
  fact_comentario: z.string().optional(),

  // Consignación
  cons_protocolo: z.string().optional(),
  cons_modalidad: z.string().optional(),
  cons_copiar_a: z.string().optional(),
  cons_horario: z.string().optional(),
  cons_documentos: z.string().optional(),
  cons_comentario: z.string().optional(),
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
      nombre: '',
      estatus: 'Activo',
      tipo_seguro: 'Seguro Nacional',
      contacto: '',
      moneda: '',
      rif: '',
      cobertura: '',
      plazo_pago: '',
      direccion: '',
      forma_pago: '',
      tipo_precio: '',
      baremo: '',
      portal_web: '',
      fact_a_nombre: '',
      fact_formato: '',
      fact_comentario: '',
      cons_protocolo: '',
      cons_modalidad: '',
      cons_copiar_a: '',
      cons_horario: '',
      cons_documentos: '',
      cons_comentario: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="facturacion">Facturación</TabsTrigger>
            <TabsTrigger value="consignacion">Consignación</TabsTrigger>
          </TabsList>
          
          {/* GENERAL TAB */}
          <TabsContent value="general" className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Seguro</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Póliza de Salud Global" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tipo_seguro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Seguro</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Seguro Nacional">Seguro Nacional</SelectItem>
                      <SelectItem value="Seguro Internacional">Seguro Internacional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estatus</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estatus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="contacto" render={({ field }) => ( <FormItem> <FormLabel>Contacto</FormLabel> <FormControl><Input placeholder="Nombre del contacto principal" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="moneda" render={({ field }) => ( <FormItem> <FormLabel>Moneda</FormLabel> <FormControl><Input placeholder="Ej: USD, VES" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="rif" render={({ field }) => ( <FormItem> <FormLabel>RIF</FormLabel> <FormControl><Input placeholder="Ej: J-12345678-9" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="plazo_pago" render={({ field }) => ( <FormItem> <FormLabel>Plazo de Pago</FormLabel> <FormControl><Input placeholder="Ej: 30 días" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="forma_pago" render={({ field }) => ( <FormItem> <FormLabel>Forma de Pago</FormLabel> <FormControl><Input placeholder="Ej: Transferencia, Tarjeta de Crédito" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="tipo_precio" render={({ field }) => ( <FormItem> <FormLabel>Tipo de Precio</FormLabel> <FormControl><Input placeholder="Ej: Fijo, Variable" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="portal_web" render={({ field }) => ( <FormItem> <FormLabel>Portal Web</FormLabel> <FormControl><Input placeholder="https://ejemplo.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="direccion" render={({ field }) => ( <FormItem> <FormLabel>Dirección</FormLabel> <FormControl><Textarea placeholder="Dirección de la compañía de seguros" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="cobertura" render={({ field }) => ( <FormItem> <FormLabel>Cobertura</FormLabel> <FormControl><Textarea placeholder="Detalles de la cobertura" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="baremo" render={({ field }) => ( <FormItem> <FormLabel>Baremo</FormLabel> <FormControl><Textarea placeholder="Información sobre el baremo" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
          </TabsContent>

          {/* FACTURACIÓN TAB */}
          <TabsContent value="facturacion" className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto pr-4">
             <FormField control={form.control} name="fact_a_nombre" render={({ field }) => ( <FormItem> <FormLabel>Facturar a Nombre de</FormLabel> <FormControl><Input placeholder="Nombre para la factura" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
             <FormField control={form.control} name="fact_formato" render={({ field }) => ( <FormItem> <FormLabel>Formato de Factura</FormLabel> <FormControl><Input placeholder="Ej: PDF, Digital" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
             <FormField control={form.control} name="fact_comentario" render={({ field }) => ( <FormItem> <FormLabel>Comentarios de Facturación</FormLabel> <FormControl><Textarea placeholder="Instrucciones o notas adicionales" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
          </TabsContent>

          {/* CONSIGNACIÓN TAB */}
          <TabsContent value="consignacion" className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto pr-4">
            <FormField control={form.control} name="cons_protocolo" render={({ field }) => ( <FormItem> <FormLabel>Protocolo de Consignación</FormLabel> <FormControl><Input placeholder="Protocolo a seguir" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="cons_modalidad" render={({ field }) => ( <FormItem> <FormLabel>Modalidad</FormLabel> <FormControl><Input placeholder="Ej: Digital, Físico" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="cons_copiar_a" render={({ field }) => ( <FormItem> <FormLabel>Copiar a (Email)</FormLabel> <FormControl><Input type="text" placeholder="correo@ejemplo.com, otro@ejemplo.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="cons_horario" render={({ field }) => ( <FormItem> <FormLabel>Horario</FormLabel> <FormControl><Input placeholder="Ej: Lunes a Viernes de 9am a 5pm" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="cons_documentos" render={({ field }) => ( <FormItem> <FormLabel>Documentos Requeridos</FormLabel> <FormControl><Textarea placeholder="Liste los documentos necesarios" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="cons_comentario" render={({ field }) => ( <FormItem> <FormLabel>Comentarios de Consignación</FormLabel> <FormControl><Textarea placeholder="Notas adicionales sobre la consignación" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button type="submit">{isEditMode ? "Guardar Cambios" : "Crear Seguro"}</Button>
        </div>
      </form>
    </Form>
  );
}
