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

export interface IGrupoTitulo {
    titulo1: string,
    conjunto: number,
    formato: null,
    tipo_titulo: number
}

export  interface IGrupoPregunta {
    id: number,
    nombre: string,
    conjunto: number,
    grupo: number,
    tipo: number
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
    tipo_via: number,
    total_aulas: number,
    total_disponibles: number,
    turno_uso_local: number,
    ubigeo: string,
    usar: number
    zona_ubicacion_local: string,
    seleccionar: number,
    instructor: number,
    localusuario: number,
    cantidad_usar_aulas: number,
    id_directoriolocal_id: number

}

export interface IAula {
    capacidad: number,
    id_ambiente: number,
    id_instructor: number,
    id_localambiente: number,
    localcurso: number,
    n_piso: number,
    numero: number,
    disponible: number
}

export interface IInstructor {
    auna: number,
    instructor: number,
    local: number
}

export interface IInstAulas {
    id_instructor: number
}

export interface IManual {
    id: number,
    nombre: string,
    curso: number
}

export interface IRespuesta {
    id_local: number
    local: number
    pregunta: number,
    opcion: IOpcion,
    cantidad: string
}

export interface IOpcion {
    pregunta: number,
    opcion: string,
}

export interface IRDurante {
    instructor: number
    aula: number
    fecha: string,
    pregunta: number,
    opcion: IOrespuestas,
}

export interface IOrespuestas {
    respuesta1: number,
    respuesta2: number,
    respuesta3: number,
    respuesta4: number,
}

export interface IRespuestaLocal {
    id: number,
    llave: number,
    pregunta: number,
    opcional: string,
    respuesta_texto: string,
    curso: number,
    local: number,
    opcionselected: number
}

export interface IRespuestaManual {
    id: number,
    llave: number,
    pregunta: 11,
    respuesta_texto: string,
    opcional: string,
    cantidad: string,
    curso: number,
    cantidaddocumentos: number,
    cantidaddodefectuosos: number,
    aula: number,
    opcionselected: number,
    manual: number
}

export  interface  IRespuestaAula {
    id: number,
    local: number,
    llave: number,
    pregunta: number,
    respuesta_texto: string,
    opcional: string,
    curso: number,
    aula: number,
    opcionselected: number
}

export interface  ICManual {
    id: number,
    manual: number,
    capitulo: number
}

export interface  ICapitulo {
    id: number,
    nombre: string
}
