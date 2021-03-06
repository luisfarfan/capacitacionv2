/**
 * Created by lfarfan on 12/03/2017.
 */
import {CursoService} from './locales_consecucion/locales.service';
import {ICurso} from './locales_consecucion/local.interface';
import * as utils from './core/utils';
declare var BASEURL: string;
declare var ROL: string;
export class CursoInyection {
    curso_id: any;
    cursoService = new CursoService();
    cursos: ICurso[];
    public curso_selected: ICurso;
    etapa_id: number = null;

    constructor(private callback: Function = null) {
        this.setearCurso();
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
            if ($('#cursos').val() != "-1" && $('#cursos').val() != "") {
                utils.insertParam('curso', $('#cursos').val())
            }
        });
        this.triggerCurso();
        // $('#btn_actualizar_menu').on('click', () => {
        //     if ($('#cursos').val() != "-1" && $('#cursos').val() != "") {
        //         utils.insertParam('curso', $('#cursos').val())
        //     }
        // })
    }

    saveCursoSession(curso_id: number) {
        this.curso_id = curso_id;
        localStorage.setItem('curso_id', `${this.curso_id}`);
        localStorage.setItem('etapa_id', `${this.curso_id}`);
    }

    triggerCurso() {
        let etapa_id: any = localStorage.getItem('etapa_id');
        this.etapa_id = etapa_id;
        $('#etapa').val(etapa_id)
        this.getCursos(etapa_id);
    }

    setCurso() {
        return localStorage.getItem('curso_id');
    }

    setearCurso() {
        this.curso_id = parseInt(localStorage.getItem('curso_id'))
    }

    getCursos(etapa_id: number) {
        this.cursoService.get(etapa_id, ROL).done((cursos) => {
            this.cursos = cursos;
            utils.setDropdown(this.cursos, {id: 'id_curso', text: ['nombre_curso']}, {
                id_element: 'cursos',
                bootstrap_multiselect: true,
                select2: false
            });
            let curso_id = localStorage.getItem('curso_id');
            this.curso_id = parseInt(curso_id);
            $('#cursos').val(curso_id);
            this.cursos.filter((curso: ICurso, index: number) => curso.id_curso == parseInt(curso_id) ? this.curso_selected = curso : '');
            // $('#cursos').val(curso_id).trigger('change');
        });
    }
}
