var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../abstractService"], function (require, exports, abstractService_1) {
    "use strict";
    var PersonalAsistenciaService = (function (_super) {
        __extends(PersonalAsistenciaService, _super);
        function PersonalAsistenciaService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.url_personalAsistencia = "";
            return _this;
        }
        PersonalAsistenciaService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: this.url_personalAsistencia,
                type: 'PUT'
            });
        };
        PersonalAsistenciaService.prototype.post = function (object) {
            return $.ajax({
                type: 'POST',
                data: object
            });
        };
        PersonalAsistenciaService.prototype.put = function (pk, object) {
            return $.ajax({
                type: 'PUT',
                data: object
            });
        };
        PersonalAsistenciaService.prototype.patch = function (pk, object) {
            return $.ajax({
                type: 'PATCH',
                data: object
            });
        };
        return PersonalAsistenciaService;
    }(abstractService_1.ModelService));
    exports.PersonalAsistenciaService = PersonalAsistenciaService;
    var AsistenciaService = (function () {
        function AsistenciaService() {
            this.url_localambienteInstructor = BASEURL + "/asistencia/localambientes_instructor/";
            this.url_localcurso = BASEURL + "/asistencia/localcurso/";
            this.url_getrangofechas = BASEURL + "/asistencia/getrangofechas/";
            this.url_personalaula = BASEURL + "/asistencia/personalaula_bylocalambiente/";
            this.url_saveAsistencia = BASEURL + "/asistencia/saveAsistencia/";
        }
        AsistenciaService.prototype.getAulasbyInstructor = function (id_instructor, curso) {
            return $.ajax({
                url: "" + this.url_localambienteInstructor + id_instructor + "/" + curso + "/"
            });
        };
        AsistenciaService.prototype.saveAsistencia = function (data) {
            return $.ajax({
                url: this.url_saveAsistencia,
                type: 'POST',
                data: { personalasistencia: JSON.stringify(data) }
            });
        };
        AsistenciaService.prototype.getPersonalAsistenciaDetalle = function (id_localambiente) {
            return $.ajax({
                url: "" + this.url_personalaula + id_localambiente + "/"
            });
        };
        AsistenciaService.prototype.getLocalbyAula = function (localcurso_id) {
            return $.ajax({
                url: "" + this.url_localambienteInstructor + localcurso_id + "/"
            });
        };
        AsistenciaService.prototype.getRangoFechas = function (fechainicio, fechafin) {
            return $.ajax({
                url: this.url_getrangofechas,
                type: 'POST',
                data: { fecha_inicio: fechainicio, fecha_fin: fechafin }
            });
        };
        return AsistenciaService;
    }());
    exports.AsistenciaService = AsistenciaService;
});
//# sourceMappingURL=asistencia.service.js.map