define(["require", "exports"], function (require, exports) {
    "use strict";
    var DistribucionService = (function () {
        function DistribucionService() {
            this.url_localzona = BASEURL + "/distribucion/localzona/";
            this.url_localzonaDetalle = BASEURL + "/distribucion/localzona_detalle/";
            this.url_asignarZonas = BASEURL + "/distribucion/asignarZonas/";
            this.url_zonas_libres = BASEURL + "/distribucion/zonas_libres_por_asignar/";
        }
        DistribucionService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk === null ? this.url_localzonaDetalle : "" + this.url_localzonaDetalle + pk + "/"
            });
        };
        DistribucionService.prototype.update = function (pk, obj) {
            return $.ajax({
                url: "" + this.url_localzona + pk + "/",
                type: 'PUT',
                data: obj
            });
        };
        DistribucionService.prototype.add = function (obj) {
            return $.ajax({
                url: "" + this.url_localzona,
                type: 'POST',
                data: obj
            });
        };
        DistribucionService.prototype["delete"] = function (pk) {
            return $.ajax({
                url: "" + this.url_localzona + pk + "/",
                type: 'DELETE'
            });
        };
        DistribucionService.prototype.asignarZonas = function (object) {
            return $.ajax({
                url: "" + this.url_asignarZonas,
                type: 'POST',
                data: object
            });
        };
        DistribucionService.prototype.getZonasLibres = function (curso, ubigeo) {
            return $.ajax({
                url: "" + this.url_zonas_libres + curso + "/" + ubigeo + "/"
            });
        };
        return DistribucionService;
    }());
    exports.DistribucionService = DistribucionService;
});
//# sourceMappingURL=distribucion.service.js.map