/**
 * Created by lfarfan on 12/03/2017.
 */
declare var BASEURL: string;
export class DistribucionService {
    private url_localzona: string = `${BASEURL}/distribucion/localzona/`;
    private url_localzonaDetalle: string = `${BASEURL}/distribucion/localzona_detalle/`;
    private url_asignarZonas: string = `${BASEURL}/distribucion/asignarZonas/`;
    private url_zonas_libres: string = `${BASEURL}/distribucion/zonas_libres_por_asignar/`;


    get(pk: number = null): JQueryXHR {
        return $.ajax({
            url: pk === null ? this.url_localzonaDetalle : `${this.url_localzonaDetalle}${pk}/`,
        });
    }

    update(pk: number, obj: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url_localzona}${pk}/`,
            type: 'PUT',
            data: obj
        });
    }

    add(obj: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url_localzona}`,
            type: 'POST',
            data: obj,
        });
    }

    delete(pk: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localzona}${pk}/`,
            type: 'DELETE',
        });
    }

    asignarZonas(object: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url_asignarZonas}`,
            type: 'POST',
            data: object,
        });
    }

    getZonasLibres(curso: number, ubigeo: string): JQueryXHR {
        return $.ajax({
            url: `${this.url_zonas_libres}${curso}/${ubigeo}/`,
        });
    }
}