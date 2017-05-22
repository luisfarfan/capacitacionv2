/**
 * Created by lfarfan on 19/02/2017.
 */

/**
 * Declarando la variable PNotify, plugin javascript para las alertas en modo popup.
 */
declare var PNotify: any;
/**
 * Declarando la variable swal, plugin javascript para las alertas en modo popup.
 */
declare var swal: any;
/**
 * Declarando la variable $ de jQuery para poder usarla sin problemas
 * cuando se quiere usar alguna funcion que no este en la interface del jQuery Typings de TypeScript
 */
declare var $: any;

/**
 * div alert de limitless para mostrar mensajes de estado (exito,error,info,warning)
 * @param message Mensaje del div.
 * @param type Tipo del div (error, success, info, danger, warning)
 * @returns      <Div> HTMLElement String.
 */
export function showDivAlert(message: string, type: string): string {
    return `<div class="alert bg-${type} alert-styled-left">
                <button type="button" class="close" data-dismiss="alert"><span>×</span><span class="sr-only">Close</span></button>
                <span class="text-semibold">${message}</span>
            </div>`;
}

/**
 * Popup alert notify para mostrar mensajes de estado (exito,error,info,warning)
 * @param message Mensaje del div.
 * @param type Tipo del div (error, success, info, danger, warning)
 * @returns      <Div> HTMLElement String.
 */
export function showSwalAlert(message: string, title: string, type: string) {
    new PNotify({
        title: title,
        text: message,
        type: type
    });
}
export function alert_confirm(callback: any, title = 'Está seguro de Guardar?', type = 'success', callback2: any = null) {
    swal({
        title: title,
        text: '',
        type: type,
        showCancelButton: true,
        confirmButtonColor: "#EF5350",
        confirmButtonText: "Si!",
        cancelButtonText: "No!",
        closeOnConfirm: true,
        closeOnCancel: true,
        showLoaderOnConfirm: true
    }, (confirm: any) => {
        if (confirm) {
            callback()
        } else {
            callback2 != null ? callback2 : '';
        }
    });
}
/**
 * sample structure
 * [
 *  {title: "node1"},{title: "node2"},{title:"node3", folder:true,key:"__node3"},
 *      children: [
 *          {title: "sub_node1",
     *              children: [
     *                  {title: "sub_node2"},{title: "sub_node3"},{title: "sub_node4"}]}]]
 *
 *
 **/
export function jsonFormatFancyTree(menu_json: any, rol_id_array: Array<number> = []) {
    let treejson: Array<any> = [];
    let interface_node: any = {};
    menu_json.map((value: any, key: any) => {
        interface_node = {};
        interface_node['title'] = value.descripcion;
        interface_node['key'] = value.id;
        interface_node['icon'] = value.icon;
        if (value.modulos_hijos.length) {
            interface_node['children'] = [];
            let children: Array<any> = [];
            value.modulos_hijos.map((node_value: any, node_order: any) => {
                children.push({
                    'title': node_value.descripcion,
                    'key': node_value.id,
                    'children': node_value.modulos_hijos.length == 0 ? [] : jsonFormatFancyTree(node_value.modulos_hijos, rol_id_array),
                    'selected': rol_id_array.indexOf(node_value.id) != -1 ? true : false,
                    'preselected': rol_id_array.indexOf(node_value.id) != -1 ? true : false,
                    'icon': node_value.icon,
                });
            });
            interface_node['children'] = children;
            treejson.push(interface_node);
        } else {
            interface_node['children'] = [];
            interface_node['selected'] = rol_id_array.indexOf(value.id) != -1 ? true : false;
            interface_node['preselected'] = rol_id_array.indexOf(value.id) != -1 ? true : false;
            treejson.push(interface_node);
        }
    });
    return treejson;
}

interface MenuTree {
    id: number,
    descripcion: string,
    icon: string,
    modulos_hijos: MenuTree[],
}
export function jsonFormatFancyTreeSelecteds(menu_json: MenuTree[], rol_id_array: Array<number> = []) {
    let treejson: Array<any> = [];
    let interface_node: any = {};
    menu_json.map((value: MenuTree, key: any) => {
        if (findChilds(value, rol_id_array)) {
            interface_node = {};
            interface_node['title'] = value.descripcion;
            interface_node['key'] = value.id;
            interface_node['icon'] = value.icon;
            interface_node['children'] = [];
            let children: Array<any> = [];
            value.modulos_hijos.map((node_value: MenuTree, node_order: any) => {
                if (findChilds(node_value, rol_id_array)) {
                    children.push({
                        'title': node_value.descripcion,
                        'key': node_value.id,
                        'children': node_value.modulos_hijos.length == 0 ? [] : jsonFormatFancyTreeSelecteds(node_value.modulos_hijos, rol_id_array),
                        'selected': false,
                        'preselected': false,
                        'icon': node_value.icon,
                    });
                }
            });
            interface_node['children'] = children;
            treejson.push(interface_node);
        }
    });
    return treejson;
}

