import {FilterFields} from "./distribucion.interface";
/**
 * Created by lfarfan on 12/03/2017.
 */
declare var BASEURL: string;

export class DistribucionService {
    private url_localzona: string = `${BASEURL}/distribucion/localzona/`;
    private url_localambito: string = `${BASEURL}/distribucion/localambito/`;
    private url_localzonaDetalle: string = `${BASEURL}/distribucion/localzona_detalle/`;
    private url_asignarZonas: string = `${BASEURL}/distribucion/asignarZonas/`;
    private url_zonas_libres: string = `${BASEURL}/distribucion/zonas_libres_por_asignar/`;
    private url_ambitoslibres: string = `${BASEURL}/distribucion/ambitoslibres/`;
    private url_localambientes_detalle: string = `${BASEURL}/distribucion/localambiente_detalle/`;
    private url_personal_bylocalcurso: string = `${BASEURL}/distribucion/personalcapacitar_bylocalcurso/`;
    private url_distribuir: string = `${BASEURL}/distribucion/distribuir/`;
    private url_personalaula: string = `${BASEURL}/distribucion/personalaula/`;
    private url_crudpersonalaula: string = `${BASEURL}/distribucion/crudpersonalaula/`;


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

    getPersonalbylocalCurso(localcurso: number, contingencia: boolean = false): JQueryXHR {
        return $.ajax({
            url: `${this.url_personal_bylocalcurso}${localcurso}/${contingencia ? '1/' : ''}`,
        });
    }

    distribuirPersonal(localcurso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_distribuir}${localcurso}/`,
        });
    }

    filterPersonalbyAula(localambiente_id: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_personalaula}${localambiente_id}/`,
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

    asignarZonas(data: Array<Object>): JQueryXHR {
        return $.ajax({
            url: `${this.url_asignarZonas}`,
            type: 'POST',
            data: {localambitos: JSON.stringify(data)},
        });
    }

    getZonasLibres(ambito: FilterFields): JQueryXHR {
        let url = `${this.url_ambitoslibres}${ambito.curso}/`;
        ambito.ccdd != null ? url += `${ambito.ccdd}/` : '';
        ambito.ccpp != null ? url += `${ambito.ccpp}/` : '';
        ambito.ccdi != null ? url += `${ambito.ccdi}/` : '';

        return $.ajax({
            url: url
        });
    }

    deleteLocalAmbito(localambiente: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localambito}${localambiente}/`,
            type: 'DELETE',
        });
    }

    updateLocalAmbiente(localambiente_id: number, object: Object) {
        return $.ajax({
            url: `${this.url_crudpersonalaula}${localambiente_id}/`,
            type: 'PUT',
            data: object
        });
    }
}
