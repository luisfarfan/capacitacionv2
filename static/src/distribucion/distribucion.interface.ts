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