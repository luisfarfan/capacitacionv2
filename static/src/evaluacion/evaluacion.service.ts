/**
 * Created by Administrador on 16/03/2017.
 */
/**
 * Created by lfarfan on 12/03/2017.
 */
declare var BASEURL: string;
export class EvaluacionService {
    private url_criterioscurso: string = `${BASEURL}/evaluacion/criterioscurso/`;
    private url_criterios_curso: string = `${BASEURL}/evaluacion/criteriosdetalle_curso/`;
    private url_saveNotas: string = `${BASEURL}/evaluacion/saveNotas/`;

    criteriosCurso(id_curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_criterioscurso}${id_curso}/`
        });
    }

    criteriosDetalleCurso(id_curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_criterios_curso}${id_curso}/`
        });
    }

    saveNotas(object: Array<Object>) {
        return $.ajax({
            url: this.url_saveNotas,
            type: 'POST',
            data: {personalnotas: JSON.stringify(object)}
        })
    }

    post(object: Object): JQueryXHR {
        return $.ajax({
            type: 'POST',
            data: object
        })
    }

    put(pk: number, object: Object): JQueryXHR {
        return $.ajax({
            type: 'PUT',
            data: object
        })
    }

    patch(pk: number, object: Object): JQueryXHR {
        return $.ajax({
            type: 'PATCH',
            data: object
        })
    }

}
