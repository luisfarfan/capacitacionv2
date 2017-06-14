/**
 * Created by Administrador on 3/04/2017.
 */
import {ReporteService} from 'reportes.service';
import {IReportes} from 'reportes.interface';
import UbigeoView from '../ubigeo/ubigeo.view';
import {IUbigeo} from "../ubigeo/ubigeo.view";
import {CursoInyection} from '../comun.utils';
import {DistribucionService} from '../distribucion/distribucion.service';
import {EvaluacionView} from '../evaluacion/evaluacion.view';
import {AsistenciaService} from '../asistencia/asistencia.service';
import * as utils from '../core/utils';
import {AsistenciaView} from "../asistencia/asistencia.view";
import {EvaluacionService} from '../evaluacion/evaluacion.service';
declare var $: any;
declare var ubigeo: IUbigeo;
declare var BASEURL: string;
class ReportesView extends UbigeoView {
    private reporteService: ReporteService = new ReporteService();
    private distribucionService: DistribucionService = new DistribucionService();
    private asistenciaService: AsistenciaService = new AsistenciaService();
    private asistenciaView: AsistenciaView = null;
    private evaluacionView: EvaluacionView = null
    private reportes: IReportes[] = [];
    private reporte_selected: IReportes = null;
    private curso: number;
    private urlParams: string = '';
    private cursoinyection: CursoInyection = null;
    private local_selected: number = null;
    private evaluacionService: EvaluacionService = new EvaluacionService();
    private REPORTESCONCARGO: Array<number> = [6, 7, 9]

    constructor() {
        super('departamentos', 'provincias', 'distritos', 'zona', {
            ccdd: ubigeo.ccdd,
            ccpp: ubigeo.ccpp,
            ccdi: ubigeo.ccdi,
            zona: ubigeo.zona,
        });
        $('#select_reportes').selectBoxIt({
            autoWidth: false,
            theme: "bootstrap"
        });
        if (localStorage.getItem('reporteSelected') == null) {
            this.reporte_selected = null
        } else {
            let json: any = localStorage.getItem('reporteSelected')
            this.reporte_selected = json
        }
        this.cursoinyection = new CursoInyection();
        this.getReportes();
        this.getReporteSelectedSession();
        this.setEvents();
        $('#btn_exportar').on('click', () => {
            utils.exportarTable({
                buttonName: 'btn_exportar',
                contenedor: 'div_export',
                fileName: 'reporte.xls',
                table: 'div_tabla_reporte',
                columnsDelete: []
            });
        })
    }

    setEvents() {
        $('#btn_reporte').click(() => this.consultarReporte());

        $('#cursos').change(() => this.curso = $('#cursos').val() == '-1' || $('#cursos').val() == '' ? null : $('#cursos').val());

        $('#select_reportes').change(() => {
            let reporte_selected = $('#select_reportes').val();
            if (reporte_selected != '-1' && reporte_selected != null) {
                this.reportes.filter((reporte: IReportes) => {
                    if (reporte_selected == reporte.id) {
                        this.reporte_selected = reporte;
                        this.setReporteSelectedSession(this.reporte_selected);
                    }
                });
                window.location.replace(`${BASEURL}/reporte/${this.reporte_selected.id}/?curso=${$('#cursos').val()}`);
            }
        });

        $('#zona').change(() => {
            this.getLocales();
        });
        $('#select_aulas_asignadas2').on('change', (element: JQueryEventObject) => {
            let selected = $(element.currentTarget).val();
            if (selected == '') {
                this.asistenciaView.localAmbienteSelected = null;
            } else {
                console.log(this.asistenciaView.localesAmbientes)
                this.asistenciaView.localesAmbientes.map((value: any, index: number) => value.id_localambiente == selected ? this.asistenciaView.localAmbienteSelected = value : '');
                $('#span_nombre_local').text(`${this.asistenciaView.localAmbienteSelected.localcurso.local.nombre_local}`)
                $('#span_direccion').text(`${this.asistenciaView.localAmbienteSelected.localcurso.local.nombre_via} - ${this.asistenciaView.localAmbienteSelected.localcurso.local.n_direccion}`)
                $('#span_fecha_inicio').text(`${this.asistenciaView.localAmbienteSelected.localcurso.local.fecha_inicio}`)
                $('#span_aula').text(`${this.asistenciaView.localAmbienteSelected.numero}`);

                this.asistenciaService.getRangoFechas(this.asistenciaView.localAmbienteSelected.localcurso.local.fecha_inicio, this.asistenciaView.localAmbienteSelected.localcurso.local.fecha_fin).done((fechasRango) => {
                    this.asistenciaView.rangoFechas = fechasRango;
                    this.asistenciaView.drawHeaderFechas();
                    this.asistenciaView.cargarPersonalAsistenciaPorAula();
                });
            }
        });
    }

