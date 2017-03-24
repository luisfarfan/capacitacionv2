/**
 * Created by lfarfan on 12/03/2017.
 */
import {CursoInyection} from '../comun.utils';
import {DistribucionService} from '../distribucion/distribucion.service';
import {LocalService} from '../locales_consecucion/locales.service';
import {ILocalCurso, ILocal, ILocalAmbienteDetail, ILocalAmbiente} from '../locales_consecucion/local.interface';
import {ILocalZona, IPersonal, IPersonalAula, FilterFields, IUbigeo, IUsuario} from 'distribucion.interface';
import UbigeoService from '../ubigeo/ubigeo.service';
import {IZona} from '../ubigeo/ubigeo.interface';
import * as utils from '../core/utils';
import {upgradeTooltip} from "../core/utils";

declare var ubigeo: any;
declare var $: any;

class DistribucionView {
    private curso: CursoInyection;
    private localService: LocalService = new LocalService();
    private ubigeoService: UbigeoService = new UbigeoService();
    private distribucionService: DistribucionService = new DistribucionService();
    private filterFields: FilterFields = {
        ccdd: ubigeo.ccdd != '' ? ubigeo.ccdd : null,
        ccpp: ubigeo.ccpp != '' ? ubigeo.ccpp : null,
        ccdi: ubigeo.ccdi != '' ? ubigeo.ccdi : null,
        zona: ubigeo.zona == '' ? null : ubigeo.zona,
        curso: null
    };
    private zonas: IZona[] = [];
    private localesCurso: ILocalCurso[] = [];
    private localCursoSelected: ILocalCurso = null;
    private localAmbientes: ILocalAmbienteDetail[] = []
    private localZonas: ILocalZona[] = [];
    private locales: ILocal[] = [];
    private personal: IPersonal[] = [];
    private personalContingencia: IPersonal[] = [];
    private localAmbienteSelected: ILocalAmbienteDetail = null;
    private personalAula: IPersonalAula[] = [];
    private ambitosLibres: IUbigeo[] = [];
    private instructores: IUsuario[] = [];

