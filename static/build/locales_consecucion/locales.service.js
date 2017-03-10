/**
 * Created by Administrador on 3/03/2017.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    var LocalService = (function () {
        function LocalService() {
            this.url = { local: BASEURL + "/locales/local/" };
        }
        LocalService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk === null ? this.url.local : "" + this.url.local + pk + "/"
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
            this.url = { local: BASEURL + "/locales/localambiente/" };
        }
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
        }
        DirectorioLocalService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk === null ? this.url.local : "" + this.url.local + pk + "/"
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