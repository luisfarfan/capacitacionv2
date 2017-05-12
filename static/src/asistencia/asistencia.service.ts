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
            type: 'GET'
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
    private url_localambientes_bylocal: string = `${BASEURL}/asistencia/localambientes_bylocal/`;
    private url_localcurso: string = `${BASEURL}/asistencia/localcurso/`;
    private url_getrangofechas: string = `${BASEURL}/asistencia/getrangofechas/`;
    private url_personalaula: string = `${BASEURL}/asistencia/personalaula_bylocalambiente/`;
    private url_saveAsistencia: string = `${BASEURL}/asistencia/saveAsistencia/`;
    private url_saveAsistenciaEmpadronadorUrbano: string = `${BASEURL}/asistencia/saveAsistenciaEmpadronadorUrbano/`;
    private url_darAlta: string = `${BASEURL}/asistencia/darAlta/`;
    private url_cerrarCursoEmpadronador: string = `${BASEURL}/evaluacion/cerrarCursoEmpadronador/`;
    private url_deshacerBaja: string = `${BASEURL}/asistencia/deshacerBaja/`;


    getAulasbyInstructor(id_instructor: number, curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localambienteInstructor}${id_instructor}/${curso}/`
        })
    }

    getAulasbyLocal(id_local: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localambientes_bylocal}${id_local}/`
        })
    }

    cerrarCursoEmpadronador(object: Array<number>) {
        return $.ajax({
            url: this.url_cerrarCursoEmpadronador,
            type: 'POST',
            data: {data: JSON.stringify(object)}
        });
    }

    saveAsistencia(data: Array<Object>) {
        return $.ajax({
            url: this.url_saveAsistencia,
            type: 'POST',
            data: {personalasistencia: JSON.stringify(data)}
        });
    }

    saveAsistenciaEmpadronadorUrbano(data: Array<Object>) {
        return $.ajax({
            url: this.url_saveAsistenciaEmpadronadorUrbano,
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

    darAlta(id_localambiente: number, id_pea: number, id_pea_reemplazo: number) {
        return $.ajax({
            url: this.url_darAlta,
            type: 'POST',
            data: {id_localambiente: id_localambiente, id_pea: id_pea, id_pea_reemplazo: id_pea_reemplazo}
        });
    }

    deshacerBaja(id_pea: number): JQueryXHR {
        return $.ajax({
            url: this.url_deshacerBaja,
            type: 'POST',
            data: {id_pea: id_pea}
        })
    }
}

export class PersonalService extends ModelService {
    private urlPersonal: string = `${BASEURL}/asistencia/personal/`;
    private urlPersonalDetalle: string = `${BASEURL}/asistencia/personaldetalle/`;

    get(pk: number = null): JQueryXHR {
        return $.ajax({})
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
            url: `${this.urlPersonal}${pk}/`,
            type: 'PATCH',
            data: object
        })
    }
}