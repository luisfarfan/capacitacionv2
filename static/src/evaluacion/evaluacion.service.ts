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
    private url_saveNotasFinal: string = `${BASEURL}/evaluacion/saveNotasFinal/`;
    private url_cargos_curso: string = `${BASEURL}/evaluacion/cargos_curso/`;
    private url_personalaula_notafinal: string = `${BASEURL}/evaluacion/personalaula_notafinal/`;
    private url_ambitosRankeo: string = `${BASEURL}/evaluacion/ambitosRankeo/`;


    criteriosCurso(id_curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_criterioscurso}${id_curso}/`
        });
    }

    ambitos(ccdd: string = null, ccpp: string = null, ccdi: string = null): JQueryXHR {
        let url = `${this.url_ambitosRankeo}`;
        if (ccdd != null) {
            url += `${ccdd}/`
        }
        if (ccpp != null) {
            url += `${ccpp}/`
        }
        if (ccdi != null) {
            url += `${ccdi}/`
        }
        return $.ajax({
            url: url
        });
    }

    cargosCurso(id_curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_cargos_curso}${id_curso}/`
        });
    }

    filterPersonalNotaFinal(ubigeo: string, zona: string, cargo: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_personalaula_notafinal}${ubigeo}/${zona}/${cargo}/`
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

    saveNotasFinal(object: Array<Object>) {
        return $.ajax({
            url: this.url_saveNotasFinal,
            type: 'POST',
            data: {personalnotasfinal: JSON.stringify(object)}
        })
    }

    post(object: Object): JQueryXHR {
        return $.ajax({
            type: 'POST',
            data: object
        });
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
