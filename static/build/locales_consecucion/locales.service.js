/**
 * Created by Administrador on 3/03/2017.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    var LocalService = (function () {
        function LocalService() {
            this.url = { local: BASEURL + "/locales/local/" };
            this.urlAmbito = BASEURL + "/locales/localcurso_filter/";
            this.urldirectoriolocal_ambiente = BASEURL + "/locales/directoriolocalambientes_detalle/";
            this.urlLocalAmbientes = BASEURL + "/locales/localambiente/";
        }
        LocalService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk === null ? this.url.local : "" + this.url.local + pk + "/"
            });
        };
        LocalService.prototype.getbyAmbienteGeografico = function (curso, ubigeo, zona) {
            if (zona === void 0) { zona = null; }
            return $.ajax({
                url: zona === null ? "" + this.urlAmbito + curso + "/" + ubigeo + "/" : "" + this.urlAmbito + curso + "/" + ubigeo + "/" + zona + "/"
            });
        };
        LocalService.prototype.getAmbientes = function (localcurso) {
            return $.ajax({
                url: "" + this.urldirectoriolocal_ambiente + localcurso + "/0/"
            });
        };
        LocalService.prototype.saveDetalleAmbiente = function (pk, object) {
            return $.ajax({
                url: "" + this.urlLocalAmbientes + pk + "/",
                type: 'PATCH',
                data: object
            });
        };
        LocalService.prototype.update = function (pk, obj) {
            return $.ajax({
                url: "" + this.url.local + pk + "/",
                type: 'PUT',
                data: obj
            });
        };
        LocalService.prototype.add = function (obj) {
            return $.ajax({
                url: "" + this.url.local,
                type: 'POST',
                data: obj
            });
        };
        LocalService.prototype["delete"] = function (pk) {
            return $.ajax({
                url: "" + this.url.local + pk + "/",
                type: 'DELETE'
            });
        };
        return LocalService;
    }());
    exports.LocalService = LocalService;
    var LocalCurso = (function () {
        function LocalCurso() {
            this.url = { local: BASEURL + "/locales/localcurso/" };
        }
        LocalCurso.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk === null ? this.url.local : "" + this.url.local + pk + "/"
            });
        };
        LocalCurso.prototype.update = function (pk, obj) {
            return $.ajax({
                url: "" + this.url.local + pk + "/",
                type: 'PUT',
                data: obj
            });
        };
        LocalCurso.prototype.add = function (obj) {
            return $.ajax({
                url: "" + this.url.local,
                type: 'POST',
                data: obj
            });
        };
        LocalCurso.prototype["delete"] = function (pk) {
            return $.ajax({
                url: "" + this.url.local + pk + "/",
                type: 'DELETE'
            });
        };
        return LocalCurso;
    }());
    exports.LocalCurso = LocalCurso;
    var LocalAmbienteService = (function () {
        function LocalAmbienteService() {
            this.url = {
                local: BASEURL + "/locales/localambiente/"
            };
            this.generar_ambientes = BASEURL + "/locales/generar_ambientes/";
        }
        LocalAmbienteService.prototype.generarAmbientes = function (object) {
            return $.ajax({
                url: "" + this.generar_ambientes,
                type: 'POST',
                data: object
            });
        };
        LocalAmbienteService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk === null ? this.url.local : "" + this.url.local + pk + "/"
            });
        };
        LocalAmbienteService.prototype.update = function (pk, obj) {
            return $.ajax({
                url: "" + this.url.local + pk + "/",
                type: 'PUT',
                data: obj
            });
        };
        LocalAmbienteService.prototype.add = function (obj) {
            return $.ajax({
                url: "" + this.url.local,
                type: 'POST',
                data: obj
            });
        };
        LocalAmbienteService.prototype["delete"] = function (pk) {
            return $.ajax({
                url: "" + this.url.local + pk + "/",
                type: 'DELETE'
            });
        };
        return LocalAmbienteService;
    }());
    exports.LocalAmbienteService = LocalAmbienteService;
    var DirectorioLocalService = (function () {
        function DirectorioLocalService() {
            this.url = { local: BASEURL + "/locales/directoriolocal/" };
            this.urlAmbito = BASEURL + "/locales/directoriolocal_byambito/";
            this.urlDirectorioLocal = BASEURL + "/locales/directoriolocal_ambientes/";
            this.urldirectoriolocal_ambiente = BASEURL + "/locales/directoriolocalambientes_detalle/";
            this.urlLocalAmbientes = BASEURL + "/locales/directoriolocal_ambiente/";
            this.urldirectorioSeleccionado = BASEURL + "/locales/directorioSeleccionado/";
        }
        DirectorioLocalService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk === null ? this.url.local : "" + this.url.local + pk + "/"
            });
        };
        DirectorioLocalService.prototype.setDirectorioLocal = function (curso, local) {
            return $.ajax({
                url: "" + this.urlDirectorioLocal + curso + "/" + local + "/"
            });
        };
        DirectorioLocalService.prototype.saveDetalleAmbiente = function (pk, object) {
            return $.ajax({
                url: "" + this.urlLocalAmbientes + pk + "/",
                type: 'PATCH',
                data: object
            });
        };
        DirectorioLocalService.prototype.seleccionarDirectorio = function (directoriolocal_id, curso_id) {
            return $.ajax({
                url: "" + this.urldirectorioSeleccionado + directoriolocal_id + "/" + curso_id + "/"
            });
        };
        DirectorioLocalService.prototype.getbyAmbienteGeografico = function (curso, ubigeo, zona) {
            if (zona === void 0) { zona = null; }
            return $.ajax({
                url: zona === null ? "" + this.urlAmbito + curso + "/" + ubigeo + "/" : "" + this.urlAmbito + curso + "/" + ubigeo + "/" + zona + "/"
            });
        };
        DirectorioLocalService.prototype.getAmbientes = function (localcurso) {
            return $.ajax({
                url: "" + this.urldirectoriolocal_ambiente + localcurso + "/1/"
            });
        };
        DirectorioLocalService.prototype.update = function (pk, obj) {
            return $.ajax({
                url: "" + this.url.local + pk + "/",
                type: 'PUT',
                data: obj
            });
        };
        DirectorioLocalService.prototype.add = function (obj) {
            return $.ajax({
                url: "" + this.url.local,
                type: 'POST',
                data: obj
            });
        };
        DirectorioLocalService.prototype["delete"] = function (pk) {
            return $.ajax({
                url: "" + this.url.local + pk + "/",
                type: 'DELETE'
            });
        };
        return DirectorioLocalService;
    }());
    exports.DirectorioLocalService = DirectorioLocalService;
    var DirectorioLocalCursoService = (function () {
        function DirectorioLocalCursoService() {
            this.url = { local: BASEURL + "/locales/directoriolocalcurso/" };
        }
        DirectorioLocalCursoService.prototype.add = function (obj) {
            return $.ajax({
                url: "" + this.url.local,
                type: 'POST',
                data: obj
            });
        };
        return DirectorioLocalCursoService;
    }());
    exports.DirectorioLocalCursoService = DirectorioLocalCursoService;
    var CursoService = (function () {
        function CursoService() {
            this.url = BASEURL + "/locales/curso_etapa/";
        }
        CursoService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk === null ? this.url : "" + this.url + pk + "/"
            });
        };
        return CursoService;
    }());
    exports.CursoService = CursoService;
});
//# sourceMappingURL=locales.service.js.map