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
}

export interface ICargoFuncional {
    id_cargofuncional: number,
    nombre_funcionario: string,
}