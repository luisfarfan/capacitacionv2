/**
 * Created by Administrador on 23/05/2017.
 */
declare var BASEURL: string;
declare var SEGURIDADBASEURL: string;
export class ControlCalidadService {
    private url_localescurso: string = `${BASEURL}/controlcalidad/localescurso/`;
    private url_aulaslocal: string = `${BASEURL}/locales/directoriolocalambientes_detalle/`;
    private url_analistas: string = `${SEGURIDADBASEURL}services/userbyrol/anacal/`;
    private url_usuariolocales: string = `${BASEURL}/controlcalidad/usuariolocales/`;
    private url_usuariolocalambiente: string = `${BASEURL}/locales/localambiente/`;
    // private url_usuariolocal: string = `${BASEURL}/locales/local/`;
    // private url_grupopregunta: string = `${BASEURL}/controlcalidad/grupopreguntas/`;
    private url_preguntas: string = `${BASEURL}/controlcalidad/preguntas/`;
    // private url_localambienterespuesta: string = `${BASEURL}/controlcalidad/localambientesrespuestas/`;
    private url_localformato: string = `${BASEURL}/controlcalidad/grupopreguntas/`;
    private url_manual: string = `${BASEURL}/controlcalidad/Manual/`;
    // private url_conunto_pregunta: string = `${BASEURL}/controlcalidad/preguntas/`;
    private url_addeditRespuestas: string = `${BASEURL}/controlcalidad/addedit/`;
    private url_addeditRespuestasAula: string = `${BASEURL}/controlcalidad/addeditaula/`;
    private url_addeditRespuestasManual: string = `${BASEURL}/controlcalidad/addeditmanual/`;
    private url_estadotablamanual: string = `${BASEURL}/controlcalidad/estadomanual/`;
    // private url_auldainstructor: string = `${BASEURL}/controlcalidad/AulaInstructor/`;
    private url_respuestalocal: string = `${BASEURL}/controlcalidad/respuestalocal/`;
    private url_respuestaaulalocal: string = `${BASEURL}/controlcalidad/respuestaaulalocal/`;
    private url_respuestamanual: string = `${BASEURL}/controlcalidad/respuestamanual/`;
    private url_listacapitulomanual: string = `${BASEURL}/controlcalidad/capitulomanual/`;
    private url_nombrecapitulo: string = `${BASEURL}/controlcalidad/nombrecapitulo/`;
    private url_addeditRespuestasDurante: string = `${BASEURL}/controlcalidad/respuestaDurante/`;
    private url_addeditRespuestasDuranteCapitulo: string = `${BASEURL}/controlcalidad/respuestaDuranteCapitulo/`;
    private url_estadodurantemanual: string = `${BASEURL}/controlcalidad/estadodurantemanual/`;
    private url_estadodurantecapitulo: string = `${BASEURL}/controlcalidad/estadodurantecapitulo/`;
    private url_estadolocal: string = `${BASEURL}/controlcalidad/estadolocal/`;
    private url_estadoaula: string = `${BASEURL}/controlcalidad/estadoaula/`;

