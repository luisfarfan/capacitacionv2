define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Created by Administrador on 13/03/2017.
     */
    var ModelService = (function () {
        function ModelService() {
        }
        ModelService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                type: 'PUT'
            });
        };
        ModelService.prototype.post = function (object) {
            return $.ajax({
                type: 'POST',
                data: object
            });
        };
        ModelService.prototype.put = function (pk, object) {
            return $.ajax({
                type: 'PUT',
                data: object
            });
        };
        ModelService.prototype.patch = function (pk, object) {
            return $.ajax({
                type: 'PATCH',
                data: object
            });
        };
        return ModelService;
    }());
    exports.ModelService = ModelService;
});
//# sourceMappingURL=abstractService.js.map