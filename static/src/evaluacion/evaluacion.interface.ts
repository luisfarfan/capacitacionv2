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