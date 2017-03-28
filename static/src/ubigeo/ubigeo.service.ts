/**
 * Created by Administrador on 3/03/2017.
 */
declare var BASEURL: string;

interface UbigeoUrls {
    departamentos: string,
    provincias: string,
    distritos: string,
    zonas: string,
}
export default class UbigeoService {
    private url: UbigeoUrls = {
        departamentos: `${BASEURL}/ubigeo/departamentos/`,
        provincias: `${BASEURL}/ubigeo/provincias/`,
        distritos: `${BASEURL}/ubigeo/distritos/`,
        zonas: `${BASEURL}/ubigeo/zonas/`,
    }

    getDepartamentos(): JQueryXHR {
        return $.ajax({
            async:false,
            url: this.url.departamentos,
        });
    }

    getProvincias(ccdd: string): JQueryXHR {
        return $.ajax({
            async:false,
            url: `${this.url.provincias}${ccdd}/`,
        });
    }

    getDistritos(ccdd: string, ccpp: string): JQueryXHR {
        return $.ajax({
            async:false,
            url: `${this.url.distritos}${ccdd}/${ccpp}/`,
        });
    }

    getZonas(ubigeo: string): JQueryXHR {
        return $.ajax({
            async:false,
            url: `${this.url.zonas}${ubigeo}/`,
        });
    }
}