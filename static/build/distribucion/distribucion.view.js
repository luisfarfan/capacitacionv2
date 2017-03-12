define(["require", "exports", "../comun.utils", "../distribucion/distribucion.service", "../locales_consecucion/locales.service", "../ubigeo/ubigeo.service", "../core/utils"], function (require, exports, comun_utils_1, distribucion_service_1, locales_service_1, ubigeo_service_1, utils) {
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
            this.locales = [];
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
        }
        DistribucionView.prototype.filterLocalesSeleccionados = function () {
            var _this = this;
            this.localService.getbyAmbienteGeografico(this.filterFields.curso, this.filterFields.ubigeo, this.filterFields.zona).done(function (localesCurso) {
                _this.localesCurso = localesCurso;
                _this.locales = [];
                _this.localesCurso.map(function (value, index) {
                    _this.locales.push(value.local);
                });
                console.log(_this.localesCurso);
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
            var localcurso_id = null;
            this.localesCurso.map(function (value, index) {
                debugger;
                value.local.id_local == local_selected ? localcurso_id = value.id : '';
            });
            this.distribucionService.asignarZonas({ localcurso: localcurso_id, zonas: zonasAsignar }).done(function (response) {
                _this.getZonasDistrito();
            });
        };
        return DistribucionView;
    }());
    new DistribucionView();
});
//# sourceMappingURL=distribucion.view.js.map