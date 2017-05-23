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

    constructor() {
        super('departamentos', 'provincias', 'distritos', 'zona', {
            ccdd: ubigeo.ccdd,
            ccpp: ubigeo.ccpp,
            ccdi: ubigeo.ccdi,
            zona: ubigeo.zona,
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
                window.location.replace(`${BASEURL}/reporte/${this.reporte_selected.slug}/`);
            }
        });

        $('#zona').change(() => {
            this.getLocales();
        });
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
            });
        }
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
        this.reporteService.getLocales(this.curso, this.ubigeo, this.zona).done((locales) => {
            utils.setDropdown(locales, {id: 'id_local', text: ['nombre_local']}, {
                id_element: 'locales',
                bootstrap_multiselect: false,
                select2: false
            });
        })
    }

    getAulas() {
        this.distribucionService.filterLocalAmbientes(this.local_selected).done((aulas) => {
            let html: string = '';
            html += `<option value="">Seleccione Aula</option>`
            aulas.map((value: any, index: number) => {
                html += `<option value="${value.id_localambiente}">${value.id_ambiente.nombre_ambiente} - N° ${value.numero}</option>`
            });
            $('#aulas').html(html);
        });
    }

    getAulasAsistencia() {
        this.asistenciaService.getAulasbyLocal(this.local_selected).done((aulas) => {
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
            this.asistenciaService.getPersonalAsistenciaDetalle($('#aulas').val()).done((personal) => {
                this.evaluacionView.personal = personal;
                this.evaluacionView.drawTbody();
            });
        } else if (this.reporte_selected.id == 4) {
            this.asistenciaService.getPersonalAsistenciaDetalle($('#select_aulas_asignadas').val()).done((personal) => {
                this.evaluacionView.personal = personal;
                this.evaluacionView.drawTbody();
            });
        }
        else {
            this.reporteService.reporteDinamico(url).done((data: any) => {
                let html: string = '';
                let campos: Array<string> = this.reporte_selected.campos.split(',')
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
                $('#tabla_reporte').find('tbody').html(html);
            })
        }

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
        if (this.cursoinyection.curso_selected.id_curso != null) {
            params += `${this.cursoinyection.curso_selected.id_curso}/`
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
            let html = `<option value="">Seleccione</option>`;
            this.reportes.map((reporte: IReportes) => {
                if (this.reporte_selected !== null) {
                    if (this.reporte_selected.id == reporte.id) {
                        html += `<option selected value="${reporte.id}">${reporte.nombre}</option>`
                    } else {
                        html += `<option value="${reporte.id}">${reporte.nombre}</option>`
                    }
                } else {
                    html += `<option value="${reporte.id}">${reporte.nombre}</option>`
                }
            });
            $('#select_reportes').html(html);
            $('#select_reportes').selectBoxIt({
                autoWidth: false,
                theme: "bootstrap"
            });
        });
    }
}
new ReportesView();