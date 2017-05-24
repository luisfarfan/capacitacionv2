/**
 * Created by Administrador on 23/05/2017.
 */
export interface IAnalista {
    id: number,
    rol: IRol,
    tipousuario: {
        id: number,
        nombre: string,
        descripcion: string
    },
    dni: string,
    ape_pat: string,
    ape_mat: string,
    nombre: string,
}

export interface IRol {
    id: number,
    nombre: string,
    descripcion: string,
    codigo: string,
}

export interface ILocal {
    id_local: number,
    km_direccion: number,
    lote_direccion: number,
    mz_direccion: number,
    n_direccion: number,
    nombre_local: string,
    nombre_via: string,
    piso_direccion: number
    referencia: string,
    responsable_celular: string,
    responsable_email: string,
    responsable_nombre: string,
    responsable_telefono: string,
    telefono_local_celular: string,
    telefono_local_fijo: string,
    tipo_via: number
    total_aulas: number
    total_disponibles: number
    turno_uso_local: number
    ubigeo: string
    usar: number
    zona_ubicacion_local: string,
    seleccionar: number,
    instructor: number,
    localusuario: number
}