'use client';
import type { Seguro } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { NotificacionesTab } from './NotificacionesTab';

interface SeguroInfoTabProps {
  seguro: Seguro;
  isActive: boolean;
}

const DetailItem = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  
  if (label === 'Portal Web' && typeof value === 'string' && value.startsWith('http')) {
      return (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="font-semibold text-muted-foreground">{label}</span>
            <span className="col-span-2">
                <Link href={value} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                    {value}
                </Link>
            </span>
          </div>
      )
  }

  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="col-span-2">{value}</span>
    </div>
  );
};


export function SeguroInfoTab({ seguro, isActive }: SeguroInfoTabProps) {
  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Columna 1 */}
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Información General</CardTitle>
                        <CardDescription>Detalles principales de la póliza.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-sm items-center">
                            <span className="font-semibold text-muted-foreground">Estatus</span>
                            <span className="col-span-2">
                                <Badge variant={seguro.estatus === 'Activo' ? 'default' : 'destructive'}>
                                    {seguro.estatus}
                                </Badge>
                            </span>
                        </div>
                        <DetailItem label="Contacto" value={seguro.contacto} />
                        <DetailItem label="RIF" value={seguro.rif} />
                        <DetailItem label="Moneda" value={seguro.moneda} />
                        <DetailItem label="Plazo de Pago" value={seguro.plazo_pago} />
                        <DetailItem label="Forma de Pago" value={seguro.forma_pago} />
                        <DetailItem label="Tipo de Precio" value={seguro.tipo_precio} />
                        <DetailItem label="Portal Web" value={seguro.portal_web} />
                        <DetailItem label="Dirección" value={seguro.direccion} />
                        <DetailItem label="Cobertura" value={seguro.cobertura} />
                        <DetailItem label="Baremo" value={seguro.baremo} />
                    </CardContent>
                </Card>
            </div>

            {/* Columna 2 */}
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Facturación</CardTitle>
                        <CardDescription>Detalles sobre la facturación de la póliza.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <DetailItem label="Facturar a Nombre de" value={seguro.fact_a_nombre} />
                        <DetailItem label="Formato de Factura" value={seguro.fact_formato} />
                        <DetailItem label="Comentarios" value={seguro.fact_comentario} />
                    </CardContent>
                </Card>
            </div>

            {/* Columna 3 */}
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Consignación</CardTitle>
                        <CardDescription>Información para la consignación de documentos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <DetailItem label="Protocolo" value={seguro.cons_protocolo} />
                        <DetailItem label="Modalidad" value={seguro.cons_modalidad} />
                        <DetailItem label="Copiar a (Email)" value={seguro.cons_copiar_a} />
                        <DetailItem label="Horario" value={seguro.cons_horario} />
                        <DetailItem label="Documentos Requeridos" value={seguro.cons_documentos} />
                        <DetailItem label="Comentarios" value={seguro.cons_comentario} />
                    </CardContent>
                </Card>
            </div>
        </div>
        <div>
            <NotificacionesTab seguroId={seguro.id} isActive={isActive} />
        </div>
    </div>
  );
}
