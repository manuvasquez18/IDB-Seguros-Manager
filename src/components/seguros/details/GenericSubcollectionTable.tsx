'use client';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';

type ItemWithId = { id: string; [key: string]: any };

interface ColumnDefinition<T extends ItemWithId> {
  key: keyof T;
  header: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

interface GenericSubcollectionTableProps<T extends ItemWithId> {
  items: T[] | null;
  isLoading: boolean;
  columns: ColumnDefinition<T>[];
  onEdit?: (item: T) => void;
  onDelete?: 'firestore'; // Extend with other delete types if needed
  subcollectionPath?: string;
  emptyMessage: string;
}

export function GenericSubcollectionTable<T extends ItemWithId>({
  items,
  isLoading,
  columns,
  onEdit,
  onDelete,
  subcollectionPath,
  emptyMessage,
}: GenericSubcollectionTableProps<T>) {
  const firestore = useFirestore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const openDeleteDialog = (item: T) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!firestore || !itemToDelete || !onDelete || !subcollectionPath) return;

    if (onDelete === 'firestore') {
      const docRef = doc(firestore, subcollectionPath, itemToDelete.id);
      deleteDocumentNonBlocking(docRef);
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const showActionsColumn = !!onEdit || !!onDelete;
  
  if (isLoading) {
    return (
        <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
      </div>
    );
  }


  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={col.key as string} className={col.className}>{col.header}</TableHead>
            ))}
            {showActionsColumn && <TableHead className="text-right">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items && items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                {columns.map(col => (
                  <TableCell key={`${item.id}-${col.key as string}`} className={col.className}>
                    {col.render ? col.render(item) : item[col.key]}
                  </TableCell>
                ))}
                {showActionsColumn && (
                  <TableCell className="text-right space-x-2 whitespace-nowrap w-[100px]">
                    {onEdit && <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>}
                    {onDelete && <Button variant="destructive" size="icon" onClick={() => openDeleteDialog(item)}><Trash2 className="h-4 w-4" /></Button>}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (showActionsColumn ? 1 : 0)} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el registro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
