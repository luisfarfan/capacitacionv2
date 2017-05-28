/**
 * Created by Administrador on 26/05/2017.
 */
import {PermisoService} from '../permisos/permisos.service';
import * as utils from '../utils';
export default class PermisosView {
    private permisoService: PermisoService = new PermisoService();
    public visualiza: number = 0;

    constructor(private idcurso: number) {
        this.getVisualiza(this.idcurso);
    }

    getVisualiza(curso: number) {
        this.permisoService.visualiza(curso).done((response) => {
            this.visualiza = response.visualiza
            console.log(this.visualiza);
        });
    }

    ucan(callback: Function) {
        if (this.visualiza == 0) {
            callback();
        } else {
            utils.showInfo('Usted no tiene permisos para este modulo!', 'error');
        }
    }
}
