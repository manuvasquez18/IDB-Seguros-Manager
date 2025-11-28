'use client';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collectionGroup, query, orderBy, limit } from 'firebase/firestore';
import type { Notificacion } from '@/lib/definitions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export function NotificationBell() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const notificationsQuery = useMemoFirebase(() => {
    // CRITICAL: Only create the query when auth state is fully resolved and a user is present.
    if (isUserLoading || !user || !firestore) {
      return null;
    }
    
    return query(
      collectionGroup(firestore, 'notificaciones'), 
      orderBy('created_at', 'desc'), 
      limit(20)
    );
  }, [firestore, user, isUserLoading]);

  // Pass the (potentially null) query to the hook.
  // The hook's `isLoading` will be true if the query is not null but data hasn't arrived.
  const { data: notifications, isLoading: areNotificationsLoading } = useCollection<Notificacion>(notificationsQuery);
  
  // The overall loading state depends on both auth check and notification fetching (if it runs).
  const isLoading = isUserLoading || (!!notificationsQuery && areNotificationsLoading);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          {!isLoading && notifications && notifications.length > 0 && (
             <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem disabled>Cargando...</DropdownMenuItem>
        ) : notifications && notifications.length > 0 ? (
          notifications.map(notif => (
            <DropdownMenuItem key={notif.id} asChild className="flex flex-col items-start gap-1">
                <Link href={notif.url || '#'} target={notif.url ? '_blank' : '_self'} className="w-full">
                    <p className="font-semibold">{notif.titulo}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notif.cuerpo}</p>
                </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No hay notificaciones nuevas.</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
