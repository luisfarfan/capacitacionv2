/**
 * Created by Administrador on 16/03/2017.
 */
import * as utils from '../core/utils';
import {EvaluacionService} from 'evaluacion.service';
import {AsistenciaService} from '../asistencia/asistencia.service';
import UbigeoService from '../ubigeo/ubigeo.service';
import {
    ICriterio,
    ICursoCriterios,
    IDetalleCriterio,
    ICargoFuncionalDetalle,
    IPeaNotaFinal
} from 'evaluacion.interface';
import {ILocalAmbienteAsignados, IPersonalAsistenciaDetalle, IPersonalNotas} from '../asistencia/asistencia.interface'
import {CursoInyection} from '../comun.utils';
import {IPersonal} from "../distribucion/distribucion.interface";
import {IUbigeo} from "../ubigeo/ubigeo.view";
import {IZona} from "../ubigeo/ubigeo.interface";
declare var IDUSUARIO: number;
declare var ubigeo: IUbigeo;
declare var $: any;


class EvaluacionView {
    private cursoInyection: CursoInyection;
    private ubigeoService: UbigeoService;
    private evaluacionService: EvaluacionService;
    private asistenciaService: AsistenciaService;
    private criteriosCurso: ICursoCriterios;
    private detalleCriterios: IDetalleCriterio[] = [];
    private localesAmbientes: ILocalAmbienteAsignados[] = [];
    private localAmbienteSelected: ILocalAmbienteAsignados;
    private personal: IPersonalAsistenciaDetalle[];
    private zonasRankeo: IZona[] = [];
    private cargosFuncionales: ICargoFuncionalDetalle[] = [];
    private personalNotaFinal: IPeaNotaFinal[] = [];

    constructor() {
        this.cursoInyection = new CursoInyection();
        this.evaluacionService = new EvaluacionService();
        this.asistenciaService = new AsistenciaService();
        this.ubigeoService = new UbigeoService();
        this.getZonas();
        this.setEvents();
    }

