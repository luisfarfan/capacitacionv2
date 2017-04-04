declare var BASEURL: string;
export class ReporteService {

    private url_listareportes: string = `${BASEURL}/reportes/getreportes/`

    listaReportes(): JQueryXHR {
        return $.ajax({
            url: this.url_listareportes,
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