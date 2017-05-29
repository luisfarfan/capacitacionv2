/**
 * Created by Administrador on 3/03/2017.
 */

declare var BASEURL: string;

interface urls {
    local: string,
}

export class LocalService {
    private url: urls = {local: `${BASEURL}/locales/local/`}
    private urlAmbito: string = `${BASEURL}/locales/localcurso_filter/`;
    private urlAmbitoUsar: string = `${BASEURL}/locales/localcurso_filterusar/`;
    private urldirectoriolocal_ambiente: string = `${BASEURL}/locales/directoriolocalambientes_detalle/`;
    private urlLocalAmbientes: string = `${BASEURL}/locales/localambiente/`;
    private url_seleccionarLocal: string = `${BASEURL}/locales/seleccionar_local/`;
    private url_deseleccionarLocal: string = `${BASEURL}/locales/deseleccionar_local/`;

    get(pk: number = null): JQueryXHR {
        return $.ajax({
            url: pk === null ? this.url.local : `${this.url.local}${pk}/`,
        });
    }

    getbyAmbienteGeografico(curso: number, ambito: any = {}, usar: boolean = false): JQueryXHR {
        let url = '';
        if (usar) {
            url = `${this.urlAmbitoUsar}${curso}/`;
        } else {
            url = `${this.urlAmbito}${curso}/`;
        }

        if ('ccdd' in ambito) {
            url += `${ambito['ccdd']}/`;
        }
        if ('ccpp' in ambito) {
            url += `${ambito['ccpp']}/`;
        }
        if ('ccdi' in ambito) {
            url += `${ambito['ccdi']}/`;
        }
        if ('zona' in ambito) {
            url += `${ambito['zona']}/`;
        }
        return $.ajax({
            url: url
        });
    }

    getAmbientes(localcurso: number): JQueryXHR {
        return $.ajax({
            url: `${this.urldirectoriolocal_ambiente}${localcurso}/0/`,
        })
    }

    saveDetalleAmbiente(pk: number, object: Object): JQueryXHR {
        return $.ajax({
            url: `${this.urlLocalAmbientes}${pk}/`,
            type: 'PATCH',
            data: object
        });
    }

    update(pk: number, obj: Object): JQueryXHR {
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

    seleccionarLocal(id_local: number): JQueryXHR {
        return $.ajax({
            url: this.url_seleccionarLocal,
            data: {id_local: id_local},
            type: 'POST',
        })
    }

    deseleccionarLocal(id_local: number): JQueryXHR {
        return $.ajax({
            url: this.url_deseleccionarLocal,
            data: {id_local: id_local},
            type: 'POST',
        })
    }

}

export class LocalCurso {
    private url: urls = {local: `${BASEURL}/locales/localcurso/`}

    get(pk: number = null): JQueryXHR {
        return $.ajax({
            url: pk === null ? this.url.local : `${this.url.local}${pk}/`,
        })
    }

    update(pk: number, obj: Object): JQueryXHR {
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
    private url: urls = {
        local: `${BASEURL}/locales/localambiente/`,
    }
    private generar_ambientes: string = `${BASEURL}/locales/generar_ambientes/`;


    generarAmbientes(object: Object): JQueryXHR {
        return $.ajax({
            url: `${this.generar_ambientes}`,
            type: 'POST',
            data: object,
        })
    }

    get(pk: number = null): JQueryXHR {
        return $.ajax({
            url: pk === null ? this.url.local : `${this.url.local}${pk}/`,
        })
    }

    update(pk: number, obj: Object): JQueryXHR {
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
    private urlAmbito: string = `${BASEURL}/locales/directoriolocal_byambito/`;
    private urlDirectorioLocal: string = `${BASEURL}/locales/directoriolocal_ambientes/`;
    private urldirectoriolocal_ambiente: string = `${BASEURL}/locales/directoriolocalambientes_detalle/`;
    private urlLocalAmbientes: string = `${BASEURL}/locales/directoriolocal_ambiente/`;
    private urldirectorioSeleccionado: string = `${BASEURL}/locales/directorioSeleccionado/`;


    get(pk: number = null): JQueryXHR {
        return $.ajax({
            url: pk === null ? this.url.local : `${this.url.local}${pk}/`,
        })
    }

    setDirectorioLocal(curso: number, local: number): JQueryXHR {
        return $.ajax({
            url: `${this.urlDirectorioLocal}${curso}/${local}/`,
        })
    }

    saveDetalleAmbiente(pk: number, object: Object): JQueryXHR {
        return $.ajax({
            url: `${this.urlLocalAmbientes}${pk}/`,
            type: 'PATCH',
            data: object
        });
    }

    seleccionarDirectorio(directoriolocal_id: number, curso_id: number) {
        return $.ajax({
            url: `${this.urldirectorioSeleccionado}${directoriolocal_id}/${curso_id}/`,
        });
    }

    getbyAmbienteGeografico(curso: number, ambito: any = {}): JQueryXHR {
        let url = `${this.urlAmbito}${curso}/`;
        if ('ccdd' in ambito) {
            url += `${ambito['ccdd']}/`;
        }
        if ('ccpp' in ambito) {
            url += `${ambito['ccpp']}/`;
        }
        if ('ccdi' in ambito) {
            url += `${ambito['ccdi']}/`;
        }
        if ('zona' in ambito) {
            url += `${ambito['zona']}/`;
        }
        return $.ajax({
            url: url
        });
    }

    getAmbientes(localcurso: number): JQueryXHR {
        return $.ajax({
            url: `${this.urldirectoriolocal_ambiente}${localcurso}/1/`,
        })
    }

    update(pk: number, obj: Object): JQueryXHR {
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

export class DirectorioLocalCursoService {
    private url: urls = {local: `${BASEURL}/locales/directoriolocalcurso/`}

    add(obj: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url.local}`,
            type: 'POST',
            data: obj,
        });
    }
}
export class CursoService {
    private url: string = `${BASEURL}/locales/curso_etapa/`;

    get(pk: number = null, rolcodigo: string = null): JQueryXHR {
        return $.ajax({
            async: false,
            url: pk === null ? this.url : `${this.url}${pk}/${rolcodigo ? rolcodigo + '/' : ''}`,
        })
    }
}
