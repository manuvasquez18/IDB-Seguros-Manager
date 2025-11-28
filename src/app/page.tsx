'use client';
import { useUser } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir cuando la carga del usuario haya terminado
    if (!isUserLoading) {
      if (user) {
        router.push('/seguros');
      } else {
        router.push('/login');
      }
    }
  }, [user, isUserLoading, router]);

  // Mientras se carga, no hacer nada o mostrar un spinner simple.
  // Evita la redirección hasta que el estado sea definitivo.
  return (
    <div className="flex justify-center items-center h-screen">
      <p>Cargando...</p>
    </div>
  );
}
