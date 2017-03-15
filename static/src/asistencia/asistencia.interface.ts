/**
 * Created by Administrador on 13/03/2017.
 */
import {IAmbiente, ILocal} from '../locales_consecucion/local.interface';
import {IPersonal} from '../distribucion/distribucion.interface';
export interface ILocalAmbienteAsignados {
    id_localambiente: number,
    numero: number,
    n_piso: number,
    capacidad: number,
    localcurso: ILocalCurso,
    id_ambiente: IAmbiente,
    id_instructor: number
}

interface ILocalCurso {
    id: number,
    local: ILocal
}
export interface IPersonalAsistenciaDetalle {
    id_peaaula: number,
    personalaula: IPersonalAula[],
    id_pea: IPersonal,
    id_localambiente: number
}
export interface IPersonalAula {
    fecha: string,
    id: number,
    peaaula: number,
    turno_manana: number,
    turno_tarde: number,
}
