/**
 * Created by lfarfan on 12/03/2017.
 */
declare var BASEURL: string;
export class DistribucionService {
    private url_localzona: string = `${BASEURL}/distribucion/localzona/`;
    private url_localzonaDetalle: string = `${BASEURL}/distribucion/localzona_detalle/`;
    private url_asignarZonas: string = `${BASEURL}/distribucion/asignarZonas/`;
    private url_zonas_libres: string = `${BASEURL}/distribucion/zonas_libres_por_asignar/`;
    private url_localambientes_detalle: string = `${BASEURL}/distribucion/localambiente_detalle/`;
    private url_personal_bylocalcurso: string = `${BASEURL}/distribucion/personalcapacitar_bylocalcurso/`;
    private url_distribuir: string = `${BASEURL}/distribucion/distribuir/`;


    filterLocalZona(pk: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localzonaDetalle}${pk}/`,
        });
    }

    filterLocalAmbientes(localcurso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localambientes_detalle}${localcurso}/`,
        });
    }

    getPersonalbylocalCurso(localcurso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_personal_bylocalcurso}${localcurso}/`,
        });
    }

    distribuirPersonal(localcurso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_distribuir}${localcurso}/`,
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