function findChilds(menu: MenuTree, rol_id_array: Array<number>): boolean {
    let has_child: boolean = false;
    let count: number = 0;
    if (rol_id_array.indexOf(menu.id) != -1) {
        count++;
    } else {
        if (menu.modulos_hijos.length) {
            menu.modulos_hijos.map((value: MenuTree, key: number) => {
                if (rol_id_array.indexOf(value.id) != -1) {
                    count++;
                } else {
                    findChilds(value, rol_id_array);
                }
            });
        }
    }

    return has_child = count > 0;
}

export function validateForm(rules: Object) {
    let setOptions = {
        rules: {},
        errorPlacement: function (error: any, element: any) {
            return true;
        }
    };
    setOptions.rules = rules
    return setOptions;
}

export function serializeForm(id_form: string) {
    let objectForm: Array<Object> = $(`#${id_form}`).serializeArray();
    let checkboxes = $('input:checkbox');
    if (checkboxes.length) {
        checkboxes.map((value: any, key: any) => {
            objectForm.push({value: $(key).is(':checked') ? 1 : 0, name: key.name})
        });
    }

    return objectForm;
}
interface optionsTable {
    edit_name: string,
    delete_name: string,
    enumerar: boolean,
    table_id: string,
    datatable: boolean,
    checkbox: string,
    checked: boolean,
}
export function drawTable(data: Array<Object>, campos: Array<string>, pk: string = null, options: optionsTable = null) {
    let html: string = '';
    data.map((value: any, key: number) => {
        html += `<tr>`;

        html += options.enumerar ? `<td>${key + 1}</td>` : '';
        campos.map((val: any, pos: any) => {
            html += `<td>${value[val] == null ? '-' : value[val]}</td>`;
        })
        if (options !== null) {
            html += `<td><ul class="icons-list">
                            ${options.edit_name !== '' ? `<li data-popup="tooltip" title="Editar" name="${options.edit_name}" data-value=${value[pk]} style="color: #8bc34a"><a><i class="icon-pencil"></i></a></li>` : ''}
                            ${options.delete_name !== '' ? `<li style="margin-left: 20px;" data-popup="tooltip" title="Eliminar" name="${options.delete_name}" data-value=${value[pk]} class="text-danger-600"><a><i class="icon-trash"></i></a></li>` : ''}
						                                 </ul></td>`;
            if (options.checkbox !== '') {
                html += `<td>${options.checkbox !== '' ? `<button name="${options.checkbox}" data-value="${value[pk]}" type="button" class="btn bg-primary btn-raised active legitRipple btn-xs">
                                                               Seleccionar</button>` : ''}</td>`
            }
        }
        html += `</tr>`;
    });

    if (options.datatable) {
        let table = $(`#${options.table_id}`).DataTable();
        if ($.fn.DataTable.isDataTable(`#${options.table_id}`)) {
            table.destroy();
            $(`#${options.table_id}`).find('tbody').html(html);
            table = $(`#${options.table_id}`).DataTable({
                bPaginate: false
            });
            $('.dataTables_length select').select2({
                minimumResultsForSearch: Infinity,
                width: 'auto',
            });
        }
    } else {
        $(`#${options.table_id}`).find('tbody').html(html);
    }
}
export function drawDataTable(table_id: string, html: string, datatable: boolean = true) {
    if (datatable) {
        let table = $(`#${table_id}`).DataTable();
        if ($.fn.DataTable.isDataTable(`#${table_id}`)) {
            table.destroy();
            $(`#${table_id}`).find('tbody').html(html);
            table = $(`#${table_id}`).DataTable({
                bPaginate: false
            });
            $('.dataTables_length select').select2({
                minimumResultsForSearch: Infinity,
                width: 'auto',
            });
        }
    }
    else {
        $(`#${table_id}`).find('tbody').html(html);
    }
}

