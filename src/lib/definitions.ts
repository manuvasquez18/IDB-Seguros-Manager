
export type Seguro = {
    id: string;
    contactoId: string;
    moneda: string;
    rif: string;
    cobertura: string;
    otrosDetalles?: string;
};

export type Colectivo = {
    id: string;
    seguroId: string;
    nombre: string;
    descripcion: string;
};

export type Contacto = {
    id: string;
    nombre: string;
    telefono: string;
    comentarios?: string;
};

export type Correo = {
    id: string;
    seguroId: string;
    nombre: string;
    direccionEmail: string;
    comentarios?: string;
};

export type Archivo = {
    id: string;
    seguroId: string;
    nombreArchivo: string;
    urlAlmacenamiento: string;
};

export type UsuarioPortal = {
    id: string;
    nombreUsuario: string;
    email: string;
};

export type Logo = {
    id: string;
    seguroId: string;
    nombreArchivo: string;
    urlAlmacenamiento: string;
};

export type Popup = {
    id: string;
    seguroId: string;
    titulo: string;
    mensaje: string;
    fechaInicio: string;
    fechaFin: string;
};