    getLocales() {
        this.reporteService.getLocales($('#cursos').val(), this.ubigeo, this.zona).done((locales) => {
            utils.setDropdown(locales, {id: 'id_local', text: ['nombre_local']}, {
                id_element: 'locales',
                bootstrap_multiselect: false,
                select2: false
            });
            if (this.reporte_selected.id != 3 && this.reporte_selected.id != 4) {
                $('#locales').off();
                $('#locales').on('change', () => {
                    this.local_selected = $('#locales').val();
                    this.getAulas();
                });
            }
        });
    }

    getAulas() {
        this.distribucionService.filterLocalAmbientes(this.local_selected, true).done((aulas) => {
            let html: string = '';
            html += `<option value="">Seleccione Aula</option>`
            aulas.map((value: any, index: number) => {
                html += `<option value="${value.id_localambiente}">${value.id_ambiente.nombre_ambiente} - N° ${value.numero}</option>`
            });
            $('#aulas').html(html);
            $('#select_aulas_asignadas2').html(html);
        });
    }

    getAulasAsistencia() {
        this.asistenciaService.getAulasbyLocal(this.local_selected).done((aulas) => {
            console.log(aulas);
            this.asistenciaView.localesAmbientes = aulas;
            let html: string = '';
            html += `<option value="">Seleccione Aula</option>`
            aulas.map((value: any, index: number) => {
                html += `<option value="${value.id_localambiente}">${value.id_ambiente.nombre_ambiente} - N° ${value.numero}</option>`
            });
            $('#select_aulas_asignadas2').html(html);
        });
    }

    setReporteSelectedSession(data: any) {
        localStorage.setItem('reporteSelected', JSON.stringify(data));
        this.reporte_selected = JSON.parse(localStorage.getItem('reporteSelected'));
    }

    getReporteSelectedSession() {
        this.reporte_selected = JSON.parse(localStorage.getItem('reporteSelected'));
    }

    consultarReporte() {
        let url = this.armarUrl();
        $('#span_curso').text($('#cursos :selected').text());
        if (this.reporte_selected.id == 3) {
            this.asistenciaView.setLocalAmbienteSelected($('#select_aulas_asignadas2').val());
        } else if (this.reporte_selected.id == 4) {
            this.asistenciaService.getPersonalAsistenciaDetalle($('#select_aulas_asignadas').val()).done((personal) => {
                this.evaluacionView.personal = personal;
                this.evaluacionView.drawTbody();
            });
        } else if (this.reporte_selected.id == 11) {
            this.distribucionService.filterPersonalbyAula($('#aulas').val()).done((personas) => {
                $('#tabla_reporte').find('tbody').html(this.reportePorCodigo(11, personas));
            });
        }
        else {
            this.reporteService.reporteDinamico(url).done((data: any) => {
                let html: string = '';
                let campos: Array<string> = this.reporte_selected.campos.split(',')
                if (this.reporte_selected.codigo == "1") {
                    html = this.reportePorCodigo(1, data);
                } else if (this.reporte_selected.codigo == "2") {
                    html = this.reportePorCodigo(2, data);
                } else if (this.reporte_selected.codigo == "3") {
                    html = this.reportePorCodigo(3, data);
                } else if (this.reporte_selected.codigo == "5") {
                    html = this.reportePorCodigo(5, data);
                } else if (this.reporte_selected.codigo == "7") {
                    html = this.reportePorCodigo(7, data);
                }
                else {
                    if (this.reporte_selected.id == 2 || this.reporte_selected.id == 12) {
                        $('#span_departamento').text($('#departamentos :selected').text());
                        $('#span_provincia').text($('#provincias :selected').text());
                        $('#span_distrito').text($('#distritos :selected').text());
                    }
                    data.map((datareporte: any, index: number) => {
                        html += `<tr><td>${index + 1}</td>`;
                        if (typeof datareporte['ambito'] === "object") {
                            html += `<td>${datareporte['ambito'].departamento} - ${datareporte['ambito'].provincia} - ${datareporte['ambito'].distrito}</td>`
                        } else {
                            if ('ambito' in datareporte) {
                                html += `<td>${datareporte['ambito']}</td>`
                            }
                        }
                        campos.map((field: string) => {
                            if (field in datareporte) {
                                html += `<td>${datareporte[field] == null ? '-' : datareporte[field]}</td>`
                            } else {
                                html += `<td>-</td>`
                            }
                        });
                        html += `</tr>`
                    })
                }
                $('#tabla_reporte').find('tbody').html(html);
            })
        }

    }

