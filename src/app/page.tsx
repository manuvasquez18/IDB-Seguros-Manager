'use client';
import { useUser } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Si ya sabemos que hay un usuario, vamos a la app.
    if (user) {
      router.push('/seguros');
      return;
    }
    
    // Si la carga ha terminado y no hay usuario, vamos al login.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    // Si está cargando y no hay usuario, esta página mostrará "Cargando..."
  }, [user, isUserLoading, router]);

  // Mientras se carga, mostramos un spinner simple.
  // Esto solo se verá momentáneamente mientras se determina el estado de autenticación.
  return (
    <div className="flex justify-center items-center h-screen">
      <p>Cargando...</p>
    </div>
  );
}
