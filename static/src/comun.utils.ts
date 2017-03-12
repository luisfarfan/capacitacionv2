/**
 * Created by lfarfan on 12/03/2017.
 */
import {CursoService} from './locales_consecucion/locales.service';
import {ICurso} from './locales_consecucion/local.interface';
import * as utils from './core/utils';
export class Curso {
    private curso_id: number;
    private cursoService = new CursoService();
    cursos: ICurso[];
    curso_selected: ICurso;

    constructor() {
        $('#etapa').on('change', (element: JQueryEventObject) => {
            this.getCursos($(element.currentTarget).val())
        });
        $('#cursos').on('change', (element: JQueryEventObject) => {
            let curso_val = $(element.currentTarget).val();
            this.cursos.filter((value: ICurso) => value.id_curso == curso_val ? this.curso_selected = value : '');
            curso_val == "-1" ? this.curso_selected = null : '';
        });
    }

    saveCursoSession(curso_id: number) {
        this.curso_id = curso_id;
        localStorage.setItem('curso_id', `${this.curso_id}`);
    }

    setCurso() {
        return localStorage.getItem('curso_id');
    }

    getCursos(etapa_id: number) {
        this.cursoService.get(etapa_id).done((cursos) => {
            this.cursos = cursos;
            utils.setDropdown(this.cursos, {id: 'id_curso', text: ['nombre_curso']}, {
                id_element: 'cursos',
                bootstrap_multiselect: true,
                select2: false
            })
        })
    }
}