    reportePorCodigo(codigo: number, data: Array<any>) {
        let html = '';
        switch (codigo) {
            case 0:
                break;
            case 1:
                data.map((datareporte, index) => {
                    html += `<tr><td>${index + 1}</td><td>${datareporte['ambito'][0].departamento}</td> <td>${datareporte['ambito'][0].provincia}</td> <td> ${datareporte['ambito'][0].distrito}</td>
                             <td>${datareporte['aulas_programadas']}</td><td>${datareporte['disponible']}</td><td>${datareporte['disponible_percent']}</td>
                             <td>${datareporte['usar']}</td><td>${datareporte['usar_percent']}</td></tr>`

                });
                break;
            case 2:
                data.map((datareporte, index) => {
                    html += `<tr><td>${index + 1}</td><td>${datareporte['ambito'][0].departamento}</td>
                                 <td>${datareporte['ambito'][0].provincia}</td><td> ${datareporte['ambito'][0].distrito}</td>
                                 <td>-</td>
                             <td>${datareporte['meta_campo']}</td><td>${datareporte['meta_capa']}</td>
                             <td>${datareporte['inscritos']}</td>
                             <td>${datareporte['inscritos_percent']}</td>
                             <td>${datareporte['seleccionados']}</td>
                             <td>${datareporte['seleccionados_percent']}</td>
                             <td>${datareporte['reserva']}</td><td>${datareporte['reserva_percent']}</td></tr>`
                });
                break;
            case 3:
                data.map((datareporte, index) => {
                    html += `<tr><td>${index + 1}</td><td>${datareporte['ambito'][0].departamento}</td>
                                 <td>${datareporte['ambito'][0].provincia}</td><td> ${datareporte['ambito'][0].distrito}</td>
                                 <td>-</td>
                             <td>${datareporte['meta_campo']}</td><td>${datareporte['meta_capa']}</td>
                             <td>${datareporte['bajas']}</td>
                             <td>${datareporte['altas']}</td>                             
                             <td>${datareporte['capacitado']}</td><td>${datareporte['capacitado_percent']}</td></tr>`
                });
                break;
            case 4:

                break;
            case 5:
                data.map((datareporte, index) => {
                    html += `<tr><td>${index + 1}</td><td>${datareporte['ambito'][0].departamento}</td>
                                 <td>${datareporte['ambito'][0].provincia}</td><td> ${datareporte['ambito'][0].distrito}</td>
                                 <td>-</td>
                             <td>${datareporte['meta_campo']}</td>
                             <td>${datareporte['titular']}</td>
                             <td>${datareporte['titular_percent']}</td>                             
                             <td>${datareporte['reserva']}</td><td>${datareporte['reserva_percent']}</td>
                             <td>${datareporte['noseleccionado']}</td><td>${datareporte['noseleccionado_percent']}</td>
                             </tr>`
                });
                break;
            case 7:
                data.map((datareporte, index) => {
                    html += `<tr><td>${index + 1}</td>
                                 <td>${datareporte['ubigeo'][0].ubigeo}</td>
                                 <td>${datareporte['ubigeo'][0].departamento}</td>
                                 <td>${datareporte['ubigeo'][0].provincia}</td>
                                 <td>${datareporte['ubigeo'][0].distrito}</td>
                                 <td>-</td>
                                 <td>${datareporte['zona_ubicacion_local']}</td>
                                 <td>${datareporte['manzana']}</td>
                             <td>${datareporte['nombre_local'] == null ? '-' : datareporte['nombre_local']}</td>
                             <td>${datareporte['nombre_via'] == null ? '-' : datareporte['nombre_via']}</td>
                             <td>${datareporte['responsable_nombre'] == null ? '-' : datareporte['responsable_nombre']}</td>                             
                             <td>${datareporte['turno_uso_local'] == null ? '-' : datareporte['turno_uso_local']}</td>
                             <td>${datareporte['gestion'] == null ? '-' : datareporte['gestion']}</td>
                             <td>${datareporte['numero_alumnos'] == null ? '-' : datareporte['numero_alumnos']}</td>
                             <td>${datareporte['numero_docentes'] == null ? '-' : datareporte['numero_docentes']}</td>
                             <td>${datareporte['numero_secciones'] == null ? '-' : datareporte['numero_secciones']}</td>
                             </tr>`
                });
                break;
            case 11:
                data.map((datareporte, index) => {
                    html += `<tr><td>${index + 1}</td>
                             <td>${datareporte.id_pea.nombre} ${datareporte.id_pea.ape_paterno} ${datareporte.id_pea.ape_materno}</td>
                             <td>${datareporte.id_pea.dni}</td>
                             <td>${datareporte.id_pea.id_cargofuncional.nombre_funcionario}</td>
                             <td>-</td>`
                });
                break;

        }
        return html;
    }

