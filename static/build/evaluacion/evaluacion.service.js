define(["require", "exports"], function (require, exports) {
    "use strict";
    var EvaluacionService = (function () {
        function EvaluacionService() {
            this.url_criterioscurso = BASEURL + "/evaluacion/criterioscurso/";
            this.url_criterios_curso = BASEURL + "/evaluacion/criteriosdetalle_curso/";
            this.url_saveNotas = BASEURL + "/evaluacion/saveNotas/";
        }
        EvaluacionService.prototype.criteriosCurso = function (id_curso) {
            return $.ajax({
                url: "" + this.url_criterioscurso + id_curso + "/"
            });
        };
        EvaluacionService.prototype.criteriosDetalleCurso = function (id_curso) {
            return $.ajax({
                url: "" + this.url_criterios_curso + id_curso + "/"
            });
        };
        EvaluacionService.prototype.saveNotas = function (object) {
            return $.ajax({
                url: this.url_saveNotas,
                type: 'POST',
                data: { personalnotas: JSON.stringify(object) }
            });
        };
        EvaluacionService.prototype.post = function (object) {
            return $.ajax({
                type: 'POST',
                data: object
            });
        };
        EvaluacionService.prototype.put = function (pk, object) {
            return $.ajax({
                type: 'PUT',
                data: object
            });
        };
        EvaluacionService.prototype.patch = function (pk, object) {
            return $.ajax({
                type: 'PATCH',
                data: object
            });
        };
        return EvaluacionService;
    }());
    exports.EvaluacionService = EvaluacionService;
});
//# sourceMappingURL=evaluacion.service.js.map