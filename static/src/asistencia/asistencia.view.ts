/**
 * Created by Administrador on 13/03/2017.
 */
import {AsistenciaService, PersonalService} from 'asistencia.service';
import {DistribucionService} from '../distribucion/distribucion.service'
import {CursoInyection} from '../comun.utils';
import {ILocalAmbienteAsignados, IPersonalAsistenciaDetalle, IPersonalAula} from './asistencia.interface';

import * as utils from '../core/utils';
import {IPersonal} from "../distribucion/distribucion.interface";

declare var IDUSUARIO: number;
declare var $: any;


interface ModelDivAsistencia {
    id_personalaula: number,
    turno_manana: number,
    turno_tarde: number,
    fecha: string,
    baja: number,
    alta: number
}

class AsistenciaView {
    private asistenciaService: AsistenciaService;
    private personalService: PersonalService;
    private distribucionService: DistribucionService;
    private cursoInyection: CursoInyection;
    private localesAmbientes: ILocalAmbienteAsignados[] = [];
    private localAmbienteSelected: ILocalAmbienteAsignados = null;
    private rangoFechas: Array<string> = [];
    private personalAsistencia: IPersonalAsistenciaDetalle[];
    private personalparaBaja: IPersonal[] = [];
    private personaldadadeBaja: IPersonal[] = [];
    private personalContingencia: IPersonal[] = [];
    private pea_id: number = null;

