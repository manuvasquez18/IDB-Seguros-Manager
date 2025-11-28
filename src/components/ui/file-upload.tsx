'use client';
import { useState } from 'react';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Input } from './input';
import { Progress } from './progress';
import { Label } from './label';
import { Button } from './button';
import { X, CheckCircle, UploadCloud, File as FileIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FileUploadInfo } from '@/lib/definitions';

interface FileUploadProps {
  value?: FileUploadInfo;
  onChange: (value?: FileUploadInfo) => void;
  uploadPath: string;
  label: string;
}

export function FileUpload({ value, onChange, uploadPath, label }: FileUploadProps) {
  const storage = useStorage();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState(value?.filePath.split('/').pop() || '');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!storage) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "El servicio de almacenamiento no está disponible.",
        });
        return;
    }
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);

    const storageRef = ref(storage, `${uploadPath}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setIsUploading(false);
        setUploadProgress(0);
        console.error("Upload error:", error);
        toast({
            variant: "destructive",
            title: "Error de Subida",
            description: "No se pudo subir el archivo. " + error.message,
        });
        onChange(undefined);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const fileInfo: FileUploadInfo = {
            downloadURL,
            filePath: uploadTask.snapshot.ref.fullPath,
            mimeType: file.type,
            sizeKB: Math.round(file.size / 1024),
        };
        onChange(fileInfo);
        setIsUploading(false);
        toast({
            title: "Subida Completa",
            description: `El archivo ${file.name} se ha subido correctamente.`,
        });
      }
    );
  };

  const handleRemoveFile = () => {
    // Note: This only removes the reference from the form state.
    // It does not delete the file from Firebase Storage.
    // Deleting files would require a backend function for security.
    onChange(undefined);
    setFileName('');
    setUploadProgress(0);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="p-4 border-2 border-dashed rounded-lg text-center">
        {!value && !isUploading && (
            <div className='flex flex-col items-center gap-2'>
                <UploadCloud className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Arrastra y suelta un archivo o haz clic para seleccionar</p>
                <Input
                    type="file"
                    className="hidden"
                    id="file-upload-input"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
                <label htmlFor="file-upload-input" className="cursor-pointer">
                    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-2">
                    Seleccionar Archivo
                    </div>
                </label>
            </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Subiendo: {fileName}</p>
            <Progress value={uploadProgress} />
            <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</p>
          </div>
        )}
        
        {value && !isUploading && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
                <FileIcon className="w-4 h-4" />
                <span className="font-medium truncate">{fileName}</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
              <X className="w-4 h-4" />
              <span className="sr-only">Quitar archivo</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
