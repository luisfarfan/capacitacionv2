/**
 * Created by Administrador on 16/03/2017.
 */
import * as utils from '../core/utils';
import {EvaluacionService} from '../evaluacion/evaluacion.service';
import {AsistenciaService} from '../asistencia/asistencia.service';
import UbigeoService from '../ubigeo/ubigeo.service';
import {
    ICriterio,
    ICursoCriterios,
    IDetalleCriterio,
    ICargoFuncionalDetalle,
    IPeaNotaFinal, IPeanotafinal
} from 'evaluacion.interface';
import {
    ILocalAmbienteAsignados, IPersonalAsistenciaDetalle, IPersonalNotas,
    IPersonalAula
} from '../asistencia/asistencia.interface'
import {CursoInyection} from '../comun.utils';
import {IUbigeo} from "../ubigeo/ubigeo.view";
import {IZona} from "../ubigeo/ubigeo.interface";
import PermisosView from '../core/permisos/permisos.view';
declare var IDUSUARIO: number;
declare var ubigeo: IUbigeo;
declare var $: any;


export class EvaluacionView extends CursoInyection {
    public cursoInyection: CursoInyection;
    public ubigeoService: UbigeoService;
    public evaluacionService: EvaluacionService;
    public asistenciaService: AsistenciaService;
    public criteriosCurso: ICursoCriterios;
    public detalleCriterios: IDetalleCriterio[] = [];
    public localesAmbientes: ILocalAmbienteAsignados[] = [];
    public localAmbienteSelected: ILocalAmbienteAsignados;
    public personal: IPersonalAsistenciaDetalle[];
    public zonasRankeo: IZona[] = [];
    public cargosFuncionales: ICargoFuncionalDetalle[] = [];
    public personalNotaFinal: IPeaNotaFinal[] = [];
    public ambitos: any = {};
    public ambitoDetalle: any = {};
    public _ubigeo: any = localStorage.getItem('ubigeo') == null ? ubigeo : JSON.parse(localStorage.getItem('ubigeo'));
    private permisos: PermisosView;
    public ubigeozona: string = '';

    constructor(init: boolean = false) {
        super();
        this.permisos = new PermisosView(this.curso_id);
        this.evaluacionService = new EvaluacionService();
        this.asistenciaService = new AsistenciaService();
        this.ubigeoService = new UbigeoService();
        this.setEvents(init);
    }

    setearUbigeo() {
        if (ubigeo.ccdd != null && ubigeo.ccdd != '') {
            this._ubigeo.ccdd = ubigeo.ccdd
        }
        if (ubigeo.ccpp != null && ubigeo.ccpp != '') {
            this._ubigeo.ccpp = ubigeo.ccpp
        }
        if (ubigeo.ccdi != null && ubigeo.ccpp != '') {
            this._ubigeo.ccdi = ubigeo.ccdi
        }
    }

    getMeta() {
        let cargofuncional = $('#select_cargos_funcionales').val();
        let zona = $('#select_zonas').val() == "-1" ? null : $('#select_zonas').val();
        this.setearUbigeo();
        this._ubigeo.ccdd == '' ? this._ubigeo.ccdd = null : '';
        this._ubigeo.ccpp == '' ? this._ubigeo.ccpp = null : '';
        this._ubigeo.ccdi == '' ? this._ubigeo.ccdi = null : '';
        this.evaluacionService.getMeta(`${this._ubigeo.ccdd}${this._ubigeo.ccpp}${$('#select_zonas').val()}`, cargofuncional).done((meta: Array<any>) => {
            if (meta.length) {
                $('#meta').text(meta[0].meta)
            } else {
                $('#meta').text('No existe meta')
            }
        }).fail(() => {
            $('#meta').text('')
        });
    }

    setearAulas() {
        $('#p_curso_actual').text($('#cursos :selected').text());
        $('[name="p_etapa"]').text($('#etapa :selected').text());
        this.getAulas(this.curso_id);
        this.getCriterios(this.curso_id);
        this.getCargosFuncionales(this.curso_id);
    }

