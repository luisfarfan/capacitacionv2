define(["require", "exports"], function (require, exports) {
    "use strict";
    var UbigeoService = (function () {
        function UbigeoService() {
            this.url = {
                departamentos: BASEURL + "/ubigeo/departamentos/",
                provincias: BASEURL + "/ubigeo/provincias/",
                distritos: BASEURL + "/ubigeo/distritos/",
                zonas: BASEURL + "/ubigeo/zonas/"
            };
        }
        UbigeoService.prototype.getDepartamentos = function () {
            return $.ajax({
                url: this.url.departamentos
            });
        };
        UbigeoService.prototype.getProvincias = function (ccdd) {
            return $.ajax({
                url: "" + this.url.provincias + ccdd + "/"
            });
        };
        UbigeoService.prototype.getDistritos = function (ccdd, ccpp) {
            return $.ajax({
                url: "" + this.url.distritos + ccdd + "/" + ccpp + "/"
            });
        };
        UbigeoService.prototype.getZonas = function (ubigeo) {
            return $.ajax({
                url: "" + this.url.zonas + ubigeo + "/"
            });
        };
        return UbigeoService;
    }());
    exports.__esModule = true;
    exports["default"] = UbigeoService;
});
//# sourceMappingURL=ubigeo.service.js.map