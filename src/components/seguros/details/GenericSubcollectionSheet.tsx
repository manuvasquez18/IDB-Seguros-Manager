'use client';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { v4 as uuidv4 } from 'uuid';
import { Switch } from '@/components/ui/switch';

type FieldType = 'text' | 'textarea' | 'email' | 'password' | 'switch';

interface FormFieldConfig<T extends z.ZodObject<any, any, any>> {
  name: keyof z.infer<T>;
  label: string;
  type: FieldType;
  placeholder?: string;
}

interface GenericSubcollectionSheetProps<T extends z.ZodObject<any, any, any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcollectionPath: string;
  formSchema: T;
  formFields: FormFieldConfig<T>[];
  selectedItem?: { id: string } & Partial<z.infer<T>>;
  sheetTitle: string;
  sheetDescription: string;
  omitEmptyPassword?: boolean;
  transformSubmitData?: (data: z.infer<T>) => Record<string, any>;
}

export function GenericSubcollectionSheet<T extends z.ZodObject<any, any, any>>({
  open,
  onOpenChange,
  subcollectionPath,
  formSchema,
  formFields,
  selectedItem,
  sheetTitle,
  sheetDescription,
  omitEmptyPassword = false,
  transformSubmitData,
}: GenericSubcollectionSheetProps<T>) {
  const firestore = useFirestore();
  const isEditMode = !!selectedItem && 'created_at' in selectedItem;

  const defaultValues = useMemo(() => {
    const initialValues: Record<string, any> = {};
    formFields.forEach(field => {
        if(field.type === 'switch') {
            initialValues[field.name as string] = false;
        } else {
            initialValues[field.name as string] = '';
        }
    });
    return {
        ...initialValues,
        ...(selectedItem || {}),
    } as z.infer<T>;
  }, [selectedItem, formFields]);


  const form = useForm<z.infer<T>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (open) {
      const newId = isEditMode ? selectedItem.id : uuidv4();
      form.reset({
        ...defaultValues,
        ...(selectedItem || {}),
        id: newId,
      } as z.infer<T>);
    }
  }, [selectedItem, open, form, defaultValues, isEditMode]);


  const handleSubmit = (data: z.infer<T>) => {
    if (!firestore) return;

    const itemId = selectedItem?.id ?? uuidv4();
    const docRef = doc(firestore, subcollectionPath, itemId);
    
    let transformedData = transformSubmitData ? transformSubmitData(data) : data;

    let dataToSave: any = {
      ...transformedData,
      id: itemId,
      updated_at: new Date().toISOString(),
      ...(isEditMode ? {} : { created_at: new Date().toISOString() }),
    };

    if (isEditMode && omitEmptyPassword && 'password' in data && !data.password) {
        delete dataToSave.password;
    }

    setDocumentNonBlocking(docRef, dataToSave, { merge: isEditMode });
    form.reset();
    onOpenChange(false);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if(!isOpen) {
        form.reset(defaultValues);
    }
    onOpenChange(isOpen);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-6">
            {formFields.map((fieldConfig) => (
              <FormField
                key={fieldConfig.name as string}
                control={form.control}
                name={fieldConfig.name as any}
                render={({ field }) => (
                  <FormItem className={fieldConfig.type === 'switch' ? 'flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm' : ''}>
                    <FormLabel>{fieldConfig.label}</FormLabel>
                    <FormControl>
                      {fieldConfig.type === 'textarea' ? (
                        <Textarea placeholder={fieldConfig.placeholder} {...field} />
                      ) : fieldConfig.type === 'switch' ? (
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                      ) : (
                        <Input type={fieldConfig.type} placeholder={fieldConfig.placeholder} {...field} value={field.value ?? ''} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="flex justify-end pt-4">
              <Button type="submit">{isEditMode ? 'Guardar Cambios' : 'Crear Registro'}</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
