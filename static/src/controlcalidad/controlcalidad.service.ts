/**
 * Created by Administrador on 23/05/2017.
 */
declare var BASEURL: string;
declare var SEGURIDADBASEURL: string;
export class ControlCalidadService {
    private url_localescurso: string = `${BASEURL}/controlcalidad/localescurso/`;
    private url_aulaslocal: string = `${BASEURL}/controlcalidad/aulaslocal/`;
    private url_analistas: string = `${SEGURIDADBASEURL}/services/userbyrol/anacal/`;
    private url_usuariolocales: string = `${BASEURL}/controlcalidad/usuariolocales/`;


    getLocalesCurso(curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localescurso}${curso}/`,
            type: 'GET'
        })
    }

    getAulas(local: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_aulaslocal}${local}/`,
            type: 'GET'
        })
    }

    getAnalistas(): JQueryXHR {
        return $.ajax({
            url: this.url_analistas,
            type: 'GET'
        })
    }

    add_userLocal(object: Object): JQueryXHR {
        return $.ajax({
            url: this.url_usuariolocales,
            type: 'POST',
            data: object
        })
    }

    delete_userLocal(pk: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_usuariolocales}${pk}/`,
            type: 'DELETE',
        })
    }

    put_userLocal(pk: number, object: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url_usuariolocales}${pk}/`,
            type: 'PUT',
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