    constructor() {
        this.asistenciaService = new AsistenciaService();
        this.personalService = new PersonalService();
        this.cursoInyection = new CursoInyection();
        this.distribucionService = new DistribucionService();
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
                $('#span_direccion').text(`${this.localAmbienteSelected.localcurso.local.nombre_via} - ${this.localAmbienteSelected.localcurso.local.n_direccion}`)
                $('#span_fecha_inicio').text(`${this.localAmbienteSelected.localcurso.local.fecha_inicio}`)
                $('#span_aula').text(`${this.localAmbienteSelected.numero}`);
                this.asistenciaService.getRangoFechas(this.localAmbienteSelected.localcurso.local.fecha_inicio, this.localAmbienteSelected.localcurso.local.fecha_fin).done((fechasRango) => {
                    this.rangoFechas = fechasRango;
                    this.drawHeaderFechas();
                    this.asistenciaService.getPersonalAsistenciaDetalle(this.localAmbienteSelected.id_localambiente).done((personalAsistencia) => {
                        this.personalAsistencia = personalAsistencia;
                        this.setPersonalParaBaja(true);
                        this.drawPersonal();
                        this.getContingencia();
                    });
                });
            }
        });
        $('#span_nombre_instructor').text($('#span_usuario_nombre').text());
        $('#btn_save_asistencia').on('click', () => {
            this.saveAsistencia();
        });

        $('#btn_bajas_altas').on('click', () => {
            $('#modal_bajas_altas').modal('show');
        });
        $('#btn_dar_baja').on('click', () => {
            this.darBaja();
        });
        $('#btn_dar_alta').on('click', (element: JQueryEventObject) => {
            this.darAlta(this.pea_id);
        });
    }

    setPersonalParaBaja(draw: boolean = false) {
        this.personalparaBaja = [];
        this.personaldadadeBaja = [];
        this.personalAsistencia.map((value: IPersonalAsistenciaDetalle, index: number) => {
            if (value.id_pea.baja_estado == 0) {
                this.personalparaBaja.push(value.id_pea)
            }
            if (value.id_pea.baja_estado == 1) {
                this.personaldadadeBaja.push(value.id_pea);
            }
        });
        if (draw) {
            utils.setDropdown(this.personalparaBaja, {
                id: 'id_pea',
                text: ['dni', 'ape_paterno', 'ape_materno', 'nombre']
            }, {id_element: 'select_personal_para_baja', bootstrap_multiselect: false, select2: true});
            let html: string = '';
            this.personaldadadeBaja.map((value: IPersonal, index: number) => {
                let alta: string = `<td>-</td><td>-</td><td>-</td><td>-</td><td>
                                    <button type="button" data-popup="tooltip" title="Dar de alta" name="btn_dar_alta"
                                    data-value="${value.id_pea}"
                                    class="btn btn-primary active btn-icon btn-rounded legitRipple"><i class="icon-thumbs-up2"></i></button>
                                    </td>`;
                if (value.id_pea_reemplazo) {
                    alta = `<td>${value.id_pea_reemplazo.ape_paterno}</td>
                            <td>${value.id_pea_reemplazo.ape_materno}</td>
                            <td>${value.id_pea_reemplazo.nombre}</td>
                            <td>${value.id_pea_reemplazo.dni}</td>
                            <td></td>`;
                }
                html += `<tr>
                           <td rowspan="2">${index + 1}</td>
                           <td rowspan="2">${value.id_cargofuncional.nombre_funcionario}</td>
                           <td style="background-color:#ffc1c1">BAJA</td>
                           <td>${value.ape_paterno}</td>
                           <td>${value.ape_materno}</td>
                           <td>${value.nombre}</td>
                           <td>${value.dni}</td>
                           <td></td>
                         </tr>
                         <tr>
                            <td style="background-color:#96e638">ALTA</td>
                             ${alta}
                         </tr>`
            });
            $('#tabla_baja_alta_reporte').find('tbody').html(html);
            utils.upgradeTooltip();
            $('[name="btn_dar_alta"]').on('click', (element: JQueryEventObject) => {
                this.pea_id = $(element.currentTarget).data('value');
                $('#modal_darAlta').modal('show')
            });
        }
    }

    getContingencia() {
        this.distribucionService.getPersonalbylocalCurso(this.localAmbienteSelected.localcurso.id, true).done((personalContingencia) => {
            this.personalContingencia = personalContingencia;
            utils.setDropdown(this.personalContingencia, {
                id: 'id_pea',
                text: ['dni', 'ape_paterno', 'ape_materno', 'nombre']
            }, {id_element: 'select_personal_para_alta', bootstrap_multiselect: false, select2: true});
        });
    }

    darAlta(id_pea: number) {
        let peaAltaSelected: number = $('#select_personal_para_alta').val();
        if (peaAltaSelected == -1) {
            utils.showInfo('Para dar de alta, tiene que seleccionar a alguna persona!');
            return false;
        }
        utils.alert_confirm(() => this._darAlta(id_pea, peaAltaSelected), 'Esta seguro de dar de alta a esta persona? Una vez dado de Alta, no podra rehacer el cambio.', 'warning');
    }

    _darAlta(id_pea: number, id_pea_reemplazo: number) {
        this.asistenciaService.darAlta(this.localAmbienteSelected.id_localambiente, id_pea, id_pea_reemplazo).done(() => {
            utils.showSwalAlert('La persona ha sido dado de alta!', 'Éxito', 'success')
            $('#select_aulas_asignadas').trigger('change');
            $('#modal_darAlta').modal('hide');
        })
    }

    drawHeaderFechas() {
        let header: string = '';
        let subHeader: string = '<tr>';
        header += `<tr><th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">N°</th>
                        <th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">Nombre Completo</th>
                        <th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">Cargo</th>`
        this.rangoFechas.map((fecha: string, index: number) => {
            header += `<th style="padding: 12px 20px;line-height: 1.5384616;" colspan="2">${fecha}</th>`
            subHeader += `<th>MAÑANA</th><th>TARDE</th>`
        });
        header += `</tr>`;
        $('#tabla_asistencia').find('thead').html(header + subHeader + '</tr>');
    }

    drawPersonal() {
        let tbody: string = '';
        this.personalAsistencia.map((value: IPersonalAsistenciaDetalle, index: number) => {
            if (value.id_pea.baja_estado == 1) {
                tbody += `<tr style="background-color: #ffc1c1">`;
            }
            else if (value.id_pea.alta_estado == 1) {
                tbody += `<tr style="background-color: #cdf7cd">`;
            } else {
                tbody += `<tr>`;
            }
            tbody += `<td>${index + 1}</td>
                      <td>${value.id_pea.ape_paterno} ${value.id_pea.ape_materno} ${value.id_pea.nombre}</td>
                      <td>${value.id_pea.id_cargofuncional.nombre_funcionario}</td>`
            this.rangoFechas.map((fecha: string, ind: number) => {
                let divParams: ModelDivAsistencia = {
                    fecha: fecha,
                    id_personalaula: value.id_peaaula,
                    turno_manana: null,
                    turno_tarde: null,
                    baja: value.id_pea.baja_estado,
                    alta: value.id_pea.alta_estado
                };
                value.personalaula.map((personalaula: IPersonalAula, index: number) => {
                    if (personalaula.fecha == fecha) {
                        divParams.turno_manana = personalaula.turno_manana
                        divParams.turno_tarde = personalaula.turno_tarde
                    }
                });
                if (value.id_pea.baja_estado == 1) {
                    tbody += `<td></td><td></td>`;
                } else {
                    tbody += this.drawDivAsistencia(divParams);
                }

            });
            tbody += `</tr>`
        });
        $('#tabla_asistencia').find('tbody').html(tbody);
        // let tablaasistenciaDT = $('#tabla_asistencia').DataTable();
        // tablaasistenciaDT.destroy();
        $('#tabla_asistencia').find('tbody').html(tbody);
        // $('#tabla_asistencia').DataTable({
        //     "bPaginate": false,
        // });
        $('#btn_exportar').off();
        $('#btn_exportar').on('click', () => {
            this.exportar();
        })
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

    darBaja() {
        let peaBajaSelected: number = $('#select_personal_para_baja').val();
        if (peaBajaSelected == -1) {
            utils.showInfo('Para dar de baja, tiene que seleccionar a alguna persona!');
            return false;
        }
        utils.alert_confirm(() => this._darBaja(peaBajaSelected), 'Esta seguro de dar de baja a esta persona? Una vez dado de baja, no podra rehacer el cambio.', 'warning');
    }

    _darBaja(pk: number) {
        this.personalService.patch(pk, {baja_estado: 1}).done(() => {
            utils.showSwalAlert('La persona se ha dado de baja!', 'Éxito', 'success');
            $('#select_aulas_asignadas').trigger('change');
        });
    }

    exportar() {
        $('#asistenciaclone').html($('#div_tabla_asistencia').clone())
        let divsManana: any = $('#asistenciaclone').find('[name="divTurnosManana"]')
        let divsTarde: any = $('#asistenciaclone').find('[name="divTurnosTarde"]')
        divsManana.map((index: number, domElement: Element) => {
            let name = $(domElement).find('input[type="radio"]').attr('name')
            let selected = $(`[name="${name}"]:checked`);
            if (selected.length) {
                let letra = $(selected).val()
                if (letra == 0) {
                    $(domElement).replaceWith(`<span>P</span>`)
                } else if (letra == 1) {
                    $(domElement).replaceWith(`<span>T</span>`)
                } else if (letra == 2) {
                    $(domElement).replaceWith(`<span>F</span>`)
                }
            } else {
                $(domElement).replaceWith(`<span></span>`)
            }
        })
        divsTarde.map((index: number, domElement: Element) => {
            let name = $(domElement).find('input[type="radio"]').attr('name')
            let selected = $(`[name="${name}"]:checked`);
            if (selected.length) {
                let letra = $(selected).val()
                if (letra == 0) {
                    $(domElement).replaceWith(`<span>P</span>`)
                } else if (letra == 1) {
                    $(domElement).replaceWith(`<span>T</span>`)
                } else if (letra == 2) {
                    $(domElement).replaceWith(`<span>F</span>`)
                }
            } else {
                $(domElement).replaceWith(`<span></span>`)
            }
        });
        var uri = $("#asistenciaclone").battatech_excelexport({
            containerid: "asistenciaclone",
            datatype: 'table',
            returnUri: true
        });
        $('#btn_exportar').attr('download', 'reporte_asistencia.xls').attr('href', uri).attr('target', '_blank');
    }
}
new AsistenciaView();

//color para dar de baja #ffc1c1