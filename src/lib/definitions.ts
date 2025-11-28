
export type UserProfile = {
    id: string; // Corresponds to Firebase Auth UID
    nombre: string;
    email: string;
    telefono?: string;
    rol: 'admin' | 'supervisor' | 'usuario';
    avatar_url?: string;
    is_active: boolean;
    last_login?: string; // ISO 8601 string
    created_at?: string; // ISO 8601 string
    updated_at?: string; // ISO 8601 string
};

export type Seguro = {
    id: string;
    nombre: string;
    contacto?: string;
    moneda?: string;
    rif?: string;
    cobertura?: string;
    plazo_pago?: string;
    direccion?: string;
    forma_pago?: string;
    tipo_precio?: string;
    estatus: 'Activo' | 'Suspendido';
    baremo?: string;
    portal_web?: string;
    fact_a_nombre?: string;
    fact_formato?: string;
    fact_comentario?: string;
    cons_protocolo?: string;
    cons_modalidad?: string;
    cons_copiar_a?: string;
    cons_horario?: string;
    cons_documentos?: string;
    cons_comentario?: string;
    created_at?: string; // ISO 8601 string
    updated_at?: string; // ISO 8601 string
};

export type Colectivo = {
    id: string;
    seguro_id: string;
    nombre: string;
    descripcion?: string;
    created_at?: string;
    updated_at?: string;
};

export type Contacto = {
    id: string;
    seguro_id: string;
    nombre: string;
    telefono?: string;
    comentario?: string;
    created_at?: string;
    updated_at?: string;
};

export type Correo = {
    id: string;
    seguro_id: string;
    nombre: string;
    correo: string;
    comentario?: string;
    created_at?: string;
    updated_at?: string;
};

export type UsuarioPortal = {
    id: string;
    seguro_id: string;
    usuario: string;
    password?: string;
    comentario?: string;
    created_at?: string;
    updated_at?: string;
};

export type Notificacion = {
    id: string;
    seguro_id: string;
    titulo: string;
    cuerpo?: string;
    url?: string;
    created_at?: string;
    updated_at?: string;
};

export type Archivo = {
    id: string;
    seguro_id: string;
    nombre: string;
    url_storage: string;
    tipo_mime?: string;
    tamano_kb?: number;
    comentario?: string;
    created_at?: string;
    updated_at?: string;
};

// Hook for user profile data
export interface UserProfileHookResult {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
}
