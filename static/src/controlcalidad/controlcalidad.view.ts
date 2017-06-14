/**
 * Created by Administrador on 23/05/2017.
 */
import {ControlCalidadService} from '../controlcalidad/controlcalidad.service';
import {IAnalista, ILocal, IAula, IInstructor, IInstAulas} from '../controlcalidad/controlcalidad.interfaces';
import {CursoInyection} from '../comun.utils'
import * as utils from '../core/utils';
declare var $: any;
class ControlCalidadView extends CursoInyection {
    private controlcalidadService: ControlCalidadService = new ControlCalidadService();
    private analistas: IAnalista[] = [];
    private locales: ILocal[] = null;
    private aulas: IAula[] = null;
    private instructor: IInstructor[] = null;
    private instrAula: IInstAulas[] = null;
    private localSelected: ILocal = null;
    private analista: "" = null;
    private localMaster: number = null;
    private instructorMaster: number = null;

    constructor() {
        super();

        console.log(this.getLocales())
        $('#cursos').on('change', () => {
            this.getLocales();
        });


        $('#div_tabla_locales_filter').on('click', '[name="a_save_instructor"]', (element: JQueryEventObject) => {
            let id = $(element.currentTarget).data('value');
            let selectValue = $(element.currentTarget).parent().find('select').val();
            let aux = 0;
            this.setLocalSelected(id);
            utils.alert_confirm(() => {
                this.setAnalistaLocal(selectValue, 0);
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
        $('#div_tabla_locales_filter').on('click', '[name="btn_modal"]', (element: JQueryEventObject) => {
            let id = $(element.currentTarget).data('value');
            this.setLocalSelected(id);
            this.localMaster = id
            this.getAulas()
        })
        $('#div_tabla_aulas_filter').on('click', '[name="a_save_instructor"]', (element: JQueryEventObject) => {
            let id = $(element.currentTarget).data('value');
            let selectValue = $(element.currentTarget).parent().find('select').val();
            let aux = 0;
            this.setLocalSelected(selectValue);
            this.analista = selectValue;

            utils.alert_confirm(() => {
                this.setAnalistaLocal(id, 1);
            }, 'Esta seguro de guardar este instructor?');
        })
    }

    getAulas() {
        this.controlcalidadService.getAulas(this.localMaster).done((aulas) => {
                this.aulas = aulas;
                this.drawAulas();
        })
    }

    getLocales() {
        if (this.curso_selected) {
            this.controlcalidadService.getLocalesCurso(this.curso_selected.id_curso).done((locales) => {
                this.controlcalidadService.getAnalistas().done((analistas) => {
                    this.analistas = analistas;
                    this.locales = locales;
                    this.drawLocales();
                    this.drawLocalesSeleccionador()
                });
            })
        } else {
            this.locales = null
            this.drawLocales();
        }
    }

    drawAulas() {
        let html = '';
        if (this.locales) {
            this.aulas.map((value: IAula, index: number) => {

                this.controlcalidadService.set_userAula(value.id_localambiente).done((data) => {
                    console.log(data.id_instructor)
                    html += `<tr>
                                <td>${index}</td>
                                <td>${value.id_localambiente}</td>
                                <td>${this.drawDropdownAnalistasAula(data.id_instructor, value.id_localambiente, 1)}</td>
                            </tr>`
                    $('#tabla_aulas_filter').find('tbody').html(html);
                })
            })
        }


    }

    obteneranalista(id_ambiente: number) {
        this.controlcalidadService.set_userAula(id_ambiente).done((data) => {
        })

    }

    drawDropdownAnalistasAula(instructor: number = null, id_local: number, seleccionado: number) {
        let disabled = seleccionado == 1 ? '' : 'disabled class="disabled"';
        let selectHTML = `<select ${disabled} style="-webkit-appearance: menulist-button;width: 80%;height: 30px"
                                    name="select_instructor">`;
        let iconoGuardar = seleccionado == 1 ? 'icon-floppy-disk' : '';
        selectHTML += `<option value="">Seleccione</option>`
        this.analistas.map((value: IAnalista, index: number) => {
            selectHTML += `<option ${value.id == instructor ? 'selected' : ''} value="${value.id}">${value.nombre} ${value.ape_pat} ${value.ape_mat}</option>`
        });
        selectHTML += `</select><a name="a_save_instructor" data-value="${id_local}" data-popup="tooltip" title="" data-original-title="Guardar Instructor en esta aula">
                                            <i class="${iconoGuardar}" style="font-size: 24px"></i></a>`;
        return selectHTML;
    }

    drawRespuestas(tipoRespuesta: String) {
        let reespuestaHTML = ''
        if (tipoRespuesta == '1') reespuestaHTML = `<td>Cantidad</td>`
        if (tipoRespuesta == '2') reespuestaHTML = `<td>SI</td><td>NO</td><td>SE CORRIGIO</td>`
        return reespuestaHTML
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
                            ${this.drawDropdownAnalistas(value.instructor, value.id_local, value.seleccionar)}
                            ${this.drawEditarAula(value.id_directoriolocal_id, value.seleccionar)}
                            <td>${this.drawBtnSeleccion(value.id_local, value.seleccionar)}</td>
                           </tr>`
            });
        }
        $('#tabla_locales').find('tbody').html(html);
    }

    drawLocalesSeleccionador() {
        let html = '';
        if (this.locales) {
            this.locales.map((value: ILocal, index: number) => {
                html += `<tr>
                            <td>${value.nombre_local}</td>
                            <td>${value.zona_ubicacion_local}</td>
                            <td>${value.nombre_via}</td>
                            <td>${value.referencia}</td>
                            <td>${value.total_aulas}</td>
                            <td>${this.drawObtenerAnalista(value.instructor)}</td>
                            <td></td>
                            <td>
                                <button data-value="${value.id_local}" name="btn_Evaluar" type="button" 
                                class="btn btn-primary active legitRipple">Evaluar</button>
                            </td>
                            <td>
                                <button data-value="${value.id_local}" name="btn_Evaluar" type="button" 
                                class="btn btn-primary active legitRipple">Evaluar</button>
                            </td>
                           </tr>`
            });
        }
        $('#tablaAnalista').find('tbody').html(html);
    }

    drawObtenerAnalista(analista: number) {
        let analistaHTML = ``;
        this.analistas.map((value: IAnalista, index: number) => {
            if (value.id == analista) {
                analistaHTML = `${value.nombre}`
            }

        })
        return analistaHTML;
    }

    drawEditarAula(id_local: number, seleccionado: number) {
        let iconoEditar = seleccionado == 1 ? 'icon-pencil' : '';
        let html = `<td>
                      <ul class="icons-list">
                         <li data-value="${id_local}" data-popup="tooltip" title="Editar" name="btn_modal" style="color: #8bc34a" data-toggle="modal" data-target="#modal_backdrop">
                             <a><i class="${iconoEditar}"></i></a>
                         </li>
                      </ul>
                    </td>`
        return html
    }

    drawDropdownAnalistas(instructor: number = null, id_local: number, seleccionado: number) {
        let disabled = seleccionado == 1 ? '' : 'disabled class="disabled"';
        let selectHTML = `<td><select ${disabled} style="-webkit-appearance: menulist-button;width: 80%;height: 30px"
                                    name="select_instructor">`;
        let iconoGuardar = seleccionado == 1 ? 'icon-floppy-disk' : '';
        selectHTML += `<option value="">Seleccione</option>`

        this.analistas.map((value: IAnalista, index: number) => {
            selectHTML += `<option ${value.id == instructor ? 'selected' : ''} value="${value.id}">${value.nombre} ${value.ape_pat} ${value.ape_mat}</option>`
        });
        selectHTML += `</select><a name="a_save_instructor" data-value="${id_local}" data-popup="tooltip" title="" data-original-title="Guardar Instructor en esta aula">
                                            <i class="${iconoGuardar}" style="font-size: 24px"></i></a></td>`;
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

    setAnalistaLocal(idusuario: number, aux: number) {
        if (aux == 0) {
            this.controlcalidadService.put_userLocal(this.localSelected.localusuario, {
                local: this.localSelected.id_local,
                usuario: idusuario
            }).done(() => {
                this.getLocales();
            })
        }
        if (aux == 1) {
            this.controlcalidadService.put_userAula(idusuario, {
                id_localambiente: idusuario,
                id_instructor: this.analista,
                id_ambiente: "1"
            }).done(() => {
                this.getAulas();
            })
        }
    }
}

new ControlCalidadView();