    constructor() {
        this.curso = new CursoInyection();
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
            if (this.personal.length == 0) {
                utils.showInfo('No existe personal para realizar la distribución');
                return false;
            }
            utils.alert_confirm(() => this.distribuirPersonal(), 'Esta seguro de realizar la distribución', 'success');
        });
        $('#btn_pea_contingencia').on('click', () => {
            if (this.localCursoSelected == null) {
                utils.showInfo('Por favor, seleccione un Local');
                return false;
            }
            this.getContingenciabyLocalCurso();
            $('#modal_personal_reserva').modal('show');
        });
        $('#a_save_instructor').on('click', () => {
            if (this.localAmbienteSelected == null || $('#select_instructor').val() == "") {
                utils.showInfo('Para guardar el instructor, se necesita seleccionar un Aula')
                return false;
            } else {
                utils.alert_confirm(() => this.saveInstructor(), 'Está seguro de guardar el Instructor en esta aula?', 'info');
            }
        });
        this.getInstructores();
    }

    getInstructores() {
        this.distribucionService.getInstructoresSeguridad().done((instructores) => {
            this.instructores = instructores;
            let html = '<option value="">Seleccione Instructor</option>';
            this.instructores.map((instructor: IUsuario) => {
                html += `<option value="${instructor.id}">${instructor.rol.nombre} ${instructor.dni} - ${instructor.ape_pat} ${instructor.ape_mat} ${instructor.nombre}</option>`
            });
            $('#select_instructor').html(html);
        });
    }

    filterLocalesSeleccionados() {
        this.localService.getbyAmbienteGeografico(this.filterFields.curso, {}).done((localesCurso: any) => {
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
        this.distribucionService.getZonasLibres(this.filterFields).done((ambitos) => {
            this.ambitosLibres = ambitos;
            let by: any;
            if (this.filterFields.ccdd == null) {
                by = {id: 'ccdd', text: ['departamento']}
            }
            else if (this.filterFields.ccdd != null && this.filterFields.ccpp == null) {
                by = {id: 'ccpp', text: ['provincia']}
            } else if (this.filterFields.ccpp != null && this.filterFields.ccdi == null) {
                by = {id: 'ccdi', text: ['distrito']}
            } else if (this.filterFields.ccpp != null && this.filterFields.ccdi != null) {
                by = {id: 'ZONA', text: ['zona']}
            }
            utils.setDropdown(this.ambitosLibres, by, {
                id_element: 'select_zonas_por_asignar',
                bootstrap_multiselect: false,
                select2: true
            }, true);
        });
    }

    asignarZonas() {
        let local_selected: any = $('#select_locales_seleccionados_asignacion').val();
        let ambitosAsignar: Array<string> = $('#select_zonas_por_asignar').val();
        let data: any;
        let request: Array<any> = [];
        ambitosAsignar.map((value: string) => {
            if (this.filterFields.ccdd == null) {
                data = {ccdd: value, ccpp: null, ccdi: null, zona: null, localcurso: local_selected}
            }
            else if (this.filterFields.ccdd != null && this.filterFields.ccpp == null) {
                data = {ccdd: this.filterFields.ccdd, ccpp: value, ccdi: '', zona: '', localcurso: local_selected}
            } else if (this.filterFields.ccpp != null && this.filterFields.ccdi == null) {
                data = {
                    ccdd: this.filterFields.ccdd,
                    ccpp: this.filterFields.ccpp,
                    ccdi: value,
                    zona: '',
                    localcurso: local_selected
                }
            } else if (this.filterFields.ccdi != null && this.filterFields.zona == null) {
                data = {
                    ccdd: this.filterFields.ccdd,
                    ccpp: this.filterFields.ccpp,
                    ccdi: this.filterFields.ccdi,
                    zona: value,
                    localcurso: local_selected
                }
            }
            request.push(data);
        });
        this.distribucionService.asignarZonas(request).done((response) => {
            this.getZonasDistrito();
            this.getLocalZonas(local_selected);
        });
    }

    getLocalZonas(localselected: any) {
        this.setLocalCurso(localselected);
        if (this.localCursoSelected) {
            this.distribucionService.filterLocalZona(this.localCursoSelected.id).done((localzonas: IUbigeo[]) => {
                utils.drawTable(localzonas, ['nombre_local', 'departamento', 'provincia', 'distrito', 'zona'], 'localambito_id', {
                    enumerar: true,
                    checkbox: '',
                    checked: false,
                    datatable: false,
                    edit_name: '',
                    delete_name: 'delete_localambito',
                    table_id: 'table_localzonas_detalle'
                });
                $('[name="delete_localambito"]').off()
                $('[name="delete_localambito"]').on('click', (element: JQueryEventObject) => {
                    utils.alert_confirm(() => {
                        let value: number = $(element.currentTarget).data('value');
                        this.distribucionService.deleteLocalAmbito(value).done(() => {
                            this.getZonasDistrito();
                            $('#select_locales_seleccionados_asignacion').trigger('change');
                        });
                    }, 'Esta seguro de eliminar este Ambiente del Local?', 'error');

                });
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
                html += `<tr title="Mostrar personal de aula" style="cursor: pointer; cursor: hand;" data-value="${value.id_localambiente}">
                            <td>${index + 1}</td>
                            <td>${value.id_ambiente.nombre_ambiente}</td>
                            <td>${value.numero}</td>
                            <td>${value.capacidad}</td>
                         </tr>`
            });
            $('#tabla_detalle_ambientes').find('tbody').html(html);
            $('#tabla_detalle_ambientes').find('tbody').find('tr').off();
            $('#tabla_detalle_ambientes').find('tbody').find('tr').on('click', (element: JQueryEventObject) => {
                let localambiente_id: number = $(element.currentTarget).data('value');
                this.localAmbientes.map((value: ILocalAmbienteDetail, index: number) => {
                    if (value.id_localambiente == localambiente_id) {
                        this.localAmbienteSelected = value;
                    }
                });
                $('#tabla_detalle_ambientes').find('tbody').find('tr').map((index: number, domElement: Element) => {
                    $(domElement).removeClass('bg-material-selected');
                });
                $(element.currentTarget).addClass('bg-material-selected');
                this.getPersonalbyAula(localambiente_id);
            })
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
                             <td>${value.dni}</td>
                             <td>${value.ape_paterno}</td>
                             <td>${value.ape_materno} </td>
                             <td>${value.nombre}</td>
                             <td>${value.id_cargofuncional.nombre_funcionario}</td>
                             <td>${value.zona}</td>
                         </tr>`
            });
            table_personal_capacitar.destroy();
            $('#tabla_pea_capacitar').find('tbody').html(html);
            table_personal_capacitar = $('#tabla_pea_capacitar').DataTable();
        })
    }

    getContingenciabyLocalCurso() {
        this.distribucionService.getPersonalbylocalCurso(this.localCursoSelected.id, true).done((personalContingencia) => {
            this.personalContingencia = personalContingencia;
            let html = '';
            let table_personal_capacitar = $('#tabla_personal_reserva').DataTable();
            this.personalContingencia.map((value: IPersonal, index: number) => {
                html += `<tr>
                             <td>${index + 1}</td>
                             <td>${value.dni}</td>
                             <td>${value.ape_paterno}</td>
                             <td>${value.ape_materno} </td>
                             <td>${value.nombre}</td>
                             <td>${value.id_cargofuncional.nombre_funcionario}</td>
                             <td>${value.zona}</td>
                         </tr>`
            });
            table_personal_capacitar.destroy();
            $('#tabla_personal_reserva').find('tbody').html(html);
            table_personal_capacitar = $('#tabla_personal_reserva').DataTable();
        });
    }

    distribuirPersonal() {
        let light_4 = $('#modal_personal_capacitar_no_distribuido');
        $(light_4).block({
            message: '<i class="icon-spinner4 spinner"></i><h5>Espere por favor, se esta realizando el proceso de distribución automática</h5>',
            overlayCSS: {
                backgroundColor: '#fff',
                opacity: 0.8,
                cursor: 'wait'
            },
            css: {
                border: 0,
                padding: 0,
                backgroundColor: 'none'
            }
        });
        this.distribucionService.distribuirPersonal(this.localCursoSelected.id).done((response) => {
            $(light_4).unblock();
            utils.showSwalAlert('El proceso de distribución fue exitoso!', 'Exito', 'success');
            $('#modal_personal_capacitar_no_distribuido').modal('hide');
        });
    }

    getPersonalbyAula(localambiente_id: number) {
        this.distribucionService.filterPersonalbyAula(localambiente_id).done((personalAula: IPersonalAula[]) => {
            this.personalAula = personalAula;
            this.setCabeceraDistribucion(localambiente_id);
            let html: string = '';
            this.personalAula.map((personal: IPersonalAula, index: number) => {
                html += `<tr>
                            <td>${index + 1}</td>
                            <td>${personal.id_pea.dni}</td>
                            <td>${personal.id_pea.ape_paterno}</td>
                            <td>${personal.id_pea.ape_materno}</td>
                            <td>${personal.id_pea.nombre}</td>
                            <td>${personal.id_pea.id_cargofuncional.nombre_funcionario}</td>
                            <td>${personal.id_pea.zona}</td>
                         </tr>`;
            });
            this.localAmbienteSelected.id_instructor == null ? $('#select_instructor').val('') : $('#select_instructor').val(this.localAmbienteSelected.id_instructor);
            $('#tabla_pea').find('tbody').html(html);
        });
    }

    setCabeceraDistribucion(localambiente: number) {
        $('#span_nombre_local').text(this.localCursoSelected.local.nombre_local);
        $('#span_direccion').text(this.localCursoSelected.local.referencia);
        $('#span_fecha_inicio').text(this.localCursoSelected.local.fecha_inicio);
        this.localAmbientes.map((value: ILocalAmbienteDetail, index: number) => {
            if (value.id_localambiente == localambiente) {
                $('#span_aula').text(`${index + 1}`)
            }
        });
    }

    saveInstructor() {
        let instructor_id: number = $('#select_instructor').val();
        this.localService.saveDetalleAmbiente(this.localAmbienteSelected.id_localambiente, {id_instructor: instructor_id}).done((response) => {
            utils.showSwalAlert('Se guardo el instructor!', 'Exito', 'exito');
            this.localAmbienteSelected.id_instructor = instructor_id;
        });
    }
}
new DistribucionView();