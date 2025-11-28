'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Seguro } from '@/lib/definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SeguroInfoTab } from '@/components/seguros/details/SeguroInfoTab';
import { ColectivosTab } from '@/components/seguros/details/ColectivosTab';
import { ContactosTab } from '@/components/seguros/details/ContactosTab';
import { CorreosTab } from '@/components/seguros/details/CorreosTab';
import { UsuariosPortalTab } from '@/components/seguros/details/UsuariosPortalTab';
import { ArchivosTab } from '@/components/seguros/details/ArchivosTab';

type TabValue = 'info' | 'colectivos' | 'contactos_correos' | 'usuarios_portal' | 'archivos';

export default function SeguroDetailPage() {
  const { id: seguroId } = useParams();
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const [activeTab, setActiveTab] = useState<TabValue>('info');

  const seguroRef = useMemoFirebase(() => {
    if (!firestore || !seguroId || !user) return null;
    return doc(firestore, 'seguros', seguroId as string);
  }, [firestore, seguroId, user]);

  const { data: seguro, isLoading: isSeguroLoading } = useDoc<Seguro>(seguroRef);

  const isLoading = isAuthLoading || (user && isSeguroLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando detalles del seguro...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Por favor, inicia sesión para ver los detalles.</p>
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
      
      <Tabs defaultValue="info" className="w-full" onValueChange={(value) => setActiveTab(value as TabValue)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Información General</TabsTrigger>
          <TabsTrigger value="colectivos">Colectivos</TabsTrigger>
          <TabsTrigger value="contactos_correos">Contactos y Correos</TabsTrigger>
          <TabsTrigger value="usuarios_portal">Usuarios Portal</TabsTrigger>
          <TabsTrigger value="archivos">Archivos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
            <SeguroInfoTab seguro={seguro} isActive={activeTab === 'info'} />
        </TabsContent>
        <TabsContent value="colectivos">
          <ColectivosTab seguroId={seguro.id} isActive={activeTab === 'colectivos'} />
        </TabsContent>
        <TabsContent value="contactos_correos" className="space-y-6">
          <ContactosTab seguroId={seguro.id} isActive={activeTab === 'contactos_correos'} />
          <CorreosTab seguroId={seguro.id} isActive={activeTab === 'contactos_correos'} />
        </TabsContent>
        <TabsContent value="usuarios_portal">
           <UsuariosPortalTab seguroId={seguro.id} isActive={activeTab === 'usuarios_portal'} />
        </TabsContent>
        <TabsContent value="archivos">
          <ArchivosTab seguroId={seguro.id} isActive={activeTab === 'archivos'} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
