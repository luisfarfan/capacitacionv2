/**
 * Created by Administrador on 13/03/2017.
 */
import {AsistenciaService, PersonalService} from '../asistencia/asistencia.service';
import {DistribucionService} from '../distribucion/distribucion.service'
import {CursoInyection} from '../comun.utils';
import {ILocalAmbienteAsignados, IPersonalAsistenciaDetalle, IPersonalAula} from './asistencia.interface';

import * as utils from '../core/utils';
import {IPersonal} from "../distribucion/distribucion.interface";
import {alert_confirm} from "../core/utils";
import PermisosView from '../core/permisos/permisos.view';
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

export class AsistenciaView extends CursoInyection {
    public asistenciaService: AsistenciaService;
    public personalService: PersonalService;
    public distribucionService: DistribucionService;
    // public cursoInyection: CursoInyection;
    public localesAmbientes: ILocalAmbienteAsignados[] = [];
    public localAmbienteSelected: ILocalAmbienteAsignados = null;
    public rangoFechas: Array<string> = [];
    public personalAsistencia: IPersonalAsistenciaDetalle[];
    public personalparaBaja: IPersonal[] = [];
    public personaldadadeBaja: IPersonal[] = [];
    public personalContingencia: IPersonal[] = [];
    public pea_id: number = null;
    public cursoSelectedAsistencia: number;
    public hoy: string = '';
    public hoystamp: number = 0;
    public cursosEmpadronador: Array<number> = [4, 19, 20]
    private permisos: PermisosView;

    constructor() {
        super();
        this.permisos = new PermisosView(this.curso_id);
        this.asistenciaService = new AsistenciaService();
        this.personalService = new PersonalService();
        this.distribucionService = new DistribucionService();
        this.setearAulas();
        $('#select_aulas_asignadas').on('change', (element: JQueryEventObject) => {
            let selected = $(element.currentTarget).val();
            if (selected == '') {
                this.localAmbienteSelected = null;
            } else {
                this.localesAmbientes.map((value: ILocalAmbienteAsignados, index: number) => value.id_localambiente == selected ? this.localAmbienteSelected = value : '');
                $('#span_nombre_local').text(`${this.localAmbienteSelected.localcurso.local.nombre_local}`);
                $('#span_direccion').text(`${this.localAmbienteSelected.localcurso.local.nombre_via} - ${this.localAmbienteSelected.localcurso.local.n_direccion}`);
                $('#span_fecha_inicio').text(`${this.localAmbienteSelected.localcurso.local.fecha_inicio} hasta ${this.localAmbienteSelected.localcurso.local.fecha_fin}`);
                $('#span_aula').text(`${this.localAmbienteSelected.numero}`);
                $('[name="p_etapa"]').text($('#etapa :selected').text());

                this.asistenciaService.getRangoFechas(this.localAmbienteSelected.localcurso.local.fecha_inicio, this.localAmbienteSelected.localcurso.local.fecha_fin).done((fechasRango) => {
                    this.rangoFechas = fechasRango;
                    this.drawHeaderFechas();
                    this.cargarPersonalAsistenciaPorAula();
                });
            }
        });
        $('#span_nombre_instructor').text($('#span_usuario_nombre').text());
        $('#btn_save_asistencia').on('click', () => {
            if ($.inArray(this.cursoSelectedAsistencia, this.cursosEmpadronador) >= 0) {
                if (utils.isDataTable('#tabla_asistencia')) {
                    $('#tabla_asistencia').dataTable().fnFilterClear()
                }
                this.saveAsistenciaEmpadronadorUrbano();
            } else {
                this.permisos.ucan(() => {
                    this.saveAsistencia()
                })
            }
        });

        $('#btn_bajas_altas').on('click', () => {
            $('#modal_bajas_altas').modal('show');
        });
        $('#btn_dar_baja').on('click', () => {
            this.permisos.ucan(() => {
                this.darBaja();
            })

        });
        $('#btn_dar_alta').on('click', (element: JQueryEventObject) => {
            this.permisos.ucan(() => {
                this.darAlta(this.pea_id);
            })

        });
        $('#btn_cierre_curso').on('click', () => {
            this.permisos.ucan(() => {
                utils.alert_confirm(() => {
                    this.cerrarCursoEmpadronador();
                }, 'Esta seguro de Cerrar el curso?');
            })

        });
        this.disabledChecks();
        $('#btn_exportar_bajas_altas').on('click', () => {
            utils.exportarTable({
                table: 'div_tabla_altasbajas',
                fileName: 'bajas_y_altas.xls',
                contenedor: 'div_export',
                columnsDelete: [7],
                buttonName: 'btn_exportar_bajas_altas'
            }, 'tabla_asistencia', true)
        });

        $('#tabla_baja_alta_reporte').on('click', '[name="btn_deshacer_baja"]', (ev: JQueryEventObject) => {
            this.permisos.ucan(() => {
                if (this.disableAltasBajas() == false) {
                    return false
                }
                let id = $(ev.currentTarget).data('value')
                alert_confirm(() => {
                    this.asistenciaService.deshacerBaja(id).done(() => {
                        $('#select_aulas_asignadas').trigger('change');
                    });
                }, 'Esta seguro de deshacer la baja?', 'error')
            })

        });

        $('#tabla_baja_alta_reporte').on('click', '[name="btn_deshacer_alta"]', (ev: JQueryEventObject) => {
            this.permisos.ucan(() => {
                let id = $(ev.currentTarget).data('value');
                if (this.disableAltasBajas() == false) {
                    return false
                }
                alert_confirm(() => {
                    this.asistenciaService.deshacerAlta(id).done(() => {
                        $('#select_aulas_asignadas').trigger('change');
                    });
                }, 'Esta seguro de deshacer la alta?', 'error')
            });
        });
        this.getDate();
    }

