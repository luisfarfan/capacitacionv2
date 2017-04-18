/**
 * Created by Administrador on 3/04/2017.
 */
import {ReporteService} from 'reportes.service';
import {IReportes} from 'reportes.interface';
import UbigeoView from '../ubigeo/ubigeo.view';
import {IUbigeo} from "../ubigeo/ubigeo.view";
import {CursoInyection} from '../comun.utils';
import * as utils from '../core/utils';
declare var $: any;
declare var ubigeo: IUbigeo;
declare var BASEURL: string;
class ReportesView extends UbigeoView {
    private reporteService: ReporteService = new ReporteService();
    private reportes: IReportes[] = [];
    private reporte_selected: IReportes = null;
    private curso: number;
    private urlParams: string = '';
    private cursoinyection: CursoInyection = null;

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
        this.setEvents();
        this.getReporteSelectedSession();
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
        console.log(url);
        this.reporteService.reporteDinamico(url).done((data: any) => {
            console.log(data);
        })
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