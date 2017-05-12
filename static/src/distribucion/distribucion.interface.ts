/**
 * Created by lfarfan on 12/03/2017.
 */

import {IZona} from '../ubigeo/ubigeo.interface';
export interface ILocalZona {
    id: number,
    localcurso: number,
    zona: IZona,
}
export interface IPersonal {
    id_pea: number,
    id_per: number,
    dni: number,
    ape_paterno: string,
    ape_materno: string,
    nombre: string,
    id_convocatoriacargo: number,
    zona: string,
    contingencia: string,
    id_cargofuncional: ICargoFuncional,
    ubigeo: string,
    baja_estado: number,
    alta_estado: number,
    id_pea_reemplazo: IPersonal,
    celular: string,
    correo: string,
}

export interface ICargoFuncional {
    id_cargofuncional: number,
    nombre_funcionario: string,
}

export interface IPersonalAula {
    id_instructor: number,
    id_localambiente: number,
    id_pea: IPersonal,
    id_peaaula: number,
}


export interface IUbigeo {
    ubigeo: string,
    ccdd: string,
    ccpp: string,
    ccdi: string,
    departamento: string,
    provincia: string,
    distrito: string,
    zona: string,
}

export interface IZona {
    ID: string,
    UBIGEO: string,
    CODCCPP: string,
    ZONA: string
    LLAVE_CCPP: string
    LLAVE_ZONA: string
    ETIQ_ZONA: string
}
export interface FilterFields {
    ccdd: string,
    ccpp: string,
    ccdi: string,
    zona: string,
    curso: number
}
export interface IRol {
    id: number;
    modulo_rol: Array<any>;
    nombre: string;
    descripcion: string;
    codigo: string,
    rol: number,
}

export interface IUsuario {
    id: number,
    dni: number,
    ape_pat: string,
    ape_mat: string,
    nombre: string,
    fecha_contrato_inicio: string,
    fecha_contrato_extended: string,
    fecha_contrato_fin: string,
    fecha_nacimiento: string,
    email_inst: string,
    email_personal: string,
    usuario: string,
    clave: string,
    tipousuario: ITipoUsuario,
    activo: number,
    rol: IRol
}
export interface ITipoUsuario {
    id: number,
    nombre: string,
    descripcion: string,
}