    setLocalAmbienteSelected(selected: any) {
        this.localesAmbientes.map((value: ILocalAmbienteAsignados, index: number) => value.id_localambiente == selected ? this.localAmbienteSelected = value : '');
        // $('#span_nombre_local').text(`${this.localAmbienteSelected.localcurso.local.nombre_local}`);
        // $('#span_direccion').text(`${this.localAmbienteSelected.localcurso.local.nombre_via} - ${this.localAmbienteSelected.localcurso.local.n_direccion}`);
        // $('#span_fecha_inicio').text(`${this.localAmbienteSelected.localcurso.local.fecha_inicio} hasta ${this.localAmbienteSelected.localcurso.local.fecha_fin}`);
        // $('#span_aula').text(`${this.localAmbienteSelected.numero}`);
        // $('[name="p_etapa"]').text($('#etapa :selected').text());
        this.asistenciaService.getRangoFechas(this.localAmbienteSelected.localcurso.local.fecha_inicio, this.localAmbienteSelected.localcurso.local.fecha_fin).done((fechasRango) => {
            this.rangoFechas = fechasRango;
            this.drawHeaderFechas();
            this.cargarPersonalAsistenciaPorAula();
        });
    }

    setearAulas() {
        this.cursoSelectedAsistencia = this.curso_id != "-1" && this.curso_id != "" ? parseInt(this.curso_id) : this.curso_id;
        $('#p_curso_actual').text($('#cursos :selected').text());
        $('[name="p_etapa"]').text($('#etapa :selected').text());
        this.getAulas(this.curso_id);
        if ($.inArray(this.cursoSelectedAsistencia, this.cursosEmpadronador) >= 0) {
            $('#btn_cierre_curso').show();
            $('#btn_bajas_altas').hide();
        } else {
            $('#btn_cierre_curso').hide();
            $('#btn_bajas_altas').show();
        }
    }

    getDate() {
        var today = <any>new Date();
        var dd = <any>today.getDate();
        var mm = <any>today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        this.hoy = dd + '/' + mm + '/' + yyyy;
        this.hoystamp = Date.parse(mm + '/' + dd + '/' + yyyy);
    }

