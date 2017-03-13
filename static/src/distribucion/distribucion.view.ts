/**
 * Created by lfarfan on 12/03/2017.
 */
import {Curso} from '../comun.utils';
import {DistribucionService} from '../distribucion/distribucion.service';
import {LocalService} from '../locales_consecucion/locales.service';
import {ILocalCurso, ILocal, ILocalAmbienteDetail} from '../locales_consecucion/local.interface';
import {ILocalZona, IPersonal} from 'distribucion.interface';
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
    private localCursoSelected: ILocalCurso = null;
    private localAmbientes: ILocalAmbienteDetail[] = []
    private localZonas: ILocalZona[] = [];
    private locales: ILocal[] = [];
    private personal: IPersonal[] = []

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
        $('#select_locales_seleccionados_asignacion').on('change', () => {
            let local_selected: any = $('#select_locales_seleccionados_asignacion').val();
            this.getLocalZonas(local_selected);
        });
        $('#select_locales_seleccionados').on('change', () => {
            let local_selected: any = $('#select_locales_seleccionados').val();
            this.setLocalCurso(local_selected);
            this.getLocalAmbientes();
        });

        $('#btn_pea_capacitar').on('click', () => {
            if (this.localCursoSelected == null) {
                utils.showInfo('Por favor, seleccione un Local');
                return false;
            }
            this.getPersonalbyLocalCurso();
            $('#modal_personal_capacitar_no_distribuido').modal('show');
        });

        $('#btn_distribuir').on('click', () => {
            this.distribuirPersonal();
        })


    }

    filterLocalesSeleccionados() {
        this.localService.getbyAmbienteGeografico(this.filterFields.curso, this.filterFields.ubigeo, this.filterFields.zona).done((localesCurso) => {
            this.localesCurso = localesCurso;
            this.locales = [];
            this.localesCurso.map((value: ILocalCurso, index: number) => {
                this.locales.push(value.local);
            });
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
        this.setLocalCurso(local_selected);
        this.distribucionService.asignarZonas({
            localcurso: this.localCursoSelected.id,
            zonas: zonasAsignar
        }).done((response) => {
            this.getZonasDistrito();
            this.getLocalZonas(local_selected);
        });
    }

    getLocalZonas(localselected: any) {
        this.setLocalCurso(localselected);
        if (this.localCursoSelected) {
            this.distribucionService.filterLocalZona(this.localCursoSelected.id).done((localzonas: ILocalZona[]) => {
                this.localZonas = localzonas;
                let html: String = '';
                this.localZonas.map((value: ILocalZona, index: number) => {
                    html += `<tr>
                            <td>${index + 1}</td>
                            <td>${this.localCursoSelected.local.nombre_local}</td>
                            <td>${value.zona.ZONA}</td>
                            <td>${value.zona.ETIQ_ZONA}</td>    
                         </tr>`
                });
                $('#table_localzonas_detalle').find('tbody').html(html);
            });
        } else {
            $('#table_localzonas_detalle').find('tbody').html('');
        }
    }

    setLocalCurso(local_selected: any) {
        this.localesCurso.map((value: ILocalCurso, index: number) => {
            value.local.id_local == local_selected ? this.localCursoSelected = value : ''
        });
        local_selected == "-1" ? this.localCursoSelected = null : '';
    }

    getLocalAmbientes() {
        this.distribucionService.filterLocalAmbientes(this.localCursoSelected.id).done((localAmbientes) => {
            this.localAmbientes = localAmbientes;
            let html: string = '';
            this.localAmbientes.map((value: ILocalAmbienteDetail, index: number) => {
                html += `<tr data-value="${value.id_localambiente}">
                            <td>${index + 1}</td>
                            <td>${value.id_ambiente.nombre_ambiente}</td>
                            <td>${value.numero}</td>
                            <td>${value.capacidad}</td>
                            <td>${0}</td>
                            <td>${0}</td>
                         </tr>`
            });
            $('#tabla_detalle_ambientes').find('tbody').html(html);
        });
    }

    getPersonalbyLocalCurso() {
        this.distribucionService.getPersonalbylocalCurso(this.localCursoSelected.id).done((personal) => {
            this.personal = personal;
            let html = '';
            let table_personal_capacitar = $('#tabla_pea_capacitar').DataTable();
            this.personal.map((value: IPersonal, index: number) => {
                html += `<tr>
                             <td>${index + 1}</td>
                             <td>${value.ape_paterno}</td>
                             <td>${value.ape_materno} </td>
                             <td>${value.nombre}</td>
                             <td>${value.dni}</td>
                             <td>${value.zona}</td>
                             <td>${value.id_cargofuncional.nombre_funcionario}</td>
                         </tr>`
            });
            table_personal_capacitar.destroy();
            $('#tabla_pea_capacitar').find('tbody').html(html);
            table_personal_capacitar = $('#tabla_pea_capacitar').DataTable();
        })
    }

    distribuirPersonal() {
        this.distribucionService.distribuirPersonal(this.localCursoSelected.id).done((response) => {
            console.log(response)
        });
    }
}
new DistribucionView();