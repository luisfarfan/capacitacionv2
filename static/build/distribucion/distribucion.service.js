define(["require", "exports"], function (require, exports) {
    "use strict";
    var DistribucionService = (function () {
        function DistribucionService() {
            this.url_localzona = BASEURL + "/distribucion/localzona/";
            this.url_localzonaDetalle = BASEURL + "/distribucion/localzona_detalle/";
            this.url_asignarZonas = BASEURL + "/distribucion/asignarZonas/";
            this.url_zonas_libres = BASEURL + "/distribucion/zonas_libres_por_asignar/";
            this.url_localambientes_detalle = BASEURL + "/distribucion/localambiente_detalle/";
            this.url_personal_bylocalcurso = BASEURL + "/distribucion/personalcapacitar_bylocalcurso/";
            this.url_distribuir = BASEURL + "/distribucion/distribuir/";
        }
        DistribucionService.prototype.filterLocalZona = function (pk) {
            return $.ajax({
                url: "" + this.url_localzonaDetalle + pk + "/"
            });
        };
        DistribucionService.prototype.filterLocalAmbientes = function (localcurso) {
            return $.ajax({
                url: "" + this.url_localambientes_detalle + localcurso + "/"
            });
        };
        DistribucionService.prototype.getPersonalbylocalCurso = function (localcurso) {
            return $.ajax({
                url: "" + this.url_personal_bylocalcurso + localcurso + "/"
            });
        };
        DistribucionService.prototype.distribuirPersonal = function (localcurso) {
            return $.ajax({
                url: "" + this.url_distribuir + localcurso + "/"
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
        DistribucionService.prototype.delete = function (pk) {
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