    cargarPersonalAsistenciaPorAula() {
        this.asistenciaService.getPersonalAsistenciaDetalle(this.localAmbienteSelected.id_localambiente).done((personalAsistencia) => {
            this.personalAsistencia = personalAsistencia;
            this.setPersonalParaBaja(true);
            this.drawPersonal();
            this.getContingencia();
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
            }, {
                id_element: 'select_personal_para_baja',
                bootstrap_multiselect: false,
                select2: true
            }, false, 'Digitar');
            let html: string = '';
            this.personaldadadeBaja.map((value: IPersonal, index: number) => {
                let alta: string = `<td>-</td><td>-</td><td>-</td><td>-</td><td>
                                    <ul class="icons-list">
                                        <li>
                                            <a data-popup="tooltip" title="Dar de alta" name="btn_dar_alta"
                                                    data-value="${value.id_pea}"
                                                    class="btn btn-success active btn-icon btn-rounded legitRipple">
                                                    <i class="icon-thumbs-up2"></i>
                                            </a>    
                                        </li>
                                    </ul>
                                    </td>`;
                if (value.id_pea_reemplazo) {
                    alta = `<td>${value.id_pea_reemplazo.ape_paterno}</td>
                            <td>${value.id_pea_reemplazo.ape_materno}</td>
                            <td>${value.id_pea_reemplazo.nombre}</td>
                            <td>&nbsp;${value.id_pea_reemplazo.dni}</td>
                            <td><ul class="icons-list"><li>
                                            <a data-popup="tooltip" title="Deshacer alta" name="btn_deshacer_alta"
                                                    data-value="${value.id_pea_reemplazo.id_pea}"
                                                    class="btn btn-primary active btn-icon btn-rounded legitRipple">
                                                    <i class="icon-reload-alt"></i>
                                            </a>    
                                        </li></ul></td>`;
                }
                html += `<tr>
                           <td rowspan="2">${index + 1}</td>
                           <td rowspan="2">${value.id_cargofuncional.nombre_funcionario}</td>
                           <td style="background-color:#ffc1c1">BAJA</td>
                           <td>${value.ape_paterno}</td>
                           <td>${value.ape_materno}</td>
                           <td>${value.nombre}</td>
                           <td>&nbsp;${value.dni}</td>
                           <td><ul class="icons-list"><li><a data-popup="tooltip" title="Deshacer baja" name="btn_deshacer_baja" data-value="${value.id_pea}"
                                    class="btn btn-primary active btn-icon btn-rounded legitRipple"><i class="icon-cancel-circle2"></i>
                                </a></li></ul>
                           </td>
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
        }).fail((error) => {
            console.log(error)
        });
    }

    darAlta(id_pea: number) {
        if (this.disableAltasBajas() == false) {
            return false
        }
        let peaAltaSelected: number = $('#select_personal_para_alta').val();
        if (peaAltaSelected == -1) {
            utils.showInfo('Para dar de alta, tiene que seleccionar a alguna persona!');
            return false;
        }
        utils.alert_confirm(() => this._darAlta(id_pea, peaAltaSelected), 'Esta seguro de dar de alta a esta persona?', 'warning');
    }

    _darAlta(id_pea: number, id_pea_reemplazo: number) {
        this.asistenciaService.darAlta(this.localAmbienteSelected.id_localambiente, id_pea, id_pea_reemplazo).done(() => {
            utils.showSwalAlert('La persona ha sido dado de alta!', 'Éxito', 'success')
            $('#select_aulas_asignadas').trigger('change');
            $('#modal_darAlta').modal('hide');
        })
    }

    cerrarCursoEmpadronador() {
        let inputsChecked = $('#tabla_asistencia').find('input[type="checkbox"]:checked');
        let aprobados: Array<number> = [];
        inputsChecked.map((index: number, domElement: Element) => {
            let peaaula = $(domElement).data('value').id_personalaula
            aprobados.push(peaaula)
        })
        console.log(aprobados)
        this.asistenciaService.cerrarCursoEmpadronador(aprobados).done((response) => {
            console.log(response);
        });
    }

    drawHeaderFechas() {
        let header: string = '';
        let subHeader: string = '<tr>';
        let colspan: number = 1;
        let spanEmpadronadorUrbano: string = '';
        if (this.localAmbienteSelected.localcurso.local.turno_uso_local == 2) {
            colspan = 2;
        }
        if ($.inArray(this.cursoSelectedAsistencia, this.cursosEmpadronador) >= 0) {
            header += `<tr><th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">N°</th>
                        <th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">Apellidos y Nombres</th>
                        <th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">DNI</th>
                        <th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">Cargo</th>
                        <th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">Zona</th>`;
        } else {
            header += `<tr><th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">N°</th>
                        <th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">Apellidos y Nombres</th>
                        <th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">DNI</th>
                        <th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">Cargo</th>
                        <th style="padding: 12px 20px;line-height: 1.5384616;" rowspan="2">Zona</th>`;

        }


        this.rangoFechas.map((fecha: string, index: number) => {
            if ($.inArray(this.cursoSelectedAsistencia, this.cursosEmpadronador) >= 0) {
                spanEmpadronadorUrbano = `<span id="fecha${fecha.replace(/\//g, '')}" style="font-size: 22px; margin-left: 6%" class="label label-success">0</span>`;
            }
            header += `<th style="padding: 12px 20px;line-height: 1.5384616;" colspan="${colspan}"><center>${fecha} ${spanEmpadronadorUrbano}</center></th>`;
            if (this.localAmbienteSelected.localcurso.local.turno_uso_local == 0) {
                subHeader += `<th>MAÑANA</th>`
            } else if (this.localAmbienteSelected.localcurso.local.turno_uso_local == 1) {
                subHeader += `<th>TARDE</th>`
            } else if (this.localAmbienteSelected.localcurso.local.turno_uso_local == 2) {
                subHeader += `<th>TARDE</th><th>MAÑANA</th>`
            }
        });
        header += `</tr>`;
        $('#tabla_asistencia').find('thead').html(header + subHeader + '</tr>');
    }

    drawPersonal() {
        let tbody: string = '';
        this.personalAsistencia.map((value: IPersonalAsistenciaDetalle, index: number) => {
            let enume:any;
            if (value.id_pea.baja_estado == 1) {
                tbody += `<tr style="background-color: #ffc1c1">`;
                enume="";
            }
            else if (value.id_pea.alta_estado == 1) {
                tbody += `<tr style="background-color: #cdf7cd">`;
                enume=index + 1
            } else {
                tbody += `<tr>`;
                enume=index + 1

            }

            tbody += `<td>${enume}</td>
                      <td>${value.id_pea.ape_paterno} ${value.id_pea.ape_materno} ${value.id_pea.nombre}</td>
                      <td>&nbsp;${value.id_pea.dni}</td>
                      <td>${value.id_pea.id_cargofuncional.nombre_funcionario}</td>
                      <td>&nbsp;${value.id_pea.zona}</td>`
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
                    tbody += `<td></td>`;
                } else {
                    if ($.inArray(this.cursoSelectedAsistencia, this.cursosEmpadronador) >= 0) {
                        tbody += this.drawDivAsistenciaEmpadronadorUrbano(divParams, ind);
                    } else {
                        if (divParams.turno_manana != null || divParams.turno_tarde != null) {
                            tbody += this.drawDivAsistencia(divParams, true);
                        } else {
                            tbody += this.drawDivAsistencia(divParams);
                        }

                        console.log(divParams)
                    }
                }
            });
            tbody += `</tr>`
        });
        if ($.inArray(this.cursoSelectedAsistencia, this.cursosEmpadronador) >= 0) {
            if (utils.isDataTable('#tabla_asistencia')) {
                $('#tabla_asistencia').DataTable().destroy();
            }
            $('#tabla_asistencia').find('tbody').html(tbody);
            $('#tabla_asistencia').DataTable({
                bPaginate: false,
            });
            this.disabledChecks();
            this.countAsistenciaTotalPorFecha();
        } else {
            $('#tabla_asistencia').find('tbody').html(tbody);
            this.validarFechasDiv();
        }
        $('#btn_exportar').off();
        $('#btn_exportar').on('click', () => {
            this.exportar();
        });
    }

    drawDivAsistencia(divParams: ModelDivAsistencia, disabled: boolean = false) {
        let turno_uso_local: number = this.localAmbienteSelected.localcurso.local.turno_uso_local;
        let json: String = JSON.stringify({fecha: divParams.fecha, id_personalaula: divParams.id_personalaula});
        let silverBrackground: string = `style="background-color: #dedede"`;
        let bloquear = disabled ? 'disabled' : '';
        if (this.localAmbienteSelected.localcurso.local.turno_uso_local == 0) {
            return `<td ${turno_uso_local == 1 ? silverBrackground : ''}>
                    <div name="divTurnosManana" data-value=${json} class="form-group">
                    <div class="checkbox checkbox-right">
                        <label style="display: table;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 1 ? 'disabled' : ''}
                             name="turno_manana${divParams.fecha}${divParams.id_personalaula}"
                            ${divParams.turno_manana == 0 ? 'checked' : ''} value="0">
                            Puntual
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: table;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 1 ? 'disabled' : ''}
                             name="turno_manana${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_manana == 1 ? 'checked' : ''} value="1">
                            Tardanza
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: table;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 1 ? 'disabled' : ''}
                             name="turno_manana${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_manana == 2 ? 'checked' : ''} value="2">
                            Falta
                        </label>
                    </div>
				</div></td>`;
        } else if (this.localAmbienteSelected.localcurso.local.turno_uso_local == 1) {
            return `<td ${turno_uso_local == 0 ? silverBrackground : ''}><div name="divTurnosTarde" data-value=${json} class="form-group">
                    <div class="checkbox checkbox-right">
                        <label style="display: flex;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 0 ? 'disabled' : ''}
                             name="turno_tarde${divParams.fecha}${divParams.id_personalaula}" 
                            ${divParams.turno_tarde == 0 ? 'checked' : ''} value="0">
                            Puntual
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: flex;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 0 ? 'disabled' : ''} 
                            name="turno_tarde${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_tarde == 1 ? 'checked' : ''} value="1">
                            Tardanza
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: flex;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 0 ? 'disabled' : ''}
                             name="turno_tarde${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_tarde == 2 ? 'checked' : ''} value="2">
                            Falta
                        </label>
                    </div>
				</div></td>`;
        } else if (this.localAmbienteSelected.localcurso.local.turno_uso_local == 2) {
            return `<td ${turno_uso_local == 1 ? silverBrackground : ''}><div name="divTurnosManana" data-value=${json} class="form-group">
                    <div class="checkbox checkbox-right">
                        <label style="display: table;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 1 ? 'disabled' : ''}
                             name="turno_manana${divParams.fecha}${divParams.id_personalaula}"
                            ${divParams.turno_manana == 0 ? 'checked' : ''} value="0">
                            Puntual
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: table;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 1 ? 'disabled' : ''}
                             name="turno_manana${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_manana == 1 ? 'checked' : ''} value="1">
                            Tardanza
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: table;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 1 ? 'disabled' : ''}
                             name="turno_manana${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_manana == 2 ? 'checked' : ''} value="2">
                            Falta
                        </label>
                    </div>
				</div></td>
				<td ${turno_uso_local == 0 ? silverBrackground : ''}><div name="divTurnosTarde" data-value=${json} class="form-group">
                    <div class="checkbox checkbox-right">
                        <label style="display: flex;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 0 ? 'disabled' : ''}
                             name="turno_tarde${divParams.fecha}${divParams.id_personalaula}" 
                            ${divParams.turno_tarde == 0 ? 'checked' : ''} value="0">
                            Puntual
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: flex;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 0 ? 'disabled' : ''} 
                            name="turno_tarde${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_tarde == 1 ? 'checked' : ''} value="1">
                            Tardanza
                        </label>
                    </div>
                    <div class="checkbox checkbox-right">
                        <label style="display: flex;">
                            <input ${bloquear} type="radio" ${turno_uso_local == 0 ? 'disabled' : ''}
                             name="turno_tarde${divParams.fecha}${divParams.id_personalaula}"
                             ${divParams.turno_tarde == 2 ? 'checked' : ''} value="2">
                            Falta
                        </label>
                    </div>
				</div></td>`;
        }
    }

    validarFechasDiv() {
        let divs = $('[name="divTurnosManana"]')
        $(divs).map((index: number, domElement: Element) => {
            let fecha = $(domElement).data('value').fecha.split('/')
            let f = `${fecha[1]}/${fecha[0]}/${fecha[2]}`
            let fechastamp: number = Date.parse(`${fecha[1]}/${fecha[0]}/${fecha[2]}`);
            let inputs = $('[name="divTurnosManana"]').find('input')
            if (this.hoystamp < fechastamp) {
                inputs.map((ind: number, domele: Element) => {
                    let fecha_div = $(domele).parent().parent().parent().data('value').fecha.split('/')
                    if (`${fecha_div[1]}/${fecha_div[0]}/${fecha_div[2]}` == f) {
                        if ($(domele).is(":not(:disabled)")) {
                            $(domele).prop('disabled', true);
                        }
                    }
                })
            }
        })
        let divsT = $('[name="divTurnosTarde"]')
        $(divsT).map((index: number, domElement: Element) => {
            let fecha = $(domElement).data('value').fecha.split('/')
            let f = `${fecha[1]}/${fecha[0]}/${fecha[2]}`
            let fechastamp: number = Date.parse(`${fecha[1]}/${fecha[0]}/${fecha[2]}`);
            if (this.hoystamp < fechastamp) {
                let inputs = $('[name="divTurnosTarde"]').find('input')
                inputs.map((ind: number, domele: Element) => {
                    let fecha_div = $(domele).parent().parent().parent().data('value').fecha.split('/')
                    if (`${fecha_div[1]}/${fecha_div[0]}/${fecha_div[2]}` == f) {
                        if ($(domele).is(":not(:disabled)")) {
                            $(domele).prop('disabled', true);
                        }
                    }

                })
            }
        })
    }

    drawDivAsistenciaEmpadronadorUrbano(checkParams: ModelDivAsistencia, ind: number) {
        let objectData: string = JSON.stringify({
            id_personalaula: checkParams.id_personalaula,
            fecha: checkParams.fecha
        });
        let disabledMananaChecked = '';
        let disabledTardeChecked = '';
        let disabledManana = '';
        let disabledTarde = '';
        if (checkParams.turno_manana != null && checkParams.turno_tarde == null) {
            disabledMananaChecked = 'checked';
        } else if (checkParams.turno_tarde != null && checkParams.turno_manana == null) {
            disabledTardeChecked = 'checked';
        }
        this.personalAsistencia.map((pea: IPersonalAsistenciaDetalle) => {
            if (pea.id_peaaula == checkParams.id_personalaula) {
                if (pea.personalaula.length) {
                    disabledManana = 'disabled'
                    disabledTarde = 'disabled';
                } else {
                    disabledManana = ''
                    disabledTarde = '';
                }
            }
        });
        let objectFecha: string = JSON.stringify({fecha: checkParams.fecha});
        if (this.localAmbienteSelected.localcurso.local.turno_uso_local == 0) {
            //mañana
            return `<td>
                        <label data-value=${objectFecha} class="label--checkbox" name="checkManana">
                            <input ${disabledMananaChecked} ${disabledManana} data-value=${objectData} id="${checkParams.id_personalaula}${ind}0" class="checkbox-mdl" name="${checkParams.id_personalaula}${ind}0" type="checkbox" />
                        </label>
                    </td>`;
        } else if (this.localAmbienteSelected.localcurso.local.turno_uso_local == 1) {
            //tarde
            return `<td>
                        <label data-value=${objectFecha} class="label--checkbox" name="checkTarde">
                            <input ${disabledTardeChecked} ${disabledTarde} data-value=${objectData} id="${checkParams.id_personalaula}${ind}1" class="checkbox-mdl" name="${checkParams.id_personalaula}${ind}1" type="checkbox" />
                        </label>
                    </td>`;
        } else if (this.localAmbienteSelected.localcurso.local.turno_uso_local == 2) {
            return `<td>
                        <label data-value=${objectFecha} class="label--checkbox" name="checkManana">
                            <input ${disabledMananaChecked} ${disabledManana} data-value=${objectData} id="${checkParams.id_personalaula}${ind}0" class="checkbox-mdl" name="${checkParams.id_personalaula}${ind}0" type="checkbox" />
                        </label>
                    </td>
                    <td>
                        <label data-value=${objectFecha} class="label--checkbox" name="checkTarde">
                            <input ${disabledTardeChecked} ${disabledTarde} data-value=${objectData} id="${checkParams.id_personalaula}${ind}1" class="checkbox-mdl" name="${checkParams.id_personalaula}${ind}1" type="checkbox" />
                        </label>
                    </td>`;
        }
    }

    saveAsistenciaEmpadronadorUrbano() {
        let labelsManana = $('[name="checkManana"]');
        let labelsTarde = $('[name="checkTarde"]');
        let request: Array<any> = [];
        let exist: boolean = false;
        labelsManana.map((index: number, domElement: Element) => {
            let input = $(domElement).find('input');
            if (input.is(':checked') && !input.is(':disabled')) {
                let id_personalaula = $(domElement).find('input').data('value').id_personalaula;
                let fecha = $(domElement).find('input').data('value').fecha;
                request.push({id_personalaula: id_personalaula, fecha: fecha, turno_manana: 0, turno_tarde: null});
            }
        });
        labelsTarde.map((index: number, domElement: Element) => {
            let input = $(domElement).find('input');
            if (input.is(':checked') && !input.is(':disabled')) {
                let id_personalaula = $(domElement).find('input').data('value').id_personalaula
                let fecha = $(domElement).find('input').data('value').fecha;
                request.push({id_personalaula: id_personalaula, fecha: fecha, turno_tarde: 0, turno_manana: null});
            }
        });
        if (!request.length) {
            utils.showInfo('No ha marcado la asistencia de ninguna persona, no puede guardar aún');
            return false;
        }
        utils.alert_confirm(() => {
            this.asistenciaService.saveAsistenciaEmpadronadorUrbano(request).done((response) => {
                utils.showSwalAlert('La asistencia fue guardada con éxito!', 'Exito', 'success');
                this.cargarPersonalAsistenciaPorAula();
            });
        }, 'Esta seguro de guardar la asistencia?', 'success');
    }

    disabledChecks() {
        $('input[type="checkbox"]').off();
        $('input[type="checkbox"]').on('click', (element: JQueryEventObject) => {
            let target = $(element.target)
            let tr = target.parent().parent().parent();
            let id_checkbox = target.attr('id');
            if (target.is(':checked')) {
                tr.find('input').not(`[name="${id_checkbox}"]`).prop('disabled', true);
            } else {
                tr.find('input').prop('disabled', false);
            }
            this.countAsistenciaPorDiaOnClick(element);
        });
    }

    countAsistenciaPorDiaOnClick(element: BaseJQueryEventObject) {
        let target = $(element.target);
        let fecha = $(element.target).parent().data('value').fecha;
        let contador: number = parseInt($(`#fecha${fecha.replace(/\//g, '')}`).text());
        if (target.is(':checked')) {
            contador++;
        } else {
            contador = contador == 0 ? 0 : contador - 1;
        }
        $(`#fecha${fecha.replace(/\//g, '')}`).text(contador);
    }

    countAsistenciaTotalPorFecha() {
        this.rangoFechas.map((fecha: string, index: number) => {
            let contador: number = 0;
            this.personalAsistencia.map((pea: IPersonalAsistenciaDetalle) => {
                pea.personalaula.map((asistencias: IPersonalAula) => {
                    if (asistencias.fecha == fecha) {
                        contador++;
                    }
                });
            });
            $(`#fecha${fecha.replace(/\//g, '')}`).text(contador);
        });
    }

    saveAsistencia() {
        let inputsValidar = $('input[name^="turno"]:not(:disabled):checked').length
        let inputsValidarTotal = $('input[name^="turno"]:not(:disabled)').length / 3

        if (inputsValidar != inputsValidarTotal) {
            utils.showInfo('Aún le falta llenar la asistencia', 'error');
            return false;
        }

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
                $('#select_aulas_asignadas').trigger('change');
            });
        }, 'Después de guardar la asistencia, no se va tener opción a editar!, Está seguro de guardar?', 'success');
    }

    getAulas(curso_id: number) {
        //console.log("get Aulas");
        this.asistenciaService.getAulasbyInstructor(IDUSUARIO, curso_id).done((aulas: ILocalAmbienteAsignados[]) => {
            this.localesAmbientes = aulas;
            console.log(aulas);
            let html: string = '';
            html += `<option value="">Seleccione Aula</option>`
            this.localesAmbientes.map((value: ILocalAmbienteAsignados, index: number) => {
                html += `<option value="${value.id_localambiente}">${value.id_ambiente.nombre_ambiente} - N° ${value.numero} -> local ${value.localcurso.local.nombre_local} </option>`
            });
            $('#select_aulas_asignadas').html(html);
        })
    }

    darBaja() {
        if (this.disableAltasBajas() == false) {
            return false
        }
        let peaBajaSelected: number = $('#select_personal_para_baja').val();
        if (peaBajaSelected == -1) {
            utils.showInfo('Para dar de baja, tiene que seleccionar a alguna persona!');
            return false;
        }
        utils.alert_confirm(() => this._darBaja(peaBajaSelected), 'Esta seguro de dar de baja a esta persona?.', 'warning');
    }

    _darBaja(pk: number) {
        this.personalService.patch(pk, {baja_estado: 1}).done(() => {
            utils.showSwalAlert('La persona se ha dado de baja!', 'Éxito', 'success');
            $('#select_aulas_asignadas').trigger('change');
        });
    }

    _exportarGeneral() {
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
        });
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
    }

    exportarEmpadronadorUrbano() {
        let labels: any = $('#asistenciaclone').find('label')
        labels.map((index: number, domElement: Element) => {
            let input = $(domElement).find('input');
            if (input.is(':checked')) {
                $(domElement).replaceWith(`<span>ASISTIO</span>`)
            } else {
                $(domElement).replaceWith(`<span></span>`)
            }
        });
    }

    exportar() {
        $('#asistenciaclone').html($('#div_tabla_asistencia').clone())
        if ($.inArray(this.cursoSelectedAsistencia, this.cursosEmpadronador) >= 0) {
            this.exportarEmpadronadorUrbano();
        } else {
            this._exportarGeneral();
        }
        let td = $('#asistenciaclone').find('table').find('td')
        let theadtr = $('#asistenciaclone').find('table').find('thead').find('th')
        td.map((index: number, domElement: Element) => {
            $(domElement).css('border', '1px solid #0065a9');
        });
        theadtr.map((index: number, domElement: Element) => {
            $(domElement).css('background-color', '#03A9F4');
            $(domElement).css('border-color', '#03A9F4');
            $(domElement).css('color', '#fff');
        });
        var uri = $("#asistenciaclone").battatech_excelexport({
            containerid: "asistenciaclone",
            datatype: 'table',
            returnUri: true
        });
        $('#btn_exportar').attr('download', 'reporte_asistencia.xls').attr('href', uri).attr('target', '_blank');
    }

    disableAltasBajas() {
        let inputs = $('#div_tabla_asistencia').find('input:not(:disabled)').length
        debugger
        if (inputs == 0) {
            utils.showInfo('Ya no tiene acceso a bajas y altas!');
            return false;
        }
        return true;
    }
}
new AsistenciaView();

//color para dar de baja #ffc1c1