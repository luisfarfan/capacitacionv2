import {IPersonal} from "../distribucion/distribucion.interface";
/**
 * Created by Administrador on 16/03/2017.
 */
export interface ICursoCriterios {
    id_curso: number,
    criterios: any,
    cod_curso: string,
    nombre_curso: string,
    nota_minima: number,
    etapa: number,
}
export interface IDetalleCriterio {
    cursocriterio: number,
    ponderacion: number,
    curso: number,
    criterio: number
}

export interface ICriterio {
    id_criterio: number,
    nombre_criterio: string,
    descripcion_criterio: string,
}
export interface ICargoFuncionalDetalle {
    id_cursocargofuncional: number,
    id_cargofuncional: ICargoFuncional,
    id_curso: 3
}
export interface ICargoFuncional {
    id_cargofuncional: number,
    nombre_funcionario: string
}

export interface IPeaNotaFinal {
    id_localambiente: number,
    id_pea: IPersonal,
    id_peaaula: number,
    personalaula_notafinal: IPeanotafinal[]
}
export interface IPeaNotaFinal_sin {
    id_localambiente: number,
    id_pea: number,
    id_peaaula: number,
    personalaula_notafinal: IPeaNotaFinalSinInternet_new[]
}

export interface IPeanotafinal {
    bandaprob: number,
    capacita: number,
    seleccionado: number,
    notacap: number,
    sw_titu: number,
    id: number,
    nota_final: number
    peaaula: number
}
export interface IPeaNotaFinalSinInternet {
    bandaprob: number,
    capacita: number,
    seleccionado: number,
    notacap: number,
    sw_titu: number,
    id: number,
    nota_final: any
    pea: IPersonal
}

export interface IPeaNotaFinalSinInternet_new {
    bandaprob: number,
    capacita: number,
    seleccionado: number,
    notacap: number,
    sw_titu: number,
    id: number,
    nota_final: number
}