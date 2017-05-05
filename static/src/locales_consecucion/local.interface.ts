/**
 * Created by Administrador on 3/03/2017.
 */
export interface ILocal {
    id_local: number;
    ubigeo: string;
    nombre_local: string;
    zona_ubicacion_local: string;
    tipo_via: string;
    nombre_via: string;
    referencia: string;
    n_direccion: string;
    km_direccion: string;
    mz_direccion: string;
    lote_direccion: string;
    piso_direccion: string;
    telefono_local_fijo: string;
    telefono_local_celular: string;
    fecha_inicio: string;
    fecha_fin: string;
    turno_uso_local: number;
    capacidad_local_total: string;
    capacidad_local_usar: string;
    funcionario_nombre: string;
    funcionario_email: string;
    funcionario_cargo: string;
    funcionario_celular: string;
    responsable_nombre: string;
    responsable_email: string;
    responsable_telefono: string;
    responsable_celular: string;
    cantidad_total_aulas: number;
    cantidad_disponible_aulas: number;
    cantidad_usar_aulas: number;
    cantidad_total_auditorios: number;
    cantidad_disponible_auditorios: number;
    cantidad_usar_auditorios: number;
    cantidad_total_sala: number;
    cantidad_disponible_sala: number;
    cantidad_usar_sala: number;
    cantidad_total_oficina: number;
    cantidad_disponible_oficina: number;
    cantidad_usar_oficina: number;
    cantidad_total_otros: number;
    cantidad_disponible_otros: number;
    cantidad_usar_otros: number;
    especifique_otros: string;
    cantidad_total_computo: number;
    cantidad_disponible_computo: number;
    cantidad_usar_computo: number;
    id_directoriolocal: number;
    total_aulas: number,
    total_disponibles: number,
    usar: number
}

export interface ILocalCurso {
    id: number,
    local: ILocal,
    curso: number,
    ambienteslocalcurso: ILocalAmbiente[]
}

export interface ILocalAmbiente {
    id_localambiente: number,
    numero: number,
    n_piso: number,
    capacidad: number,
    localcurso: ILocalCurso,
    id_ambiente: any
}

export interface ICurso {
    id_curso: number,
    nombre_curso: string,
    nota_minima: number,
    etapa: number
}

export interface ILocalAmbienteDetail {
    id_localambiente: number,
    numero: number,
    n_piso: number,
    capacidad: number,
    localcurso: number,
    id_ambiente: IAmbiente,
    id_instructor: number
}

export interface IAmbiente {
    id_ambiente: number,
    nombre_ambiente: string,
}
