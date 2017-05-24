/**
 * Created by Administrador on 23/05/2017.
 */
import {ControlCalidadService} from '../controlcalidad/controlcalidad.service';
import {IAnalista, ILocal} from '../controlcalidad/controlcalidad.interfaces';
import {CursoInyection} from '../comun.utils'
import * as utils from '../core/utils';
declare var $: any;
class ControlCalidadView extends CursoInyection {
    private controlcalidadService: ControlCalidadService = new ControlCalidadService();
    private analistas: IAnalista[] = [];
    private locales: ILocal[] = null;
    private localSelected: ILocal = null;

    constructor() {
        super();
        $('#cursos').on('change', () => {
            this.getLocales();
        });

        $('#div_tabla_locales_filter').on('click', '[name="a_save_instructor"]', (element: JQueryEventObject) => {
            let id = $(element.currentTarget).data('value');
            let selectValue = $(element.currentTarget).parent().find('select').val();
            this.setLocalSelected(id);
            utils.alert_confirm(() => {
                this.setAnalistaLocal(selectValue);
            }, 'Esta seguro de guardar este instructor?');
        });
        $('#div_tabla_locales_filter').on('click', '[name="btn_seleccionar"]', (element: JQueryEventObject) => {
            let id = $(element.currentTarget).data('value');
            this.setLocalSelected(id);
            utils.alert_confirm(() => {
                this.seleccionarLocal()
            }, 'Esta seguro de seleccionar este Local?');
        });
        $('#div_tabla_locales_filter').on('click', '[name="btn_deseleccionar"]', (element: JQueryEventObject) => {
            let id = $(element.currentTarget).data('value');
            this.setLocalSelected(id);
            utils.alert_confirm(() => {
                this.deseleccionarLocal()
            }, 'Esta seguro de deseleccionar este Local?', 'error');
        });
    }

    // getAnalistas() {
    //     this.controlcalidadService.getAnalistas().done((analistas) => {
    //         this.analistas = analistas;
    //     });
    // }

    getLocales() {
        if (this.curso_selected) {
            this.controlcalidadService.getLocalesCurso(this.curso_selected.id_curso).done((locales) => {
                this.controlcalidadService.getAnalistas().done((analistas) => {
                    this.analistas = analistas;
                    this.locales = locales;
                    this.drawLocales();
                });
            })
        } else {
            this.locales = null
            this.drawLocales();
        }
    }

    drawLocales() {
        let html = '';
        if (this.locales) {
            this.locales.map((value: ILocal, index: number) => {
                html += `<tr>
                            <td>${index + 1}</td>
                            <td>${value.nombre_local}</td>
                            <td>${value.zona_ubicacion_local}</td>
                            <td>${value.nombre_via}</td>
                            <td>${value.referencia}</td>
                            <td>${value.total_aulas}</td>
                            <td>${this.drawDropdownAnalistas(value.instructor, value.id_local, value.seleccionar)}</td>
                            <td>
                                <ul class="icons-list">
                                <li data-popup="tooltip" title="Editar" name="" style="color: #8bc34a" data-toggle="modal" data-target="#modal_backdrop">
                                    <a><i class="icon-pencil"></i></a>
                                </li>
                                </ul>
                            </td>
                            <td>${this.drawBtnSeleccion(value.id_local, value.seleccionar)}</td>
                            </tr>`
            })
        }
        $('#tabla_locales').find('tbody').html(html);
    }

    drawDropdownAnalistas(instructor: number = null, id_local: number, seleccionado: number) {
        let disabled = seleccionado == 1 ? '' : 'disabled class="disabled"';
        let selectHTML = `<select ${disabled} style="-webkit-appearance: menulist-button;width: 80%;height: 30px"
                                    name="select_instructor">`;
        selectHTML += `<option value="">Seleccione</option>`
        this.analistas.map((value: IAnalista, index: number) => {
            selectHTML += `<option ${value.id == instructor ? 'selected' : ''} value="${value.id}">${value.nombre} ${value.ape_pat} ${value.ape_mat}</option>`
        });
        selectHTML += `</select><a name="a_save_instructor" data-value="${id_local}" data-popup="tooltip" title="" data-original-title="Guardar Instructor en esta aula">
                                            <i class="icon-floppy-disk" style="font-size: 24px"></i></a>`;
        return selectHTML;
    }

    drawBtnSeleccion(id_local: number, seleccionado: number = 0) {
        let buttonHTML = '';
        if (seleccionado) {
            buttonHTML = `<button data-value="${id_local}" name="btn_deseleccionar" type="button" class="btn btn-success active legitRipple">Seleccionado</button>`
        } else {
            buttonHTML = `<button data-value="${id_local}" name="btn_seleccionar" type="button" class="btn btn-primary active legitRipple">Seleccionar</button>`
        }
        return buttonHTML;
    }

    setLocalSelected(id: number) {
        this.locales.filter((local: ILocal) => local.id_local == id ? this.localSelected = local : '');
    }

    seleccionarLocal() {
        this.controlcalidadService.add_userLocal({local: this.localSelected.id_local, usuario: null}).done((local) => {
            this.getLocales();
        });
    }

    deseleccionarLocal() {
        this.controlcalidadService.delete_userLocal(this.localSelected.localusuario).done(() => {
            this.getLocales();
        });
    }

    setAnalistaLocal(idusuario: number) {
        this.controlcalidadService.put_userLocal(this.localSelected.localusuario, {
            local: this.localSelected.id_local,
            usuario: idusuario
        }).done(() => {
            this.getLocales();
        })
    }
}

new ControlCalidadView();