    setEvents(init: boolean = false) {
        if (init) {
            this.cursoInyection = new CursoInyection();
            $('#span_nombre_instructor').text($('#span_usuario_nombre').text());
            this.setearAulas();
            this.setearUbigeo();
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
                    $('#span_direccion').text(`${this.localAmbienteSelected.localcurso.local.nombre_via}`)
                    $('#span_fecha_inicio').text(`${this.localAmbienteSelected.localcurso.local.fecha_inicio}`)
                    $('#span_aula').text(`${this.localAmbienteSelected.numero}`);
                    this.asistenciaService.getPersonalAsistenciaDetalle(this.localAmbienteSelected.id_localambiente).done((personal) => {
                        this.personal = personal;
                        this.drawTbody();
                    });
                }
            });
            $('#btn_save_asistencia').on('click', () => {
                this.permisos.ucan(() => {
                    this.saveNotas()
                })

            });
            $('#btn_ver_personal').on('click', () => {
                this.getPersonalNotaFinal();
            });
            $('#btn_rankeo_temporal').on('click', () => {
                this.rankear();
            });
            $('#btn_exportar').on('click', () => {
                this.exportar();
            });
            $('#btn_exportar_rankeo').on('click', () => {
                utils.exportarTable({
                    buttonName: 'btn_exportar_rankeo',
                    contenedor: 'div_export',
                    fileName: 'resultados.xls',
                    table: 'div_table_personalnotafinal',
                    columnsDelete: []
                });
            });

            $('#select_cargos_funcionales').on('change', () => {
                this.getMeta();
            });
            $('#select_zonas').on('change', () => {
                this.getMeta();
            });
            $('#btn_cierre_curso').on('click', () => {
                this.permisos.ucan(() => {
                    utils.alert_confirm(() => {
                        this.cerrarCursoConInternet();
                    }, 'Esta seguro de Cerrar el curso?');
                });
            });
            this.getAmbitos();
        }
    }

    getCriterios(id_curso: number) {
        this.evaluacionService.criteriosCurso(id_curso).done((criteriosCurso: ICursoCriterios) => {
            this.criteriosCurso = criteriosCurso;
        });
        this.evaluacionService.criteriosDetalleCurso(id_curso).done((detalleCriterio: IDetalleCriterio[]) => {
            this.detalleCriterios = detalleCriterio;
        });
    }

    exportar() {
        $('#clone').html($('#tabla_evaluacion').clone());
        let td = $('#clone').find('table').find('td')
        let theadtr = $('#clone').find('table').find('thead').find('th')
        td.map((index: number, domElement: Element) => {
            $(domElement).css('border', '1px solid #0065a9');
        });
        theadtr.map((index: number, domElement: Element) => {
            $(domElement).css('background-color', '#03A9F4');
            $(domElement).css('border-color', '#03A9F4');
            $(domElement).css('color', '#fff');
        });
        let select_instructor = $('#clone').find('select :selected').text();
        $('#clone').find('#a_save_instructor').remove()
        let inputs = $('#clone').find('input[type="number"]');
        inputs.map((index: number, element: Element) => {
            let val = $(element).val();
            $(element).replaceWith(`<span>${val}</span>`);
        });
        var uri = $("#clone").battatech_excelexport({
            containerid: "clone",
            datatype: 'table',
            returnUri: true
        });
        $('#btn_exportar').attr('download', 'reporte_personal_por_aula.xls').attr('href', uri).attr('target', '_blank');
    }

    getPersonalNotaFinal() {
        let cargo: number = $('#select_cargos_funcionales').val();
        let ambito_selected = $('#select_zonas').val();
        let _ubigeo: any = {ccdd: null, ccpp: null, ccdi: null, zona: null}
        if (ambito_selected == "-1") {
            ambito_selected = null;
        }
        this.setUbigeo();
        this.setearUbigeo();
        this._ubigeo = JSON.parse(localStorage.getItem('ubigeo'));
        if (this._ubigeo.ccdd == null) {
            _ubigeo.ccdd = ambito_selected
            this.ubigeozona = _ubigeo.ccdd
        }
        else if (this._ubigeo.ccdd != null && this._ubigeo.ccpp == null) {
            _ubigeo.ccdd = this._ubigeo.ccdd
            _ubigeo.ccpp = ambito_selected
            this.ubigeozona = `${_ubigeo.ccdd}${_ubigeo.ccpp}`
        }
        else if (this._ubigeo.ccdd != null && this._ubigeo.ccpp != null && this._ubigeo.ccdi == null) {
            _ubigeo.ccdd = this._ubigeo.ccdd
            _ubigeo.ccpp = this._ubigeo.ccpp
            _ubigeo.ccdi = ambito_selected
            this.ubigeozona = `${_ubigeo.ccdd}${_ubigeo.ccpp}${_ubigeo.ccdi}`
        }
        else if (this._ubigeo.ccdd != null && this._ubigeo.ccpp != null && this._ubigeo.ccdi != null && this._ubigeo.zona == null) {
            _ubigeo.ccdd = this._ubigeo.ccdd
            _ubigeo.ccpp = this._ubigeo.ccpp
            _ubigeo.ccdi = this._ubigeo.ccdi
            _ubigeo.zona = ambito_selected
            this.ubigeozona = `${_ubigeo.ccdd}${_ubigeo.ccpp}${_ubigeo.ccdi}${_ubigeo.zona}`;
        }

        if (ambito_selected == "-1") {
            this._ubigeo.zona = null
        }
        this.evaluacionService.filterPersonalNotaFinal(cargo, _ubigeo.ccdd, _ubigeo.ccpp, _ubigeo.ccdi, _ubigeo.zona).done((personalNotaFinal: IPeaNotaFinal[]) => {
            this.personalNotaFinal = personalNotaFinal;
            this.drawPersonalNotaFinal();
        });
    }

    drawPersonalNotaFinal() {
        let html: string = '';
        let count: number = 0;
        this.personalNotaFinal.map((pea: IPeaNotaFinal, index: number) => {
            if (pea.personalaula_notafinal.length) {
                count++
                let estado = this.drawEstado(pea, count);
                html += `<tr data-value="${pea.id_peaaula}">
                        <td>${index + 1}</td>
                        <td>${pea.id_pea.ape_paterno} ${pea.id_pea.ape_materno} ${pea.id_pea.nombre}</td>
                        <td>&nbsp;${pea.id_pea.dni}</td>
                        <td>${pea.personalaula_notafinal[0].nota_final}</td>
                        <td>${estado}</td>
                     </tr>`;
            }
        });
        $('#table_personalnotafinal').find('tbody').html(html);
    }

    drawEstado(value: IPeaNotaFinal, count: number) {
        let meta: number = $('#meta').text();

        if (value.id_pea.baja_estado == 1) {
            return `<span class="label label-danger">Dado de baja</span>`
        } else {
            if (meta >= count) {
                if (value.personalaula_notafinal[0].nota_final >= 11) {
                    return `<span class="label label-success">Titular</span>`
                } else {
                    return `<span class="label label-danger">No seleccionado</span>`
                }
            } else {
                if (value.personalaula_notafinal[0].nota_final >= 11) {
                    return `<span class="label label-primary">Reserva</span>`;
                } else {
                    return `<span class="label label-danger">No seleccionado</span>`;
                }
            }
        }
    }

    rankear() {
        let meta: number = $('#meta').text()
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
                } else if ($(input).val() <= 2) {
                    span.addClass('label-danger')
                    span.text('Dado de baja')
                } else {
                    span.addClass('label-danger')
                    span.text('No seleccionado')
                }
            }
        });
    }

    cerrarCursoConInternet() {
        let peanotafinal: IPeanotafinal[] = [];
        let meta: number = $('#meta').text()
        let count = 0;
        this.personalNotaFinal.map((value: IPeaNotaFinal) => {
            count++;
            if (value.personalaula_notafinal.length) {
                value.personalaula_notafinal[0].notacap = value.personalaula_notafinal[0].nota_final
                if (value.id_pea.alta_estado == 1) {
                    value.personalaula_notafinal[0].bandaprob = 3
                } else if (value.id_pea.baja_estado == 1) {
                    value.personalaula_notafinal[0].bandaprob = 4
                } else {
                    value.personalaula_notafinal[0].bandaprob = 1
                }
                if (meta >= count) {
                    if (value.personalaula_notafinal[0].nota_final >= 11) {
                        value.personalaula_notafinal[0].capacita = 1
                        value.personalaula_notafinal[0].seleccionado = 1
                        value.personalaula_notafinal[0].sw_titu = 1
                    } else {
                        value.personalaula_notafinal[0].capacita = 0
                        value.personalaula_notafinal[0].seleccionado = 0
                        value.personalaula_notafinal[0].sw_titu = 0
                    }
                } else {
                    if (value.personalaula_notafinal[0].nota_final >= 11) {
                        value.personalaula_notafinal[0].capacita = 1
                        value.personalaula_notafinal[0].seleccionado = 1
                        value.personalaula_notafinal[0].sw_titu = 0
                    } else {
                        value.personalaula_notafinal[0].capacita = 0
                        value.personalaula_notafinal[0].seleccionado = 0
                        value.personalaula_notafinal[0].sw_titu = 0
                    }
                }
                peanotafinal.push(value.personalaula_notafinal[0]);
            }
        });
        this.evaluacionService.cerrarCursoConInternet(peanotafinal, this.curso_id, this.ubigeozona).done((response) => {
            if (response.status) {
                utils.showSwalAlert('Se cerro el curso correctamente', 'Exito!', 'success');
            } else {
                utils.showSwalAlert('Aun hay personas en esta zona que no tienen notas, no se puede cerrar curso', 'Error!', 'error');
                // utils.showInfo('Aun hay personas en esta zona que no tienen notas, no se puede cerrar curso', 'error');
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
        thead += `<th>N°</th><th>Apellidos y Nombres</th><th>DNI</th><th>Cargo</th><th>Zona</th>`
        this.criteriosCurso.criterios.map((value: ICriterio, index: number) => {
            thead += `<th>${value.nombre_criterio}</th>`
        });
        thead += `<th>Nota final</th><th>Estado</th>`
        thead += `</tr>`
        return thead;
    }

    calcularAsistencia(peaaula: IPersonalAula[]) {
        let asistencia: number = 18;
        peaaula.map((value: IPersonalAula, index: number) => {
            if (value.turno_manana == 1) {
                asistencia = asistencia - 0.5;
            }
            if (value.turno_manana == 2 && value.turno_tarde == 2) {
                asistencia = asistencia - 1;
            } else if (value.turno_manana == 2 && value.turno_tarde !== 2) {
                asistencia = asistencia - 1;
            } else if (value.turno_tarde == 2 && value.turno_manana !== 2) {
                asistencia = asistencia - 1;
            }

            if (value.turno_tarde == 1) {
                asistencia = asistencia - 0.5;
            }
        })
        return asistencia
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
                      <td>&nbsp;${persona.id_pea.dni}</td>
                      <td>${persona.id_pea.id_cargofuncional.nombre_funcionario}</td>
                      <td>&nbsp;${persona.id_pea.zona}</td>`;
            this.criteriosCurso.criterios.map((criterio: ICriterio) => {
                let objCriterio: string = '';
                this.detalleCriterios.map((detalle: IDetalleCriterio) => {
                    if (criterio.id_criterio == detalle.criterio) {
                        objCriterio = JSON.stringify({id_criterio: detalle.cursocriterio});
                    }
                });
                let nota: number = null;
                criterio.id_criterio == 2 ? nota = this.calcularAsistencia(persona.personalaula) : nota = null;
                persona.personalaula_notas.filter((val: IPersonalNotas) => {
                    if (val.cursocriterio.criterio == criterio.id_criterio) {
                        criterio.id_criterio == 2 ? nota = this.calcularAsistencia(persona.personalaula) : nota = val.nota;
                        this.detalleCriterios.map((criteriodetalle: IDetalleCriterio) => {
                            if (val.cursocriterio.criterio == criteriodetalle.criterio) {
                                nota_final = nota_final + (nota * (criteriodetalle.ponderacion / 100));
                            }
                        });
                    }
                });
                if (persona.id_pea.baja_estado == 1) {
                    tbody += `<td></td>`
                } else {
                    if (nota == null) {
                        tbody += `<td><input ${disabled} data-value=${objCriterio} value="${nota}" min="0" max="20" type="number"></td>`
                    } else {
                        tbody += `<td><input ${disabled} data-value=${objCriterio} disabled value="${nota}" min="0" max="20" type="number"></td>`
                    }

                }
            });
            nota_final = Math.round(nota_final * 100) / 100;
            let span: string = '';
            if (nota_final >= 11) {
                span = `<span name="span_state" class="label label-success">Apto</span>`;
            } else {
                span = `<span name="span_state" class="label label-danger">No apto</span>`;
            }

            if (persona.id_pea.baja_estado == 1) {
                tbody += `<td></td><td><span name="span_state" class="label label-danger">Dado de baja</span></td>`
            } else {
                tbody += `<td><input disabled min="0" max="20" value="${nota_final}" name="nota_final" type="number"></td>
                          <td>${span}</td></tr>`
            }

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
        let vacio: number = 0;
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
                if (nota == "") {
                    vacio++
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
            utils.showInfo('La nota no puede ser mayor a 20, por favor corrijalo', 'error');
            input.focus();
            return false;
        }
        if (vacio > 0) {
            utils.showInfo('Debe de llenar todos los campos por favor!', 'error');
            return false;
        }
        utils.alert_confirm(() => {
            this.evaluacionService.saveNotas(request).done((response) => {
                $('#select_aulas_asignadas').trigger('change');
                utils.showSwalAlert('Se ha guardado las notas!', 'Exito!', 'success');
                this.saveNotaFinal();
            });
        }, 'Después de guardar las notas no se va tener opción a editar, Está seguro de guardar?', 'info')
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
            if (nota_final >= 11) {
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

    setUbigeo() {
        let ambito: any = {};
        ubigeo.ccdd !== '' ? this.ambitos['ccdd'] = ubigeo.ccdd : this.ambitos['ccdd'] = null;
        ubigeo.ccpp !== '' ? this.ambitos['ccpp'] = ubigeo.ccpp : this.ambitos['ccpp'] = null;
        ubigeo.ccdi !== '' ? this.ambitos['ccdi'] = ubigeo.ccdi : this.ambitos['ccdi'] = null;
        ubigeo.zona !== '' ? this.ambitos['zona'] = ubigeo.zona : this.ambitos['zona'] = null;
    }

    getAmbitos() {
        this.setUbigeo();
        let by: any;
        this._ubigeo.ccdd == '' ? this._ubigeo.ccdd = null : '';
        this._ubigeo.ccpp == '' ? this._ubigeo.ccpp = null : '';
        this._ubigeo.ccdi == '' ? this._ubigeo.ccdi = null : '';
        this.evaluacionService.ambitos(this._ubigeo.ccdd, this._ubigeo.ccpp, this._ubigeo.ccdi).done((ambitos) => {
            if (this._ubigeo.ccdd == null) {
                by = {id: 'ccdd', text: ['departamento']}
            }
            else if (this._ubigeo.ccdd != null && this._ubigeo.ccpp == null) {
                by = {id: 'ccpp', text: ['provincia']}
            } else if (this._ubigeo.ccpp != null && this._ubigeo.ccdi == null) {
                by = {id: 'ccdi', text: ['distrito']}
            } else if (this._ubigeo.ccpp != null && this._ubigeo.ccdi != null) {
                by = {id: 'ZONA', text: ['ZONA']}
            }
            this.ambitoDetalle = ambitos;

            utils.setDropdown(this.ambitoDetalle, by, {
                id_element: 'select_zonas',
                bootstrap_multiselect: true,
                select2: false
            }, false, 'Todos');
        });
    }

}

new EvaluacionView(true);