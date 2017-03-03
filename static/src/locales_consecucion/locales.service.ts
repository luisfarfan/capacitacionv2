/**
 * Created by Administrador on 3/03/2017.
 */

declare var BASEURL: string;

interface urls {
    local: string,
}

export class LocalService {
    private url: urls = {local: `${BASEURL}/rest_localesconsecucion/local/`}

    get(pk: number = null): JQueryXHR {
        return $.ajax({
            url: pk === null ? this.url.local : `${this.url.local}${pk}/`,
        })
    }

    update(pk: number, obj: Array<Object>): JQueryXHR {
        return $.ajax({
            url: `${this.url.local}${pk}/`,
            type: 'PUT',
            data: obj
        });
    }

    add(obj: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.local}`,
            type: 'POST',
            data: obj,
        });
    }

    delete(pk: number): JQueryXHR {
        return $.ajax({
            url: `${this.url.local}${pk}/`,
            type: 'DELETE',
        });
    }
}