    getEstadoAula(local: number, aula: number, curso: number, usuario: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_estadoaula}${local}/${aula}/${curso}/${usuario}`,
            type: 'GET'
        })
    }

    getEstadoLocal(local: number, curso: number, usuario: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_estadolocal}${local}/${curso}/${usuario}`,
            type: 'GET'
        })
    }

    getEstadoDuranteManual(user: number, aula: number, manual: number, curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_estadodurantemanual}${user}/${aula}/${manual}/${curso}`,
            type: 'GET'
        })
    }

    getEstadoDuranteCapitulo(user: number, aula: number, capitulo: number, manual: number, curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_estadodurantecapitulo}${user}/${aula}/${capitulo}/${manual}/${curso}`,
            type: 'GET'
        })
    }

    addEditRespuestasDuranteCapitulo(data: Array<Object>) {
        console.log(data)
        return $.ajax({
            url: this.url_addeditRespuestasDuranteCapitulo,
            type: 'POST',
            data: {'data': JSON.stringify(data)}
        })
    }

    addEditRespuestasDurante(data: Array<Object>) {
        console.log(data)
        return $.ajax({
            url: this.url_addeditRespuestasDurante,
            type: 'POST',
            data: {'data': JSON.stringify(data)}
        })
    }

    obtenerNombreCapitulo(id: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_nombrecapitulo}${id}`,
            type: 'GET'
        })
    }

    obtenerCapituloManual(id: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_listacapitulomanual}${id}/`,
            type: 'GET'
        })
    }

    getRespuestasManual(curso: number, tipo: number): JQueryXHR {
        if (tipo == 0) {
            return $.ajax({
                url: `${this.url_respuestamanual}${curso}`,
                type: 'GET'
            })
        }
    }

    getRespuestasAula(curso: number, tipo: number): JQueryXHR {
        if (tipo == 0) {
            return $.ajax({
                url: `${this.url_respuestaaulalocal}${curso}/`,
                type: 'GET'
            })
        }
    }

    getRespuestasLocal(curso: number, tipo: number): JQueryXHR {
        if (tipo == 0) {
            return $.ajax({
                url: `${this.url_respuestalocal}${curso}`,
                type: 'GET'
            })
        }
    }

    getEstadoManual(idLocal: number, idManual: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_estadotablamanual}${idLocal}/${idManual}`,
            type: 'GET'
        })
    }

    addEditRespuestas(data: Array<Object>) {
        return $.ajax({
            url: this.url_addeditRespuestas,
            type: 'POST',
            data: {'data': JSON.stringify(data)}
        })
    }

    // addAulaInstructor(data: Object) {
    //     return $.ajax({
    //         url: this.url_auldainstructor,
    //         type: 'POST',
    //         data: data
    //     })
    // }

    addEditManuales(data: Array<Object>) {
        return $.ajax({
            url: this.url_addeditRespuestasManual,
            type: 'POST',
            data: {'data': JSON.stringify(data)}
        })
    }

    addEditRespuestasAula(data: Array<Object>) {
        return $.ajax({
            url: this.url_addeditRespuestasAula,
            type: 'POST',
            data: {'data': JSON.stringify(data)}
        })
    }

    getLocalesCurso(curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localescurso}${curso}/`,
            type: 'GET'
        })
    }

    // getAulasInstructor(): JQueryXHR {
    //     return $.ajax({
    //         url: this.url_auldainstructor,
    //         type: 'GET'
    //     })
    // }

    // getConjuntoPreguta(id: number): JQueryXHR {
    //     return $.ajax({
    //         url: `${this.url_conunto_pregunta}${id}/`,
    //         type: 'GET'
    //     })
    // }


    getManuales(curso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_manual}${curso}/`,
            type: 'GET'
        })
    }

    getLocalFotmato(id: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_localformato}${id}/`,
            type: 'GET'
        })
    }

    // getLocales(curso: number): JQueryXHR {
    //     return $.ajax({
    //         url: `${this.url_usuariolocal}${curso}/`,
    //         type: 'GET'
    //     })
    // }

    // getGrupoPreguntas(): JQueryXHR {
    //     return $.ajax({
    //         url: this.url_grupopregunta,
    //         type: 'GET'
    //     })
    // }

    getPregunta(): JQueryXHR {
        return $.ajax({
            url: this.url_preguntas,
            type: 'GET'
        })
    }

    getAulas(localcurso: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_aulaslocal}${localcurso}/1/`,
            type: 'GET'
        })
    }

    getAnalistas(): JQueryXHR {
        return $.ajax({
            url: this.url_analistas,
            type: 'GET'
        })
    }

    // add_respuesta(object: Object): JQueryXHR {
    //     return $.ajax({
    //         url: this.url_localambienterespuesta,
    //         type: 'POST',
    //         data: object
    //     })
    // }

    add_userLocal(object: Object): JQueryXHR {
        return $.ajax({
            url: this.url_usuariolocales,
            type: 'POST',
            data: object
        })
    }

    delete_userLocal(pk: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_usuariolocales}${pk}/`,
            type: 'DELETE',
        })
    }

    put_userLocal(pk: number, object: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url_usuariolocales}${pk}/`,
            type: 'PUT',
            data: object
        })
    }

    put_userAula(pk: number, object: Object): JQueryXHR {
        return $.ajax({
            url: `${this.url_usuariolocalambiente}${pk}/`,
            type: 'PUT',
            data: object
        })
    }

    set_userAula(pk: number): JQueryXHR {
        return $.ajax({
            url: `${this.url_usuariolocalambiente}${pk}/`,
            type: 'GET'
        })
    }

    // put(pk: number, object: Object): JQueryXHR {
    //     return $.ajax({
    //         type: 'PUT',
    //         data: object
    //     })
    // }
    //
    // patch(pk: number, object: Object): JQueryXHR {
    //     return $.ajax({
    //         type: 'PATCH',
    //         data: object
    //     })
    // }
}