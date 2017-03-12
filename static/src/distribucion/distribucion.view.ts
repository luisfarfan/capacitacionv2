/**
 * Created by lfarfan on 12/03/2017.
 */
import {Curso} from '../comun.utils';
import {DistribucionService} from '../distribucion/distribucion.service';
import {LocalService} from '../locales_consecucion/locales.service';
import {ILocalCurso, ILocal} from '../locales_consecucion/local.interface';
import UbigeoService from '../ubigeo/ubigeo.service';
import {IZona} from '../ubigeo/ubigeo.interface';
import * as utils from '../core/utils';

declare var ubigeo: any;
declare var $: any;
interface FilterFields {
    ccdd: string,
    ccpp: string,
    ccdi: string,
    zona: string,
    ubigeo: string,
    curso: number
}
class DistribucionView {
    private curso: Curso;
    private localService: LocalService = new LocalService();
    private ubigeoService: UbigeoService = new UbigeoService();
    private distribucionService: DistribucionService = new DistribucionService();
    private filterFields: FilterFields = {
        ccdd: ubigeo.ccdd,
        ccpp: ubigeo.ccpp,
        ccdi: ubigeo.ccdi,
        zona: ubigeo.zona == '' ? null : ubigeo.zona,
        ubigeo: `${ubigeo.ccdd}${ubigeo.ccpp}${ubigeo.ccdi}`,
        curso: null
    };
    private zonas: IZona[] = [];
    private localesCurso: ILocalCurso[] = [];
    private locales: ILocal[] = [];

    constructor() {
        this.curso = new Curso();
        $('#cursos').on('change', () => {
            this.filterFields.curso = this.curso.curso_selected.id_curso;
            this.filterLocalesSeleccionados();
            this.getZonasDistrito();
        });
        $('#btn_asignacion_zonas').on('click', () => {
            $('#modal_asignacion_zonas').modal('show');
        });
        $('#btn_asignar_zonas').on('click', () => {
            let local_selected: any = $('#select_locales_seleccionados_asignacion').val();
            let zonasAsignar: Array<string> = $('#select_zonas_por_asignar').val();
            if (local_selected == "-1" || zonasAsignar == null) {
                utils.showInfo('Por favor seleccione el Local, y las Zonas a asignar a este Local');
                return false;
            } else {
                utils.alert_confirm(() => this.asignarZonas(), 'Esta seguro de asignar las zonas seleccionadas al Local?')
            }
        });
    }

    filterLocalesSeleccionados() {
        this.localService.getbyAmbienteGeografico(this.filterFields.curso, this.filterFields.ubigeo, this.filterFields.zona).done((localesCurso) => {
            this.localesCurso = localesCurso;
            this.locales = [];
            this.localesCurso.map((value: ILocalCurso, index: number) => {
                this.locales.push(value.local);
            });
            console.log(this.localesCurso)
            utils.setDropdown(this.locales, {
                id: 'id_local',
                text: ['nombre_local']
            }, {id_element: 'select_locales_seleccionados', bootstrap_multiselect: true, select2: false});
            utils.setDropdown(this.locales, {
                id: 'id_local',
                text: ['nombre_local']
            }, {id_element: 'select_locales_seleccionados_asignacion', bootstrap_multiselect: true, select2: false});
        });
    }

    getZonasDistrito() {
        this.distribucionService.getZonasLibres(this.filterFields.curso, this.filterFields.ubigeo).done((zonas: IZona[]) => {
            this.zonas = zonas;
            utils.setDropdown(this.zonas, {id: 'ID', text: ['ZONA']}, {
                id_element: 'select_zonas_por_asignar',
                bootstrap_multiselect: false,
                select2: true
            });
        })
    }

    asignarZonas() {
        let local_selected: any = $('#select_locales_seleccionados_asignacion').val();
        let zonasAsignar: Array<string> = $('#select_zonas_por_asignar').val();
        let localcurso_id: number = null;
        this.localesCurso.map((value: ILocalCurso, index: number) => {
            debugger
            value.local.id_local == local_selected ? localcurso_id = value.id : ''
        });
        this.distribucionService.asignarZonas({localcurso: localcurso_id, zonas: zonasAsignar}).done((response) => {
            this.getZonasDistrito();
        });
    }
}
new DistribucionView();