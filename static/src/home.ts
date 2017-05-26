/**
 * Created by Administrador on 22/05/2017.
 */
import {CursoInyection} from './comun.utils';
import {CursoService} from './locales_consecucion/locales.service';
import {ICurso} from './locales_consecucion/local.interface';

class HomeController {
    private cursos: ICurso[] = [];
    private etapaSelected: number = null;
    private cursoService: CursoService = new CursoService();

    constructor() {
        new CursoInyection();
        // this.setEvents();
    }

    setEvents() {
        // $('.bootstrap-select').on('change', (element: JQueryEventObject) => {
        //     if ($(element.currentTarget).val() == "") this.etapaSelected = null;
        //     else this.etapaSelected = $(element.currentTarget).val();
        //
        //     this.getCursos();
        // });
    }

    getCursos() {
        if (this.etapaSelected) {
            this.cursoService.get(this.etapaSelected).done((cursos) => {
                this.cursos = cursos;
                this.drawCursos();
            })
        } else {
            this.drawCursos(false);
        }

    }

    drawCursos(etapa: boolean = true) {
        let html = '';
        if (etapa) {
            this.cursos.map((curso: ICurso, index: number) => {
                html += `<tr>
                             <td>${$('.bootstrap-select :selected').text()}</td>
                             <td>${curso.nombre_curso}</td>
                             <td><span class="label label-success">En proceso</span></td>
                             <td><button type="button" class="btn btn-info btn-xs legitRipple"><i class="icon-comment-discussion position-left"></i>Ingresar</button></td>
                         </tr>`
            })
        }
        $('#tabla_cursos').find('tbody').html(html);
    }
}

new HomeController()