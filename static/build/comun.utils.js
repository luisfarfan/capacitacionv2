define(["require", "exports", './locales_consecucion/locales.service', './core/utils'], function (require, exports, locales_service_1, utils) {
    "use strict";
    var Curso = (function () {
        function Curso() {
            var _this = this;
            this.cursoService = new locales_service_1.CursoService();
            $('#etapa').on('change', function (element) {
                _this.getCursos($(element.currentTarget).val());
            });
            $('#cursos').on('change', function (element) {
                var curso_val = $(element.currentTarget).val();
                _this.cursos.filter(function (value) { return value.id_curso == curso_val ? _this.curso_selected = value : ''; });
                curso_val == "-1" ? _this.curso_selected = null : '';
            });
        }
        Curso.prototype.saveCursoSession = function (curso_id) {
            this.curso_id = curso_id;
            localStorage.setItem('curso_id', "" + this.curso_id);
        };
        Curso.prototype.setCurso = function () {
            return localStorage.getItem('curso_id');
        };
        Curso.prototype.getCursos = function (etapa_id) {
            var _this = this;
            this.cursoService.get(etapa_id).done(function (cursos) {
                _this.cursos = cursos;
                utils.setDropdown(_this.cursos, { id: 'id_curso', text: ['nombre_curso'] }, {
                    id_element: 'cursos',
                    bootstrap_multiselect: true,
                    select2: false
                });
            });
        };
        return Curso;
    }());
    exports.Curso = Curso;
});
//# sourceMappingURL=comun.utils.js.map