export interface CamposSelect {
    id: string,
    text: String[],
}
interface ExtraOptionsDrowdown {
    id_element: string,
    bootstrap_multiselect: boolean,
    select2: boolean,
}
export function setDropdown(data: Array<Object>, campos: CamposSelect, extra: ExtraOptionsDrowdown, bgColor: boolean = false, first: string = 'Seleccione') {
    let html = `<option value="-1">${first}</option>`;
    data.map((value: any, key: number) => {
        let value_concated: string = '';
        campos.text.map((v: string, k: number) => {
            value_concated += `${value[v]} `
        });
        html += `<option value="${value[campos.id]}">${value_concated}</option>`
    });
    $(`#${extra.id_element}`).html(html);
    let bgcolor = {}
    bgColor ? bgcolor = {
        dropdownCssClass: 'border-primary',
        containerCssClass: 'border-primary text-primary-700'
    } : ''
    extra.select2 ? $(`#${extra.id_element}`).select2(bgcolor) : '';
}

export function formToObject(form: Array<Object>) {
    let formObject: any = {};
    form.map((value: any, key: any) => {
        formObject[value.name] = value.value;
    });
    return formObject;
}

export function objectToForm(data: any) {
    for (let key in data) {
        if ($(`[name="${key}"]`).is('select')) {
            $(`[name="${key}"]`).val(data[key]).trigger('change');
        } else {
            $(`[name="${key}"]`).val(data[key]);
        }

    }
}
export function showInfo(message: String) {
    swal(message);
}
export function upgradeTooltip() {
    $('[data-popup="tooltip"]').off();
    $('[data-popup="tooltip"]').tooltip();
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    });
}

export function isDataTable(id: string) {
    return $.fn.DataTable.fnIsDataTable(id);
}
interface IExportarParams {
    buttonName: string,
    contenedor: string,
    fileName: string,
    table: string,
    columnsDelete: Array<number>,
}
export function exportarTable(exportarParams: IExportarParams, caption: string = '', temp: boolean = false) {
    $(`#${exportarParams.contenedor}`).html($(`#${exportarParams.table}`).html());
    if (caption != '') {
        $(`#${exportarParams.contenedor}`).find('caption').html($(`#${caption}`).find('caption').html());
        $(`#${exportarParams.contenedor}`).find('caption').find('[name="p_altas_bajas"]').text('RELACIÓN DE BAJAS Y ALTAS')
        $(`#${exportarParams.contenedor}`).find('caption').find('[id="select_instructor"]').parent().remove()
        $(`#${exportarParams.contenedor}`).find('caption').find('[name="titulo"]').text('RELACIÓN DE PERSONAL DE RESERVA')
    }
    exportarParams.columnsDelete.map((columns: number) => {
        $(`#${exportarParams.contenedor} table tr`).find(`th:eq(${columns})`).remove();

        let buttons$ = $(`#${exportarParams.contenedor} table tr`).find('td').find('a')
        buttons$.map((index: number, domElement: Element) => {
            $(domElement).parent().parent().parent().remove();
        })
    });
    $(`#${exportarParams.contenedor}`).find('table').attr('id', '_tabla_exportar')
    let td = $(`#${exportarParams.contenedor}`).find('table').find('td')
    let theadtr = $(`#${exportarParams.contenedor}`).find('table').find('thead').find('th')
    td.map((index: number, domElement: Element) => {
        $(domElement).css('border', '1px solid #0065a9');
    });
    theadtr.map((index: number, domElement: Element) => {
        $(domElement).css('background-color', '#03A9F4');
        $(domElement).css('border-color', '#03A9F4');
        $(domElement).css('color', '#fff');
    });
    var uri = $(`#${exportarParams.contenedor}`).battatech_excelexport({
        containerid: `${exportarParams.contenedor}`,
        datatype: 'table',
        returnUri: true
    });
    $(`#${exportarParams.buttonName}`).attr('download', `${exportarParams.fileName}`).attr('href', uri).attr('target', '_blank');

}

export function insertParam(key: string, value: any) {
    key = encodeURI(key);
    value = encodeURI(value);

    var kvp = document.location.search.substr(1).split('&');

    var i = kvp.length;
    var x: any;
    while (i--) {
        x = kvp[i].split('=');

        if (x[0] == key) {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }

    if (i < 0) {
        kvp[kvp.length] = [key, value].join('=');
    }

    //this will reload the page, it's likely better to store this until finished
    document.location.search = kvp.join('&');
}