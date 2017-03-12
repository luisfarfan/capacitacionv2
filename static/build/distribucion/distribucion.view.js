define(["require", "exports", '../comun.utils'], function (require, exports, comun_utils_1) {
    "use strict";
    var DistribucionView = (function () {
        function DistribucionView() {
            this.curso = new comun_utils_1.Curso();
        }
        DistribucionView.prototype.getCurso = function () {
            this.curso.cursos;
        };
        return DistribucionView;
    }());
    new DistribucionView();
});
//# sourceMappingURL=distribucion.view.js.map