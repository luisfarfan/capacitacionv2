/**
 * Created by Administrador on 3/03/2017.
 */

declare var BASEURL: string;

interface urls {
    local: string,
}

export class LocalService {
    private url: urls = {local: `${BASEURL}/locales/local/`}

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

export class LocalCurso {
    private url: urls = {local: `${BASEURL}/locales/localcurso/`}

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

export class LocalAmbienteService {
    private url: urls = {local: `${BASEURL}/locales/localambiente/`}

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

export class DirectorioLocalService {
    private url: urls = {local: `${BASEURL}/locales/directoriolocal/`}

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

export class CursoService {
    private url: string = `${BASEURL}/locales/curso_etapa/`;

    get(pk: number = null): JQueryXHR {
        return $.ajax({
            url: pk === null ? this.url : `${this.url}${pk}/`,
        })
    }
}