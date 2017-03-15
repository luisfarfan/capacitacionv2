/**
 * Created by Administrador on 13/03/2017.
 */
import {AsistenciaService} from 'asistencia.service';
import {CursoInyection} from '../comun.utils';
import {ILocalAmbienteAsignados, IPersonalAsistenciaDetalle, IPersonalAula} from './asistencia.interface';

import * as utils from '../core/utils';

declare var IDUSUARIO: number;
declare var $: any;


interface ModelDivAsistencia {
    id_personalaula: number,
    turno_manana: number,
    turno_tarde: number,
    fecha: string,
}

class AsistenciaView {
    private asistenciaService: AsistenciaService;
    private cursoInyection: CursoInyection;
    private localesAmbientes: ILocalAmbienteAsignados[] = [];
    private localAmbienteSelected: ILocalAmbienteAsignados = null;
    private rangoFechas: Array<string> = [];
    private personalAsistencia: IPersonalAsistenciaDetalle[];

    constructor() {
        this.asistenciaService = new AsistenciaService();
        this.cursoInyection = new CursoInyection();
        $('#cursos').on('change', (element: JQueryEventObject) => {
            let curso_id = $(element.currentTarget).val();
            $('#p_curso_actual').text($('#cursos :selected').text());
            this.getAulas(curso_id);
        });
        $('#select_aulas_asignadas').on('change', (element: JQueryEventObject) => {
            let selected = $(element.currentTarget).val();
            if (selected == '') {
                this.localAmbienteSelected = null;
            } else {
                this.localesAmbientes.map((value: ILocalAmbienteAsignados, index: number) => value.id_localambiente == selected ? this.localAmbienteSelected = value : '');
                $('#span_nombre_local').text(`${this.localAmbienteSelected.localcurso.local.nombre_local}`)
                $('#span_direccion').text(`${this.localAmbienteSelected.localcurso.local.referencia}`)
                $('#span_fecha_inicio').text(`${this.localAmbienteSelected.localcurso.local.fecha_inicio}`)
                $('#span_aula').text(`${this.localAmbienteSelected.numero}`);
                this.asistenciaService.getRangoFechas(this.localAmbienteSelected.localcurso.local.fecha_inicio, this.localAmbienteSelected.localcurso.local.fecha_fin).done((fechasRango) => {
                    this.rangoFechas = fechasRango;
                    this.drawHeaderFechas();
                    this.asistenciaService.getPersonalAsistenciaDetalle(this.localAmbienteSelected.id_localambiente).done((personalAsistencia) => {
                        this.personalAsistencia = personalAsistencia;
                        this.drawPersonal();
                    });
                });
            }
        });
        $('#span_nombre_instructor').text($('#span_usuario_nombre').text());
        $('#btn_save_asistencia').on('click', () => {
            this.saveAsistencia();
        })

        $('#btn_bajas_altas').on('click', () => {
            $('#modal_bajas_altas').modal('show');
        });
    }

    drawHeaderFechas() {
        let header: string = '';
        let subHeader: string = '<tr>';
        header += `<tr><th rowspan="2">N°</th><th rowspan="2">Nombre Completo</th><th rowspan="2">Cargo</th>`
        this.rangoFechas.map((fecha: string, index: number) => {
            header += `<th colspan="2">${fecha}</th>`
            subHeader += `<th>MAÑANA</th><th>TARDE</th>`
        });
        header += `</tr>`;
        $('#tabla_asistencia').find('thead').html(header + subHeader + '</tr>');
    }

    drawPersonal() {
        let tbody: string = '';
        this.personalAsistencia.map((value: IPersonalAsistenciaDetalle, index: number) => {
            tbody += `<tr>
                        <td>${index + 1}</td>
                        <td>${value.id_pea.ape_paterno} ${value.id_pea.ape_materno} ${value.id_pea.nombre}</td>
                        <td>${value.id_pea.id_cargofuncional.nombre_funcionario}</td>`
            this.rangoFechas.map((fecha: string, index: number) => {
                let divParams: ModelDivAsistencia = {
                    fecha: fecha,
                    id_personalaula: value.id_peaaula,
                    turno_manana: null,
                    turno_tarde: null
                };
                value.personalaula.map((personalaula: IPersonalAula, index: number) => {
                    if (personalaula.fecha == fecha) {
                        divParams.turno_manana = personalaula.turno_manana
                        divParams.turno_tarde = personalaula.turno_tarde
                    }
                });
                tbody += this.drawDivAsistencia(divParams);
            });
            tbody += `</tr>`
        });
        $('#tabla_asistencia').find('tbody').html(tbody);
        let tablaasistenciaDT = $('#tabla_asistencia').DataTable();
        tablaasistenciaDT.destroy();
        $('#tabla_asistencia').DataTable({
            "bPaginate": false,
        });
    }

