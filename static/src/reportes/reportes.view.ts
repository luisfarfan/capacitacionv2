/**
 * Created by Administrador on 3/04/2017.
 */
import {ReporteService} from 'reportes.service';
import {IReportes} from 'reportes.interface';
import UbigeoView from '../ubigeo/ubigeo.view';
import {IUbigeo} from "../ubigeo/ubigeo.view";
import {CursoInyection} from '../comun.utils';
declare var $: any;
declare var ubigeo: IUbigeo;
declare var BASEURL: string;
class ReportesView extends UbigeoView {
    private reporteService: ReporteService = new ReporteService();
    private reportes: IReportes[] = [];
    private reporte_selected: IReportes = null;
    private curso: number;

    constructor() {
        super('departamentos', 'provincias', 'distritos', 'zona', {
            ccdd: ubigeo.ccdd,
            ccpp: ubigeo.ccpp,
            ccdi: ubigeo.ccdi,
            zona: ubigeo.zona,
        });
        new CursoInyection();
        this.getReportes();
        $('#cursos').change(() => {
            this.curso = $('#cursos').val();
        });
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
    }

    getReporteSelectedSession(): IReportes {
        return JSON.parse(localStorage.getItem('reporteSelected'));
    }

    getReportes() {
        this.reporteService.listaReportes().done((reportes) => {
            this.reportes = reportes;
            let html = `<option value="">Seleccione</option>`;
            this.reportes.map((reporte: IReportes) => {
                html += `<option value="${reporte.id}">${reporte.nombre}</option>`
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