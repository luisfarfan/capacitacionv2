/**
 * Created by Administrador on 22/05/2017.
 */
import {CursoInyection} from './comun.utils';
import * as utils from './core/utils';

class HomeController extends CursoInyection {
    private paramsUrl: any = null;

    constructor() {
        super();
        // this.setEvents();
        this.paramsUrl = this.getSearchParameters();
        if (this.curso_selected && this.paramsUrl == null) {
            utils.insertParam('curso', this.curso_selected.id_curso);
        }
    }

    setEvents() {
        // $('.bootstrap-select').on('change', (element: JQueryEventObject) => {
        //     if ($(element.currentTarget).val() == "") this.etapaSelected = null;
        //     else this.etapaSelected = $(element.currentTarget).val();
        //
        //     this.getCursos();
        // });
    }

    transformToAssocArray(prmstr: any) {
        var params: any = {};
        var prmarr = prmstr.split("&");
        for (var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            params[tmparr[0]] = tmparr[1];
        }
        return params;
    }

    getSearchParameters() {
        var prmstr = window.location.search.substr(1);
        return prmstr != null && prmstr != "" ? this.transformToAssocArray(prmstr) : null;
    }
}

new HomeController()