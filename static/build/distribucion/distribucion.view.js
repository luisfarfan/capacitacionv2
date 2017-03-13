define(["require", "exports", '../comun.utils', '../distribucion/distribucion.service', '../locales_consecucion/locales.service', '../ubigeo/ubigeo.service', '../core/utils'], function (require, exports, comun_utils_1, distribucion_service_1, locales_service_1, ubigeo_service_1, utils) {
    "use strict";
    var DistribucionView = (function () {
        function DistribucionView() {
            var _this = this;
            this.localService = new locales_service_1.LocalService();
            this.ubigeoService = new ubigeo_service_1["default"]();
            this.distribucionService = new distribucion_service_1.DistribucionService();
            this.filterFields = {
                ccdd: ubigeo.ccdd,
                ccpp: ubigeo.ccpp,
                ccdi: ubigeo.ccdi,
                zona: ubigeo.zona == '' ? null : ubigeo.zona,
                ubigeo: "" + ubigeo.ccdd + ubigeo.ccpp + ubigeo.ccdi,
                curso: null
            };
            this.zonas = [];
            this.localesCurso = [];
            this.localCursoSelected = null;
            this.localAmbientes = [];
            this.localZonas = [];
            this.locales = [];
            this.personal = [];
            this.curso = new comun_utils_1.Curso();
            $('#cursos').on('change', function () {
                _this.filterFields.curso = _this.curso.curso_selected.id_curso;
                _this.filterLocalesSeleccionados();
                _this.getZonasDistrito();
            });
            $('#btn_asignacion_zonas').on('click', function () {
                $('#modal_asignacion_zonas').modal('show');
            });
            $('#btn_asignar_zonas').on('click', function () {
                var local_selected = $('#select_locales_seleccionados_asignacion').val();
                var zonasAsignar = $('#select_zonas_por_asignar').val();
                if (local_selected == "-1" || zonasAsignar == null) {
                    utils.showInfo('Por favor seleccione el Local, y las Zonas a asignar a este Local');
                    return false;
                }
                else {
                    utils.alert_confirm(function () { return _this.asignarZonas(); }, 'Esta seguro de asignar las zonas seleccionadas al Local?');
                }
            });
            $('#select_locales_seleccionados_asignacion').on('change', function () {
                var local_selected = $('#select_locales_seleccionados_asignacion').val();
                _this.getLocalZonas(local_selected);
            });
            $('#select_locales_seleccionados').on('change', function () {
                var local_selected = $('#select_locales_seleccionados').val();
                _this.setLocalCurso(local_selected);
                _this.getLocalAmbientes();
            });
            $('#btn_pea_capacitar').on('click', function () {
                if (_this.localCursoSelected == null) {
                    utils.showInfo('Por favor, seleccione un Local');
                    return false;
                }
                _this.getPersonalbyLocalCurso();
                $('#modal_personal_capacitar_no_distribuido').modal('show');
            });
            $('#btn_distribuir').on('click', function () {
                _this.distribuirPersonal();
            });
        }
        DistribucionView.prototype.filterLocalesSeleccionados = function () {
            var _this = this;
            this.localService.getbyAmbienteGeografico(this.filterFields.curso, this.filterFields.ubigeo, this.filterFields.zona).done(function (localesCurso) {
                _this.localesCurso = localesCurso;
                _this.locales = [];
                _this.localesCurso.map(function (value, index) {
                    _this.locales.push(value.local);
                });
                utils.setDropdown(_this.locales, {
                    id: 'id_local',
                    text: ['nombre_local']
                }, { id_element: 'select_locales_seleccionados', bootstrap_multiselect: true, select2: false });
                utils.setDropdown(_this.locales, {
                    id: 'id_local',
                    text: ['nombre_local']
                }, { id_element: 'select_locales_seleccionados_asignacion', bootstrap_multiselect: true, select2: false });
            });
        };
        DistribucionView.prototype.getZonasDistrito = function () {
            var _this = this;
            this.distribucionService.getZonasLibres(this.filterFields.curso, this.filterFields.ubigeo).done(function (zonas) {
                _this.zonas = zonas;
                utils.setDropdown(_this.zonas, { id: 'ID', text: ['ZONA'] }, {
                    id_element: 'select_zonas_por_asignar',
                    bootstrap_multiselect: false,
                    select2: true
                });
            });
        };
        DistribucionView.prototype.asignarZonas = function () {
            var _this = this;
            var local_selected = $('#select_locales_seleccionados_asignacion').val();
            var zonasAsignar = $('#select_zonas_por_asignar').val();
            this.setLocalCurso(local_selected);
            this.distribucionService.asignarZonas({
                localcurso: this.localCursoSelected.id,
                zonas: zonasAsignar
            }).done(function (response) {
                _this.getZonasDistrito();
                _this.getLocalZonas(local_selected);
            });
        };
        DistribucionView.prototype.getLocalZonas = function (localselected) {
            var _this = this;
            this.setLocalCurso(localselected);
            if (this.localCursoSelected) {
                this.distribucionService.filterLocalZona(this.localCursoSelected.id).done(function (localzonas) {
                    _this.localZonas = localzonas;
                    var html = '';
                    _this.localZonas.map(function (value, index) {
                        html += "<tr>\n                            <td>" + (index + 1) + "</td>\n                            <td>" + _this.localCursoSelected.local.nombre_local + "</td>\n                            <td>" + value.zona.ZONA + "</td>\n                            <td>" + value.zona.ETIQ_ZONA + "</td>    \n                         </tr>";
                    });
                    $('#table_localzonas_detalle').find('tbody').html(html);
                });
            }
            else {
                $('#table_localzonas_detalle').find('tbody').html('');
            }
        };
        DistribucionView.prototype.setLocalCurso = function (local_selected) {
            var _this = this;
            this.localesCurso.map(function (value, index) {
                value.local.id_local == local_selected ? _this.localCursoSelected = value : '';
            });
            local_selected == "-1" ? this.localCursoSelected = null : '';
        };
        DistribucionView.prototype.getLocalAmbientes = function () {
            var _this = this;
            this.distribucionService.filterLocalAmbientes(this.localCursoSelected.id).done(function (localAmbientes) {
                _this.localAmbientes = localAmbientes;
                var html = '';
                _this.localAmbientes.map(function (value, index) {
                    html += "<tr data-value=\"" + value.id_localambiente + "\">\n                            <td>" + (index + 1) + "</td>\n                            <td>" + value.id_ambiente.nombre_ambiente + "</td>\n                            <td>" + value.numero + "</td>\n                            <td>" + value.capacidad + "</td>\n                            <td>" + 0 + "</td>\n                            <td>" + 0 + "</td>\n                         </tr>";
                });
                $('#tabla_detalle_ambientes').find('tbody').html(html);
            });
        };
        DistribucionView.prototype.getPersonalbyLocalCurso = function () {
            var _this = this;
            this.distribucionService.getPersonalbylocalCurso(this.localCursoSelected.id).done(function (personal) {
                _this.personal = personal;
                var html = '';
                var table_personal_capacitar = $('#tabla_pea_capacitar').DataTable();
                _this.personal.map(function (value, index) {
                    html += "<tr>\n                             <td>" + (index + 1) + "</td>\n                             <td>" + value.ape_paterno + "</td>\n                             <td>" + value.ape_materno + " </td>\n                             <td>" + value.nombre + "</td>\n                             <td>" + value.dni + "</td>\n                             <td>" + value.zona + "</td>\n                             <td>" + value.id_cargofuncional.nombre_funcionario + "</td>\n                         </tr>";
                });
                table_personal_capacitar.destroy();
                $('#tabla_pea_capacitar').find('tbody').html(html);
                table_personal_capacitar = $('#tabla_pea_capacitar').DataTable();
            });
        };
        DistribucionView.prototype.distribuirPersonal = function () {
            this.distribucionService.distribuirPersonal(this.localCursoSelected.id).done(function (response) {
                console.log(response);
            });
        };
        return DistribucionView;
    }());
    new DistribucionView();
});
//# sourceMappingURL=distribucion.view.js.map