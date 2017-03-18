/**
 * Created by lfarfan on 19/02/2017.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * div alert de limitless para mostrar mensajes de estado (exito,error,info,warning)
     * @param message Mensaje del div.
     * @param type Tipo del div (error, success, info, danger, warning)
     * @returns      <Div> HTMLElement String.
     */
    function showDivAlert(message, type) {
        return "<div class=\"alert bg-" + type + " alert-styled-left\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span>\u00D7</span><span class=\"sr-only\">Close</span></button>\n                <span class=\"text-semibold\">" + message + "</span>\n            </div>";
    }
    exports.showDivAlert = showDivAlert;
    /**
     * Popup alert notify para mostrar mensajes de estado (exito,error,info,warning)
     * @param message Mensaje del div.
     * @param type Tipo del div (error, success, info, danger, warning)
     * @returns      <Div> HTMLElement String.
     */
    function showSwalAlert(message, title, type) {
        new PNotify({
            title: title,
            text: message,
            type: type
        });
    }
    exports.showSwalAlert = showSwalAlert;
    function alert_confirm(callback, title, type, callback2) {
        if (title === void 0) { title = 'Está seguro de Guardar?'; }
        if (type === void 0) { type = 'success'; }
        if (callback2 === void 0) { callback2 = null; }
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
        }, function (confirm) {
            if (confirm) {
                callback();
            }
            else {
                callback2 != null ? callback2 : '';
            }
        });
    }
    exports.alert_confirm = alert_confirm;
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
    function jsonFormatFancyTree(menu_json, rol_id_array) {
        if (rol_id_array === void 0) { rol_id_array = []; }
        var treejson = [];
        var interface_node = {};
        menu_json.map(function (value, key) {
            interface_node = {};
            interface_node['title'] = value.descripcion;
            interface_node['key'] = value.id;
            interface_node['icon'] = value.icon;
            if (value.modulos_hijos.length) {
                interface_node['children'] = [];
                var children_1 = [];
                value.modulos_hijos.map(function (node_value, node_order) {
                    children_1.push({
                        'title': node_value.descripcion,
                        'key': node_value.id,
                        'children': node_value.modulos_hijos.length == 0 ? [] : jsonFormatFancyTree(node_value.modulos_hijos, rol_id_array),
                        'selected': rol_id_array.indexOf(node_value.id) != -1 ? true : false,
                        'preselected': rol_id_array.indexOf(node_value.id) != -1 ? true : false,
                        'icon': node_value.icon
                    });
                });
                interface_node['children'] = children_1;
                treejson.push(interface_node);
            }
            else {
                interface_node['children'] = [];
                interface_node['selected'] = rol_id_array.indexOf(value.id) != -1 ? true : false;
                interface_node['preselected'] = rol_id_array.indexOf(value.id) != -1 ? true : false;
                treejson.push(interface_node);
            }
        });
        return treejson;
    }
    exports.jsonFormatFancyTree = jsonFormatFancyTree;
    function jsonFormatFancyTreeSelecteds(menu_json, rol_id_array) {
        if (rol_id_array === void 0) { rol_id_array = []; }
        var treejson = [];
        var interface_node = {};
        menu_json.map(function (value, key) {
            if (findChilds(value, rol_id_array)) {
                interface_node = {};
                interface_node['title'] = value.descripcion;
                interface_node['key'] = value.id;
                interface_node['icon'] = value.icon;
                interface_node['children'] = [];
                var children_2 = [];
                value.modulos_hijos.map(function (node_value, node_order) {
                    if (findChilds(node_value, rol_id_array)) {
                        children_2.push({
                            'title': node_value.descripcion,
                            'key': node_value.id,
                            'children': node_value.modulos_hijos.length == 0 ? [] : jsonFormatFancyTreeSelecteds(node_value.modulos_hijos, rol_id_array),
                            'selected': false,
                            'preselected': false,
                            'icon': node_value.icon
                        });
                    }
                });
                interface_node['children'] = children_2;
                treejson.push(interface_node);
            }
        });
        return treejson;
    }
    exports.jsonFormatFancyTreeSelecteds = jsonFormatFancyTreeSelecteds;
    function findChilds(menu, rol_id_array) {
        var has_child = false;
        var count = 0;
        if (rol_id_array.indexOf(menu.id) != -1) {
            count++;
        }
        else {
            if (menu.modulos_hijos.length) {
                menu.modulos_hijos.map(function (value, key) {
                    if (rol_id_array.indexOf(value.id) != -1) {
                        count++;
                    }
                    else {
                        findChilds(value, rol_id_array);
                    }
                });
            }
        }
        return has_child = count > 0;
    }
    function validateForm(rules) {
        var setOptions = {
            rules: {},
            errorPlacement: function (error, element) {
                return true;
            }
        };
        setOptions.rules = rules;
        return setOptions;
    }
    exports.validateForm = validateForm;
    function serializeForm(id_form) {
        var objectForm = $("#" + id_form).serializeArray();
        var checkboxes = $('input:checkbox');
        if (checkboxes.length) {
            checkboxes.map(function (value, key) {
                objectForm.push({ value: $(key).is(':checked') ? 1 : 0, name: key.name });
            });
        }
        return objectForm;
    }
    exports.serializeForm = serializeForm;
    function drawTable(data, campos, pk, options) {
        if (pk === void 0) { pk = null; }
        if (options === void 0) { options = null; }
        var html = '';
        data.map(function (value, key) {
            html += "<tr>";
            html += options.enumerar ? "<td>" + (key + 1) + "</td>" : '';
            campos.map(function (val, pos) {
                html += "<td>" + (value[val] == null ? '-' : value[val]) + "</td>";
            });
            if (options !== null) {
                html += "<td><ul class=\"icons-list\">\n                            " + (options.edit_name !== '' ? "<li data-popup=\"tooltip\" title=\"Editar\" name=\"" + options.edit_name + "\" data-value=" + value[pk] + " style=\"color: #8bc34a\"><a><i class=\"icon-pencil\"></i></a></li>" : '') + "\n                            " + (options.delete_name !== '' ? "<li style=\"margin-left: 20px;\" data-popup=\"tooltip\" title=\"Eliminar\" name=\"" + options.delete_name + "\" data-value=" + value[pk] + " class=\"text-danger-600\"><a><i class=\"icon-trash\"></i></a></li>" : '') + "\n                            " + (options.checkbox !== '' ? "<li data-popup=\"tooltip\" title=\"Seleccionar Local\" style=\"margin-left: 20px;\"><div class=\"pure-checkbox\">\n                                                            <input id=\"" + options.checkbox + value[pk] + "\" name=\"" + options.checkbox + "\" value=\"" + value[pk] + "\" type=\"checkbox\">\n                                                            <label class=\"checkbox-inline\" for=\"" + options.checkbox + value[pk] + "\"></label>\n                                                         </div></li>" : '') + "\n\t\t\t\t\t\t  </ul></td>";
            }
            html += "</tr>";
        });
        if (options.datatable) {
            var table = $("#" + options.table_id).DataTable();
            if ($.fn.DataTable.isDataTable("#" + options.table_id)) {
                table.destroy();
                $("#" + options.table_id).find('tbody').html(html);
                table = $("#" + options.table_id).DataTable({
                    bPaginate: false
                });
                $('.dataTables_length select').select2({
                    minimumResultsForSearch: Infinity,
                    width: 'auto'
                });
            }
        }
        else {
            $("#" + options.table_id).find('tbody').html(html);
        }
    }
    exports.drawTable = drawTable;
    function setDropdown(data, campos, extra, bgColor) {
        if (bgColor === void 0) { bgColor = false; }
        var html = "<option value=\"-1\">Seleccione</option>";
        data.map(function (value, key) {
            var value_concated = '';
            campos.text.map(function (v, k) {
                value_concated += value[v] + " ";
            });
            html += "<option value=\"" + value[campos.id] + "\">" + value_concated + "</option>";
        });
        $("#" + extra.id_element).html(html);
        var bgcolor = {};
        bgColor ? bgcolor = {
            dropdownCssClass: 'border-primary',
            containerCssClass: 'border-primary text-primary-700'
        } : '';
        extra.select2 ? $("#" + extra.id_element).select2(bgcolor) : '';
    }
    exports.setDropdown = setDropdown;
    function formToObject(form) {
        var formObject = {};
        form.map(function (value, key) {
            formObject[value.name] = value.value;
        });
        return formObject;
    }
    exports.formToObject = formToObject;
    function objectToForm(data) {
        for (var key in data) {
            if ($("[name=\"" + key + "\"]").is('select')) {
                $("[name=\"" + key + "\"]").val(data[key]).trigger('change');
            }
            else {
                $("[name=\"" + key + "\"]").val(data[key]);
            }
        }
    }
    exports.objectToForm = objectToForm;
    function showInfo(message) {
        swal(message);
    }
    exports.showInfo = showInfo;
    function upgradeTooltip() {
        $('[data-popup="tooltip"]').off();
        $('[data-popup="tooltip"]').tooltip();
        $('[data-toggle="tooltip"]').tooltip({
            trigger: 'hover'
        });
    }
    exports.upgradeTooltip = upgradeTooltip;
});
//# sourceMappingURL=utils.js.map