/**
 * Created by Administrador on 13/03/2017.
 */
import {ModelService} from '../abstractService';
declare var BASEURL: string;
export class PersonalAsistenciaService extends ModelService {
    private url_personalAsistencia: string = ``;

    get(pk: number = null): JQueryXHR {
        return $.ajax({
            url: this.url_personalAsistencia,
            type: 'PUT'
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

export class AsistenciaService {
    private url_localambienteInstructor: string = `${BASEURL}/asistencia/localambientes_instructor/`;
    private url_localcurso: string = `${BASEURL}/asistencia/localcurso/`;
    private url_getrangofechas: string = `${BASEURL}/asistencia/getrangofechas/`;
    private url_personalaula: string = `${BASEURL}/asistencia/personalaula_bylocalambiente/`;
    private url_saveAsistencia: string = `${BASEURL}/asistencia/saveAsistencia/`;

    getAulasbyInstructor(id_instructor: number, curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localambienteInstructor}${id_instructor}/${curso}/`
        })
    }

    saveAsistencia(data: Array<Object>) {
        return $.ajax({
            url: this.url_saveAsistencia,
            type: 'POST',
            data: {personalasistencia: JSON.stringify(data)}
        });
    }

    getPersonalAsistenciaDetalle(id_localambiente: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_personalaula}${id_localambiente}/`
        })
    }

    getLocalbyAula(localcurso_id: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localambienteInstructor}${localcurso_id}/`
        })
    }

    getRangoFechas(fechainicio: string, fechafin: string) {
        return $.ajax({
            url: this.url_getrangofechas,
            type: 'POST',
            data: {fecha_inicio: fechainicio, fecha_fin: fechafin}
        });
    }
}