    drawDivAsistencia(divParams: ModelDivAsistencia) {
        let turno_uso_local: number = this.localAmbienteSelected.localcurso.local.turno_uso_local;
        let json: String = JSON.stringify({fecha: divParams.fecha, id_personalaula: divParams.id_personalaula});
        let silverBrackground: string = `style="background-color: #dedede"`;
        return `<td ${turno_uso_local == 1 ? silverBrackground : ''}><div name="divTurnosManana" data-value=${json} class="form-group">
                    <div class="checkbox checkbox-right">
                        <label style="display: table;">
                            <input type="radio" ${turno_uso_local == 1 ? 'disabled' : ''}
                             name="turno_manana${divParams.fecha}${divParams.id_personalaula}"
                            ${divParams.turno_manana == 0 ? 'checked' : ''} value="0">
                            Puntual
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: table;">
                            <input type="radio" ${turno_uso_local == 1 ? 'disabled' : ''}
                             name="turno_manana${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_manana == 1 ? 'checked' : ''} value="1">
                            Tardanza
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: table;">
                            <input type="radio" ${turno_uso_local == 1 ? 'disabled' : ''}
                             name="turno_manana${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_manana == 2 ? 'checked' : ''} value="2">
                            Falta
                        </label>
                    </div>
				</div></td>
                <td ${turno_uso_local == 0 ? silverBrackground : ''}><div name="divTurnosTarde" data-value=${json} class="form-group">
                    <div class="checkbox checkbox-right">
                        <label style="display: flex;">
                            <input type="radio" ${turno_uso_local == 0 ? 'disabled' : ''}
                             name="turno_tarde${divParams.fecha}${divParams.id_personalaula}" 
                            ${divParams.turno_tarde == 0 ? 'checked' : ''} value="0">
                            Puntual
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: flex;">
                            <input type="radio" ${turno_uso_local == 0 ? 'disabled' : ''} 
                            name="turno_tarde${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_tarde == 1 ? 'checked' : ''} value="1">
                            Tardanza
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: flex;">
                            <input type="radio" ${turno_uso_local == 0 ? 'disabled' : ''}
                             name="turno_tarde${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_tarde == 2 ? 'checked' : ''} value="2">
                            Falta
                        </label>
                    </div>
				</div></td>`;
    }

    saveAsistencia() {
        let divsManana = $('[name="divTurnosManana"]')
        let divsTarde = $('[name="divTurnosTarde"]')
        let request: Array<any> = []
        divsManana.map((index: number, domElement: Element) => {
            let radioButton: Array<any> = $(domElement).find('input[name^="turno"]:checked')
            if (radioButton.length) {
                request.push({
                    id_personalaula: $(domElement).data('value').id_personalaula,
                    fecha: $(domElement).data('value').fecha,
                    turno_manana: $(radioButton[0]).val(),
                    turno_tarde: null,
                })
            }
        });
        divsTarde.map((index: number, domElement: Element) => {
            let radioButton: Array<any> = $(domElement).find('input[name^="turno"]:checked');
            let id_personalaula = $(domElement).data('value').id_personalaula;
            let fecha = $(domElement).data('value').fecha;
            if (radioButton.length) {
                let exist: boolean = false;
                request.map((value: any, index: number) => {
                    if (value.id_personalaula == id_personalaula && value.fecha == fecha) {
                        request[index].turno_tarde = $(radioButton[0]).val();
                        exist = true
                    }
                });
                if (!exist) {
                    request.push({
                        id_personalaula: $(domElement).data('value').id_personalaula,
                        fecha: $(domElement).data('value').fecha,
                        turno_manana: null,
                        turno_tarde: $(radioButton[0]).val()
                    });
                }
            }
        });
        if (!request.length) {
            utils.showInfo('No ha marcado la asistencia de ninguna, no puede guardar aún');
            return false;
        }
        utils.alert_confirm(() => {
            this.asistenciaService.saveAsistencia(request).done((response) => {
                utils.showSwalAlert('La asistencia fue guardad con éxito!', 'Exito', 'success');
            });
        }, 'Esta seguro de guardar la asistencia?', 'success');
    }
    
    getAulas(curso_id: number) {
        this.asistenciaService.getAulasbyInstructor(IDUSUARIO, curso_id).done((aulas: ILocalAmbienteAsignados[]) => {
            this.localesAmbientes = aulas;
            let html: string = '';
            html += `<option value="">Seleccione Aula</option>`
            this.localesAmbientes.map((value: ILocalAmbienteAsignados, index: number) => {
                html += `<option value="${value.id_localambiente}">${value.id_ambiente.nombre_ambiente} - N° ${value.numero}</option>`
            });
            $('#select_aulas_asignadas').html(html);
        })
    }
}
new AsistenciaView();