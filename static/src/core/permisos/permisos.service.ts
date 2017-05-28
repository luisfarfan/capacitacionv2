/**
 * Created by Administrador on 26/05/2017.
 */
declare var BASEURL: string;
declare var MODULO: string;
declare var ROL: string;
export class PermisoService {
    private url_visualiza: string = `${BASEURL}/visualizaRolCurso/`;

    visualiza(curso: number): JQueryXHR {
        let url: string = `${this.url_visualiza}${ROL}/${curso}/${MODULO}/`;
        return $.getJSON(url)
    }
}