    setEvents() {
        $('#cursos').on('change', (element: JQueryEventObject) => {
            let curso_id = $(element.currentTarget).val();
            $('#p_curso_actual').text($('#cursos :selected').text());
            this.getAulas(curso_id);
            this.getCriterios(curso_id);
            this.getCargosFuncionales(curso_id);
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
                this.asistenciaService.getPersonalAsistenciaDetalle(this.localAmbienteSelected.id_localambiente).done((personal) => {
                    this.personal = personal;
                    this.drawTbody();
                });
            }
        });
        $('#btn_save_asistencia').on('click', () => {
            this.saveNotas();
        });
        $('#btn_ver_personal').on('click', () => {
            this.getPersonalNotaFinal();
        });
        $('#btn_rankeo_temporal').on('click', () => {
            this.rankear();
        })
    }

    getCriterios(id_curso: number) {
        this.evaluacionService.criteriosCurso(id_curso).done((criteriosCurso: ICursoCriterios) => {
            this.criteriosCurso = criteriosCurso;
        });
        this.evaluacionService.criteriosDetalleCurso(id_curso).done((detalleCriterio: IDetalleCriterio[]) => {
            this.detalleCriterios = detalleCriterio;
        });
    }

    getPersonalNotaFinal() {
        let zona: string = $('#select_zonas').val()
        let cargo: number = $('#select_cargos_funcionales').val();
        this.evaluacionService.filterPersonalNotaFinal(`${ubigeo.ccdd}${ubigeo.ccpp}${ubigeo.ccdi}`, zona, cargo).done((personalNotaFinal: IPeaNotaFinal[]) => {
            this.personalNotaFinal = personalNotaFinal;
            this.drawPersonalNotaFinal();
        })
    }

    drawPersonalNotaFinal() {
        let html: string = '';
        this.personalNotaFinal.map((pea: IPeaNotaFinal, index: number) => {
            if (pea.personalaula_notafinal.length) {
                html += `<tr data-value="${pea.id_peaaula}">
                        <td>${index + 1}</td>
                        <td>${pea.id_pea.ape_paterno} ${pea.id_pea.ape_materno} ${pea.id_pea.nombre}</td>
                        <td>${pea.id_pea.dni}</td>
                        <td><input value="${pea.personalaula_notafinal[0].nota_final}" type="number"></td>
                        <td><span class="label"></span></td>
                     </tr>`;
            }
        });
        $('#table_personalnotafinal').find('tbody').html(html);
    }

    rankear() {
        let meta = 6
        let inputsTable: any = $('#table_personalnotafinal').find('input[type="number"]');
        let count = 0;
        inputsTable.map((index: number, input: Element) => {
            count++;
            let span: any = $(input).parent().parent().find('span')
            if (meta >= count) {
                if ($(input).val() >= 11) {
                    span.addClass('label-success')
                    span.text('Titular')
                } else {
                    span.addClass('label-danger')
                    span.text('No seleccionado')
                }
            } else {
                if ($(input).val() >= 11) {
                    span.addClass('label-primary')
                    span.text('reserva')
                } else {
                    span.addClass('label-danger')
                    span.text('No seleccionado')
                }
            }
        });
    }

    getCargosFuncionales(id_curso: number) {
        this.evaluacionService.cargosCurso(id_curso).done((cargosFuncionales) => {
            this.cargosFuncionales = cargosFuncionales;
            let html: string = `<option value="">Seleccione cargo</option>`;
            this.cargosFuncionales.map((value: ICargoFuncionalDetalle) => {
                html += `<option value="${value.id_cargofuncional.id_cargofuncional}">${value.id_cargofuncional.nombre_funcionario}</option>`
            });
            $('#select_cargos_funcionales').html(html);
        })
    }

    getZonas() {
        this.ubigeoService.getZonas(`${ubigeo.ccdd}${ubigeo.ccpp}${ubigeo.ccdi}`).done((zonas: IZona[]) => {
            this.zonasRankeo = zonas;
            let html: string = `<option value="">Seleccione zona</option>`;
            this.zonasRankeo.map((value: IZona) => {
                html += `<option value="${value.ZONA}">${value.ZONA}</option>`
            });
            $('#select_zonas').html(html);
        });
    }

    drawHeader() {
        let thead = `<tr>`
        thead += `<th>N°</th><th>Nombre Completo</th><th>Cargo</th>`
        this.criteriosCurso.criterios.map((value: ICriterio, index: number) => {
            thead += `<th>${value.nombre_criterio}</th>`
        });
        thead += `<th>Nota final</th><th>Aptos</th>`
        thead += `</tr>`
        return thead;
    }

    drawTbody() {
        let tbody = ``;
        this.personal.map((persona: IPersonalAsistenciaDetalle, index: number) => {
            let nota_final: number = 0;
            let disabled: string = '';
            if (persona.id_pea.baja_estado == 1) {
                disabled = 'disabled'
                tbody += `<tr style="background-color: #ffc1c1" data-value="${persona.id_peaaula}">`;
            }
            else if (persona.id_pea.alta_estado == 1) {
                disabled = ''
                tbody += `<tr style="background-color: #cdf7cd" data-value="${persona.id_peaaula}">`;
            } else {
                disabled = ''
                tbody += `<tr data-value="${persona.id_peaaula}">`;
            }
            tbody += `<td>${index + 1}</td>
                      <td>${persona.id_pea.ape_paterno} ${persona.id_pea.ape_materno} ${persona.id_pea.nombre}</td>
                      <td>${persona.id_pea.id_cargofuncional.nombre_funcionario}</td>`;
            this.criteriosCurso.criterios.map((criterio: ICriterio) => {
                let objCriterio: string = '';
                this.detalleCriterios.map((detalle: IDetalleCriterio) => {
                    if (criterio.id_criterio == detalle.criterio) {
                        objCriterio = JSON.stringify({id_criterio: detalle.cursocriterio});
                    }
                });
                let nota: number = null;
                criterio.id_criterio == 2 ? nota = 18 : nota = null;
                persona.personalaula_notas.filter((val: IPersonalNotas) => {
                    if (val.cursocriterio.criterio == criterio.id_criterio) {
                        criterio.id_criterio == 2 ? nota = 18 : nota = val.nota;
                        this.detalleCriterios.map((criteriodetalle: IDetalleCriterio) => {
                            if (val.cursocriterio.criterio == criteriodetalle.criterio) {
                                nota_final = nota_final + (nota * (criteriodetalle.ponderacion / 100));
                            }
                        });
                    }
                });
                tbody += `<td><input ${disabled} data-value=${objCriterio} value="${nota}" min="0" max="20" type="number"></td>`
            });
            nota_final = Math.round(nota_final * 100) / 100;
            let span: string = '';
            if (nota_final > 10) {
                span = `<span name="span_state" class="label label-success">Apto</span>`;
            } else {
                span = `<span name="span_state" class="label label-danger">No apto</span>`;
            }
            tbody += `<td><input disabled min="0" max="20" value="${nota_final}" name="nota_final" type="number"></td>
            <td>${span}</td></tr>`
        });
        $('#tabla_evaluacion').find('thead').html(this.drawHeader());
        $('#tabla_evaluacion').find('tbody').html(tbody);

        this.setCalculoPromedio();
    }

    saveNotas() {
        let registrosNotas: any = $('#tabla_evaluacion').find('tbody').find('tr');
        let request: Array<any> = [];
        let error: number = 0;
        let input: any;
        registrosNotas.map((index: number, domElement: Element) => {
            let peaaula: number = $(domElement).data('value');
            let inputs: any = $(domElement).find('input');
            inputs.map((ind: number, inputElement: Element) => {
                let nota: any = $(inputElement).val();
                if (nota > 20) {
                    error++;
                    if (error == 1) {
                        input = $(inputElement);
                    }
                }
                if ($(inputElement).val() != '' && !$(inputElement).is(':disabled')) {
                    request.push({
                        peaaula: peaaula,
                        criterio: $(inputElement).data('value').id_criterio,
                        nota: nota,
                    });
                }
            });
        });
        if (error > 0) {
            utils.showInfo('La nota no puede ser mayor a 20, por favor corrijalo');
            input.focus();
            return false;
        }
        utils.alert_confirm(() => {
            this.evaluacionService.saveNotas(request).done((response) => {
                $('#select_aulas_asignadas').trigger('change');
                utils.showSwalAlert('Se ha guardado las notas!', 'Exito!', 'success');
                this.saveNotaFinal();
            });
        }, 'Esta seguro de guardar las notas de estas personas?')
    }

    saveNotaFinal() {
        let inputsNotafinal: any = $('input[name="nota_final"]')
        let request: Array<Object> = [];
        inputsNotafinal.each((index: number, element: Element) => {
            let trpeaaula: number;
            if ($(element).val() != '') {
                trpeaaula = $(element).parent().parent().data('value')
                request.push({peaaula: trpeaaula, nota_final: $(element).val()})
            }
        });
        this.evaluacionService.saveNotasFinal(request).done((response) => {
        });
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

    getDetalleCriterio() {

    }

    setCalculoPromedio() {
        $("input[type=number]").on('keyup', (element: JQueryEventObject) => {
            let tr: any = $(element.target).parent().parent()
            let inputs: any = $(tr).find('input:not([name="nota_final"])');
            let nota_final: number = 0;
            let procesado: number = this.detalleCriterios.length;
            let isProcesado: number = 0;
            inputs.map((index: number, inp: Element) => {
                let ponderacion = 0;
                let nota_input = $(inp).val() == '' ? 0 : $(inp).val();
                if (nota_input != 0) {
                    isProcesado++;
                    this.detalleCriterios.filter((value: IDetalleCriterio) => value.cursocriterio == $(inp).data('value').id_criterio ? ponderacion = value.ponderacion : '');
                    nota_final = nota_final + (nota_input * (ponderacion / 100));
                }
            });
            nota_final = Math.round(nota_final * 100) / 100;
            $(tr).find('[name="nota_final"]').val(nota_final);
            if (nota_final > 10) {
                $(tr).find('span').removeClass('label-danger');
                $(tr).find('span').addClass('label-success');
                $(tr).find('span').text('Apto');
            } else {
                $(tr).find('span').removeClass('label-success');
                $(tr).find('span').addClass('label-danger');
                $(tr).find('span').text('No apto');
            }
        });
    }
}

new EvaluacionView();