/**
 * Created by Administrador on 3/03/2017.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    var LocalService = (function () {
        function LocalService() {
            this.url = { local: BASEURL + "/rest_localesconsecucion/local/" };
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
});
//# sourceMappingURL=locales.service.js.map