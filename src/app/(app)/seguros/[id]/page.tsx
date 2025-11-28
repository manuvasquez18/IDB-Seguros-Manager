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
import { ColectivosTab } from '@/components/seguros/details/ColectivosTab';
import { ContactosTab } from '@/components/seguros/details/ContactosTab';
import { CorreosTab } from '@/components/seguros/details/CorreosTab';
import { UsuariosPortalTab } from '@/components/seguros/details/UsuariosPortalTab';
import { PopupsTab } from '@/components/seguros/details/PopupsTab';
import { ArchivosTab } from '@/components/seguros/details/ArchivosTab';

type TabValue = 'colectivos' | 'contactos' | 'correos' | 'usuarios_portal' | 'popups' | 'archivos';

export default function SeguroDetailPage() {
  const { id: seguroId } = useParams();
  const firestore = useFirestore();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabValue>('colectivos');

  const seguroRef = useMemoFirebase(() => {
    // Only run the query if the user is authenticated and firestore is available
    if (!firestore || !seguroId || !user) return null;
    return doc(firestore, 'seguros', seguroId as string);
  }, [firestore, seguroId, user]);

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
      
      <Tabs defaultValue="colectivos" className="w-full" onValueChange={(value) => setActiveTab(value as TabValue)}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="colectivos">Colectivos</TabsTrigger>
          <TabsTrigger value="contactos">Contactos</TabsTrigger>
          <TabsTrigger value="correos">Correos</TabsTrigger>
          <TabsTrigger value="usuarios_portal">Usuarios Portal</TabsTrigger>
          <TabsTrigger value="popups">Popups</TabsTrigger>
          <TabsTrigger value="archivos">Archivos</TabsTrigger>
        </TabsList>

        <TabsContent value="colectivos">
          <ColectivosTab seguroId={seguro.id} isActive={activeTab === 'colectivos'} />
        </TabsContent>
        <TabsContent value="contactos">
          <ContactosTab seguroId={seguro.id} isActive={activeTab === 'contactos'} />
        </TabsContent>
        <TabsContent value="correos">
          <CorreosTab seguroId={seguro.id} isActive={activeTab === 'correos'} />
        </TabsContent>
        <TabsContent value="usuarios_portal">
           <UsuariosPortalTab seguroId={seguro.id} isActive={activeTab === 'usuarios_portal'} />
        </TabsContent>
        <TabsContent value="popups">
          <PopupsTab seguroId={seguro.id} isActive={activeTab === 'popups'} />
        </TabsContent>
        <TabsContent value="archivos">
          <ArchivosTab seguroId={seguro.id} isActive={activeTab === 'archivos'} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
