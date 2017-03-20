define(["require", "exports", './locales_consecucion/locales.service', './core/utils'], function (require, exports, locales_service_1, utils) {
    "use strict";
    var CursoInyection = (function () {
        function CursoInyection() {
            var _this = this;
            this.cursoService = new locales_service_1.CursoService();
            this.etapa_id = null;
            $('#etapa').on('change', function (element) {
                _this.getCursos($(element.currentTarget).val());
                $(element.currentTarget).val() == '' ? _this.etapa_id = null : localStorage.setItem('etapa_id', $(element.currentTarget).val());
            });
            $('#cursos').on('change', function (element) {
                var curso_val = $(element.currentTarget).val();
                _this.cursos.filter(function (value) {
                    if (value.id_curso == curso_val) {
                        _this.curso_selected = value;
                        localStorage.setItem('curso_id', "" + _this.curso_selected.id_curso);
                    }
                });
                curso_val == "-1" ? _this.curso_selected = null : '';
            });
            this.triggerCurso();
        }
        CursoInyection.prototype.saveCursoSession = function (curso_id) {
            this.curso_id = curso_id;
            localStorage.setItem('curso_id', "" + this.curso_id);
            localStorage.setItem('etapa_id', "" + this.curso_id);
        };
        CursoInyection.prototype.triggerCurso = function () {
            var etapa_id = localStorage.getItem('etapa_id');
            $('#etapa').val(etapa_id).trigger('change');
        };
        CursoInyection.prototype.setCurso = function () {
            return localStorage.getItem('curso_id');
        };
        CursoInyection.prototype.getCurso = function () {
        };
        CursoInyection.prototype.getCursos = function (etapa_id) {
            var _this = this;
            this.cursoService.get(etapa_id).done(function (cursos) {
                _this.cursos = cursos;
                utils.setDropdown(_this.cursos, { id: 'id_curso', text: ['nombre_curso'] }, {
                    id_element: 'cursos',
                    bootstrap_multiselect: true,
                    select2: false
                });
                var curso_id = localStorage.getItem('curso_id');
                _this.curso_id = parseInt(curso_id);
                $('#cursos').val(curso_id).trigger('change');
            });
        };
        return CursoInyection;
    }());
    exports.CursoInyection = CursoInyection;
});
//# sourceMappingURL=comun.utils.js.map