    armarFieldsData(data: any) {
        let arrayFields: Array<string> = [];
        if (this.reporte_selected.codigo == 'r7') {
            arrayFields = ['zona', 'nombre_local', 'tipo_via', 'nombre_via']
        }

        utils.drawTable(data, [], null, {
            edit_name: '',
            delete_name: '',
            enumerar: true,
            table_id: 'tabla_reporte',
            datatable: false,
            checkbox: '',
            checked: false
        });
    }

    armarUrl(): string {
        let params: string = '';
        if (this.REPORTESCONCARGO.indexOf(this.reporte_selected.id) > -1) {
            params += `${$('#cargo_funcional').val()}/`
        } else {
            if (this.cursoinyection.curso_selected.id_curso != null) {
                params += `${this.cursoinyection.curso_selected.id_curso}/`
            }
        }
        if (this.ccdd != null && this.ccdd != "-1") {
            params += `${this.ccdd}/`
        }
        if (this.ccpp != null && this.ccpp != "-1") {
            params += `${this.ccpp}/`
        }
        if (this.ccdi != null && this.ccdi != "-1") {
            params += `${this.ccdi}/`
        }
        if (this.zona != null && this.zona != "-1") {
            params += `${this.zona}/`
        }

        return `${BASEURL}/reportes/${this.reporte_selected.url_service}/${params}`
    }

    getReportes() {
        this.reporteService.listaReportes().done((reportes) => {
            this.reportes = reportes;
            let reporte_selected = $('#select_reportes').val();
            this.reportes.filter((value: IReportes) => value.id == reporte_selected ? this.reporte_selected = value : '');
            this.filtrosSegunReporte();
            if (this.reporte_selected.id == 4) {
                this.evaluacionView = new EvaluacionView(false);
                $('#locales').change(() => {
                    let localvalue = $('#locales').val();
                    this.local_selected = localvalue;
                    this.getAulas();
                });
                $('#aulas').change(() => {
                    let aulavalue = $('#aulas').val();
                    this.evaluacionView.getCriterios(this.curso);
                    this.evaluacionView.getCargosFuncionales(this.curso);
                });
            } else if (this.reporte_selected.id == 3) {
                this.asistenciaView = new AsistenciaView();
                $('#locales').change(() => {
                    let localvalue = $('#locales').val();
                    this.local_selected = localvalue;
                    this.getAulasAsistencia();
                    // this.getAulas();
                });
            }
        });
    }

    filtrosSegunReporte() {
        if (this.REPORTESCONCARGO.indexOf(this.reporte_selected.id) > -1) {
            this.evaluacionService.cargosCurso($('#cursos').val()).done((cargos) => {
                let html = `<option value="-1">Seleccione</option>`;
                cargos.map((cargo: any, index: number) => {
                    html += `<option value="${cargo.id_cargofuncional.id_cargofuncional}">${cargo.id_cargofuncional.nombre_funcionario}</option>`
                });
                $('#cargo_funcional').html(html);
            });
            $('#cargo_funcional').change(() => {
                $('#span_cargofuncional').text($('#cargo_funcional :selected').text());
            });
        }
    }
}
new ReportesView();