'use client';
import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Seguro } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ColectivosTab } from '@/components/seguros/details/ColectivosTab';
import { ContactosTab } from '@/components/seguros/details/ContactosTab';
import { CorreosTab } from '@/components/seguros/details/CorreosTab';
import { UsuariosPortalTab } from '@/components/seguros/details/UsuariosPortalTab';
import { PopupsTab } from '@/components/seguros/details/PopupsTab';
import { ArchivosTab } from '@/components/seguros/details/ArchivosTab';

export default function SeguroDetailPage() {
  const { id: seguroId } = useParams();
  const firestore = useFirestore();

  const seguroRef = useMemoFirebase(() => {
    if (!firestore || !seguroId) return null;
    return doc(firestore, 'seguros', seguroId as string);
  }, [firestore, seguroId]);

  const { data: seguro, isLoading } = useDoc<Seguro>(seguroRef);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando detalles del seguro...</p>
      </div>
    );
  }

  if (!seguro) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Seguro no encontrado</h2>
        <p className="text-muted-foreground">
          No se pudo encontrar el seguro que estás buscando.
        </p>
        <Button asChild className="mt-4">
          <Link href="/seguros">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Seguros
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/seguros">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{seguro.nombre}</h1>
          <p className="text-muted-foreground">{seguro.rif}</p>
        </div>
      </div>
      
      <Tabs defaultValue="colectivos" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="colectivos">Colectivos</TabsTrigger>
          <TabsTrigger value="contactos">Contactos</TabsTrigger>
          <TabsTrigger value="correos">Correos</TabsTrigger>
          <TabsTrigger value="usuarios_portal">Usuarios Portal</TabsTrigger>
          <TabsTrigger value="popups">Popups</TabsTrigger>
          <TabsTrigger value="archivos">Archivos</TabsTrigger>
        </TabsList>

        <TabsContent value="colectivos">
          <ColectivosTab seguroId={seguro.id} />
        </TabsContent>
        <TabsContent value="contactos">
          <ContactosTab seguroId={seguro.id} />
        </TabsContent>
        <TabsContent value="correos">
          <CorreosTab seguroId={seguro.id} />
        </TabsContent>
        <TabsContent value="usuarios_portal">
           <UsuariosPortalTab seguroId={seguro.id} />
        </TabsContent>
        <TabsContent value="popups">
          <PopupsTab seguroId={seguro.id} />
        </TabsContent>
        <TabsContent value="archivos">
          <ArchivosTab seguroId={seguro.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
