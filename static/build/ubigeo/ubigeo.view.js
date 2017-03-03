define(["require", "exports", "./ubigeo.service", "../core/utils"], function (require, exports, ubigeo_service_1, utils) {
    "use strict";
    var UbigeoView = (function () {
        function UbigeoView(departamento_id, provincia_element_id, distrito_element_id, zona_element_id) {
            if (zona_element_id === void 0) { zona_element_id = ''; }
            var _this = this;
            this.ubigeoService = new ubigeo_service_1["default"]();
            this.setDepartamentos();
            this.departamento_element_id = departamento_id;
            this.provincia_element_id = provincia_element_id;
            this.distrito_element_id = distrito_element_id;
            this.zona_element_id = zona_element_id;
            $("#" + this.departamento_element_id).on('change', function (event) {
                _this.ccdd = event.target.value;
                _this.setProvincias(_this.ccdd);
            });
            $("#" + this.provincia_element_id).on('change', function (event) {
                _this.ccpp = event.target.value;
                _this.setDistritos(_this.ccdd, _this.ccpp);
            });
            $("#" + this.distrito_element_id).on('change', function (event) {
                _this.ccdi = event.target.value;
                _this.ubigeo = "" + _this.ccdd + _this.ccpp + _this.ccdi;
                _this.setZonas(_this.ubigeo);
            });
        }
        UbigeoView.prototype.setDepartamentos = function () {
            var _this = this;
            this.ubigeoService.getDepartamentos().done(function (departamentos) {
                _this.departamentos = departamentos;
                utils.setDropdown(_this.departamentos, { id: 'ccdd', text: ['departamento'] }, {
                    id_element: _this.departamento_element_id,
                    bootstrap_multiselect: false,
                    select2: true
                });
            }).fail(function (error) {
                console.log(error);
            });
        };
        UbigeoView.prototype.setProvincias = function (ccdd) {
            var _this = this;
            this.ccdd = ccdd;
            this.ubigeoService.getProvincias(this.ccdd).done(function (provincias) {
                _this.provincias = provincias;
                utils.setDropdown(_this.provincias, { id: 'ccpp', text: ['provincia'] }, {
                    id_element: _this.provincia_element_id,
                    bootstrap_multiselect: false,
                    select2: true
                });
            }).fail(function (error) {
                console.log(error);
            });
        };
        UbigeoView.prototype.setDistritos = function (ccdd, ccpp) {
            var _this = this;
            this.ccdd = ccdd;
            this.ccpp = ccpp;
            this.ubigeoService.getDistritos(this.ccdd, this.ccpp).done(function (distritos) {
                _this.distritos = distritos;
                utils.setDropdown(_this.distritos, { id: 'ccdi', text: ['distrito'] }, {
                    id_element: _this.distrito_element_id,
                    bootstrap_multiselect: false,
                    select2: true
                });
            }).fail(function (error) {
                console.log(error);
            });
        };
        UbigeoView.prototype.setZonas = function (ubigeo) {
            var _this = this;
            this.ubigeo = ubigeo;
            this.ubigeoService.getZonas(this.ubigeo).done(function (zonas) {
                _this.zonas = zonas;
                utils.setDropdown(_this.zonas, { id: 'ZONA', text: ['ZONA'] }, {
                    id_element: _this.zona_element_id,
                    bootstrap_multiselect: false,
                    select2: true
                });
            }).fail(function (error) {
                console.log(error);
            });
        };
        return UbigeoView;
    }());
    exports.__esModule = true;
    exports["default"] = UbigeoView;
});
//# sourceMappingURL=ubigeo.view.js.map