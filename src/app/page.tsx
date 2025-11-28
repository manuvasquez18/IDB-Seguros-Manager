'use client';
import { useUser } from '@/firebase';
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
  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando...</p>
      </div>
    );
  }
  
  // Una vez que la carga ha terminado, el useEffect se encargará de la redirección.
  // Renderizar null o un spinner mientras la redirección está en proceso.
  return (
    <div className="flex justify-center items-center h-screen">
      <p>Cargando...</p>
    </div>
  );
}
