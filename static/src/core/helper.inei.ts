/**
 * Created by lfarfan on 19/02/2017.
 */
/**
 * Created by lfarfan on 29/01/2017.
 */

export class ObjectHelper {
    isEmpty(obj: Object): any {
        return Object.keys(obj).length === 0;
    }

    findInArrayObject(obj: any, value_search: any, key_search: string): any {
        let res = false;
        if (!this.isEmpty(obj)) {
            obj.map((value: any, key: any) => {
                if (key_search in value) {
                    if (value[key_search] == value_search) {
                        res = value;
                    }
                }
            })
        }
        return res;
    }

    formToObject(form: Array<Object>) {
        let formObject: any = {};
        form.map((value: any, key: any) => {
            formObject[value.name] = value.value;
        });
        return formObject;
    }

    findInArrayObjectRecursive(obj: any, value_search: any, key_search: string, key_where_recursive: string): any {
        let res: Array<any> = [];
        if (!this.isEmpty(obj)) {
            obj.map((value: any, key: any) => {
                if (key_search in value) {
                    if (value[key_search] == value_search) {
                        debugger
                        res.push(value);
                        return false;
                    } else {
                        this.findInArrayObjectRecursive(value[key_where_recursive], value_search, key_search, key_where_recursive);
                    }
                }
            })
        }
        return res;
    }
}
