/**
 * Created by lfarfan on 12/03/2017.
 */
import {CursoService} from './locales_consecucion/locales.service';
import {ICurso} from './locales_consecucion/local.interface';
import * as utils from './core/utils';
export class CursoInyection {
    curso_id: number;
    cursoService = new CursoService();
    cursos: ICurso[];
    curso_selected: ICurso;
    etapa_id: number = null;

    constructor() {
        $('#etapa').on('change', (element: JQueryEventObject) => {
            this.getCursos($(element.currentTarget).val());
            $(element.currentTarget).val() == '' ? this.etapa_id = null : localStorage.setItem('etapa_id', $(element.currentTarget).val());
        });
        $('#cursos').on('change', (element: JQueryEventObject) => {
            let curso_val = $(element.currentTarget).val();
            this.cursos.filter((value: ICurso) => {
                if (value.id_curso == curso_val) {
                    this.curso_selected = value;
                    localStorage.setItem('curso_id', `${this.curso_selected.id_curso}`);
                }
            });
            curso_val == "-1" ? this.curso_selected = null : '';
        });
        this.triggerCurso();
    }

    saveCursoSession(curso_id: number) {
        this.curso_id = curso_id;
        localStorage.setItem('curso_id', `${this.curso_id}`);
        localStorage.setItem('etapa_id', `${this.curso_id}`);
    }

    triggerCurso() {
        let etapa_id = localStorage.getItem('etapa_id');
        $('#etapa').val(etapa_id).trigger('change');
    }

    setCurso() {
        return localStorage.getItem('curso_id');
    }

    getCurso() {

    }

    getCursos(etapa_id: number) {
        this.cursoService.get(etapa_id).done((cursos) => {
            this.cursos = cursos;
            utils.setDropdown(this.cursos, {id: 'id_curso', text: ['nombre_curso']}, {
                id_element: 'cursos',
                bootstrap_multiselect: true,
                select2: false
            });
            let curso_id = localStorage.getItem('curso_id');
            this.curso_id = parseInt(curso_id);
            $('#cursos').val(curso_id).trigger('change');
        })
    }
}
