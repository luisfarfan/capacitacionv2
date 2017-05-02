declare var BASEURL: string;
export class ReporteService {

    private url_listareportes: string = `${BASEURL}/reportes/getreportes/`
    private url_locales: string = `${BASEURL}/ubigeo/locales/`
    private url_aulas: string = `${BASEURL}/distribucion/localambiente_detalle/`
    //localambiente_detalle

    listaReportes(): JQueryXHR {
        return $.ajax({
            url: this.url_listareportes,
        })
    }

    getLocales(curso: number, ubigeo: string, zona: string): JQueryXHR {
        return $.ajax({
            url: `${this.url_locales}${curso}/${ubigeo}/${zona}/`,
        })
    }

    reporteDinamico(url_params: string): JQueryXHR {
        return $.ajax({
            url: url_params,
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