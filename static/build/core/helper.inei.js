/**
 * Created by lfarfan on 19/02/2017.
 */
/**
 * Created by lfarfan on 29/01/2017.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    var ObjectHelper = (function () {
        function ObjectHelper() {
        }
        ObjectHelper.prototype.isEmpty = function (obj) {
            return Object.keys(obj).length === 0;
        };
        ObjectHelper.prototype.findInArrayObject = function (obj, value_search, key_search) {
            var res = false;
            if (!this.isEmpty(obj)) {
                obj.map(function (value, key) {
                    if (key_search in value) {
                        if (value[key_search] == value_search) {
                            res = value;
                        }
                    }
                });
            }
            return res;
        };
        ObjectHelper.prototype.formToObject = function (form) {
            var formObject = {};
            form.map(function (value, key) {
                formObject[value.name] = value.value;
            });
            return formObject;
        };
        ObjectHelper.prototype.findInArrayObjectRecursive = function (obj, value_search, key_search, key_where_recursive) {
            var _this = this;
            var res = [];
            if (!this.isEmpty(obj)) {
                obj.map(function (value, key) {
                    if (key_search in value) {
                        if (value[key_search] == value_search) {
                            debugger;
                            res.push(value);
                            return false;
                        }
                        else {
                            _this.findInArrayObjectRecursive(value[key_where_recursive], value_search, key_search, key_where_recursive);
                        }
                    }
                });
            }
            return res;
        };
        return ObjectHelper;
    }());
    exports.ObjectHelper = ObjectHelper;
});
//# sourceMappingURL=helper.inei.js.map