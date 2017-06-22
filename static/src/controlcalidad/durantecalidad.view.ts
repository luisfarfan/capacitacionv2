/**
 * Created by prueba on 13/06/2017.
 */

import {ControlCalidadService} from '../controlcalidad/controlcalidad.service';
import {
    IManual,
    IGrupoTitulo,
    IGrupoPregunta,
    ICManual,
    ICapitulo,
    IRDurante,
    IAnalista,
    ILocal,
    IAula
} from '../controlcalidad/controlcalidad.interfaces';
import {CursoInyection} from '../comun.utils'
import * as utils from '../core/utils';
declare var $: any;
class DuranteCalidadView extends CursoInyection {
    private controlcalidadService: ControlCalidadService = new ControlCalidadService();
    private manual: IManual[] = []
    private grupoTitulo: IGrupoTitulo[] = []
    private grupoPregunta: IGrupoPregunta[] = []
    private listaCapituloManual: ICManual[] = []
    private analistas: IAnalista[] = [];
    private locales: ILocal[] = null;
    private aulas: IAula[] = null;
    private respuesta: IRDurante[] = [];
    private capitulos: ICapitulo[] = []
    private conjunto: number = null
    private manualId: number = null
    private opcionGuardar: number = 0
    private cursoMaster: number = 0
    private selectLocal: number = 0
    private usuariologin: number = 0
    private aulaMaster: number = 0
    private capituloMaster: number = 0

    constructor() {
        super()


        console.log(this.getLocales())
        this.usuariologin = $('#span_usuario_nombre').attr('data-id')
        this.cursoMaster = $("#cursos").val()
        $('#cursos').on('change', () => {
            this.getManuales();
            this.getLocales()
        });

        $("#grupoPregunta1").on('click', '#activarInput', (element: JQueryEventObject) => {
            let aux = $(element.currentTarget).data('tipo');
            $("#resp" + aux).prop('disabled', false)
        });

        $("#grupoPregunta1").on('click', '#desactivarInput', (element: JQueryEventObject) => {
            let aux = $(element.currentTarget).data('tipo');
            $("#resp" + aux).prop('disabled', true)
        });

        $('#local').on('change', (e: any) => {
            this.selectLocal = $("#local").find(':selected').val();
            this.getAulas()
        })

        $('#aula').on('change', (element: JQueryEventObject) => {
            this.aulaMaster = $("#aula").find(':selected').attr("data-id");
            this.getManuales()
        })

        $('#tablaManual').on('click', '[name="modalAlumnos"]', (element: JQueryEventObject) => {
            this.conjunto = $(element.currentTarget).data('conjunto')
            this.manualId = $(element.currentTarget).data('id')
            this.opcionGuardar = 1
            this.getGrupoPreguntas();
        })

        $('#tablaManual').on('click', '[name="modalCapitulo"]', (element: JQueryEventObject) => {
            this.manualId = $(element.currentTarget).data('id')
            this.getCapituloManual()
        })

        $('#tablaCapitulos').on('click', '[name="evaluarCapitulo"]', (element: JQueryEventObject) => {
            this.conjunto = $(element.currentTarget).data('conjunto')
            this.capituloMaster = $(element.currentTarget).data('id')
            this.opcionGuardar = 2
            this.getGrupoPreguntas();
        })

        $("#tablaR1").on('click', '#guardarForm', (element: JQueryEventObject) => {
            this.respuesta = []
            let bodyrespuesta: any = {}

            var body = $("#grupoPregunta1").find("tbody");

            body.map((index: number, element: Element) => {
                let tr = $(element).find('tr')
                tr.map((indice: number, dato: Element) => {
                    bodyrespuesta = {}
                    let input = $(dato).find("input");
                    let textarea = $(dato).find("textarea");
                    let grupoPregunta = $(dato).data("id")

                    bodyrespuesta['curso'] = this.cursoMaster;
                    bodyrespuesta['pregunta'] = grupoPregunta;
                    bodyrespuesta['instructor'] = this.usuariologin;
                    bodyrespuesta['aula'] = this.aulaMaster;
                    bodyrespuesta['fecha'] = '2/2/2';
                    bodyrespuesta['manual'] = this.manualId;
                    if (this.opcionGuardar == 2) {
                        bodyrespuesta['capitulo'] = this.capituloMaster;
                    }
                    bodyrespuesta['opciones'] = []
                    textarea.map((i: number, f: Element) => {
                        if (($(f).val() != "")) {
                            bodyrespuesta['opciones'].push({
                                'respuesta1': $(f).val(),
                                'respuesta2': null
                            });
                        }
                    })

                    input.map((i: number, f: Element) => {
                        let id = $(f).attr("data-tipo")
                        let doble = $(f).attr("data-id")
                        if (doble == 1) {
                            if (($(f).val() != "")) {
                                bodyrespuesta['opciones'].push({
                                    'respuesta1': $(f).val(),
                                    'respuesta2': $("#resp" + id).val(),
                                    'respuesta3': $("#resp" + id + id).val(),
                                    'respuesta4': $("#resp" + id + id + id).val(),
                                });
                            }
                        }
                        if (doble == 2) {
                            if (($(f).val() != "")) {
                                bodyrespuesta['opciones'].push({
                                    'respuesta1': $(f).val(),
                                    'respuesta2': $("#resp" + id).val(),
                                    'respuesta3': null,
                                    'respuesta4': null,
                                });
                            }
                        }
                        if (doble == 3) {
                            if (($(f).val() != "")) {
                                bodyrespuesta['opciones'].push({
                                    'respuesta1': $(f).val(),
                                    'respuesta2': null,
                                    'respuesta3': null,
                                    'respuesta4': null,
                                });
                            }
                        }
                        if (doble == 4) {
                            if (($(f).is(':checked'))) {
                                bodyrespuesta['opciones'].push({
                                    'respuesta1': 'si',
                                    'respuesta2': $("#resp" + id).val(),
                                });
                            }
                            else {
                            }
                        }
                        if (doble == 5) {
                            if (($(f).is(':checked'))) {
                                bodyrespuesta['opciones'].push({
                                    'respuesta1': 'no',
                                    'respuesta2': null,
                                });
                            }
                            else {
                            }
                        }
                        if (doble == 6) {
                            if (($(f).is(':checked'))) {
                                let aux = ''
                                if ($("#ra1").is(':checked')) aux = $("#ra1").attr("data-value")
                                if ($("#ra2").is(':checked')) aux = $("#ra2").attr("data-value")
                                if ($("#ra3").is(':checked')) aux = $("#ra3").attr("data-value")
                                if ($("#ra4").is(':checked')) aux = $("#ra4").attr("data-value")
                                bodyrespuesta['opciones'].push({
                                    'respuesta1': 'si',
                                    'respuesta2': aux,
                                });
                            }
                            else {
                            }
                        }
                        if (doble == 7) {
                            if ($(f).is(':checked')) {
                                bodyrespuesta['opciones'].push({
                                    'respuesta1': 'no',
                                    'respuesta2': null,
                                });
                            }
                            else {
                            }
                        }
                        else {
                        }
                    })
                    this.respuesta.push(bodyrespuesta)
                })
            })
            this.guardardatos(this.opcionGuardar)
        })
    }

    getLocales() {
        if (this.curso_selected) {
            this.controlcalidadService.getLocalesCurso(this.curso_selected.id_curso).done((locales) => {
                this.controlcalidadService.getAnalistas().done((analistas) => {
                    this.locales = locales;
                    this.drawLocalesSeleccionador()
                });
            })
        } else {
            this.locales = null
        }
    }

    guardardatos(opcionGuardar: number) {

        if (opcionGuardar == 1) {
            utils.alert_confirm(() => {
                this.controlcalidadService.addEditRespuestasDurante(this.respuesta).done((response) => {
                    this.getManuales()
                });
            })
        }
        if (opcionGuardar == 2) {
            utils.alert_confirm(() => {
                this.controlcalidadService.addEditRespuestasDuranteCapitulo(this.respuesta).done((response) => {
                    this.getCapituloManual()
                });
            })
        }
    }

    getCapituloManual() {
        this.controlcalidadService.obtenerCapituloManual(this.manualId).done((capituloM) => {
            this.listaCapituloManual = capituloM
            this.drawListaCapitulos()
        })
    }

    getGrupoPreguntas() {
        this.controlcalidadService.getLocalFotmato(this.conjunto).done((gpregunta) => {
            this.controlcalidadService.getPregunta().done((ppregunta) => {
                this.grupoTitulo = gpregunta
                this.grupoPregunta = ppregunta
                this.drawFormatoGrupoPregunta();
            })
        })
    }

    drawListaCapitulos() {
        let html = ''
        let html2 = ''
        let c = 1

        html2 += `<thead>
                <tr class="bg-table-inei1">
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Evaluar</th>
                </tr>
                </thead>
                <tbody></tbody>`
        $('#tablaCapitulos').html(html2);
        this.listaCapituloManual.map((valueCM: ICManual, index: number) => {
            let capitulo = valueCM.capitulo
            let manual = valueCM.manual
            this.controlcalidadService.obtenerNombreCapitulo(capitulo).done((capituloC) => {
                this.controlcalidadService.getEstadoDuranteCapitulo(this.usuariologin, this.aulaMaster, capitulo, manual, this.cursoMaster).done((estado) => {
                    if (valueCM.capitulo == 0) {
                        html += `<tr>
                                <td>${c}</td>
                                <td>Solo se evaluara manual</td>
                                <td>${this.drawEstadoManual(estado.success, 0)}</td>
                            </tr>`
                    } else {
                        for (let a of capituloC) {
                            html += `<tr>
                                <td>${c}</td>
                                <td>${a.nombre}</td>
                                <td>${this.drawEstadoManual(estado.success, 0)}</td>
                            </tr>`
                        }
                    }

                    c++
                    $('#tablaCapitulos').find("tbody").html(html);
                })
            })
        })

    }

    drawFormatoGrupoPregunta() {
        let html = ""
        this.grupoTitulo.map((valueT: IGrupoTitulo, index: number) => {
            if (valueT.formato == 8) {
                html += `<table class="table datatable-basic table-bordered">
                        <thead>
                        <tr class="bg-table-inei1">
                            <td rowspan="3">${valueT.titulo1}</td>
                        </tr>
                        ${this.drawGrupoSubPreguntas(valueT.tipo_titulo, valueT.conjunto)}
                         </thead>
                        <tbody>`
                this.grupoPregunta.map((valueP: IGrupoPregunta, index: number) => {
                    if (valueT.conjunto == valueP.conjunto) {
                        html += `<tr data-id="${valueP.id}">
                                    <td>${valueP.nombre}</td>
                                    ${this.drawInput(valueP.tipo, valueP.id)}
                                </tr>`
                    }

                })
                html += `</tbody></table>`
                $('#grupoPregunta1').html(html);
            }
            if (valueT.formato == 9) {
                html += `<table class="table datatable-basic table-bordered">
                        <thead>
                        <tr class="bg-table-inei1">
                            <td rowspan="3">${valueT.titulo1}</td>
                        </tr>
                        ${this.drawGrupoSubPreguntas(valueT.tipo_titulo, valueT.conjunto)}
                         </thead>
                        <tbody>`
                this.grupoPregunta.map((valueP: IGrupoPregunta, index: number) => {
                    if (valueT.conjunto == valueP.conjunto) {
                        html += `<tr data-id="${valueP.id}">
                            <td>${valueP.nombre}</td>
                            ${this.drawInput(valueP.tipo, valueP.id)}
                            </tr>`
                    }
                })
                html += `</tbody></table>`
                $('#grupoPregunta1').html(html);
            }
        })
    }

    drawInput(tipo: number, id: number) {
        let html = ''
        if (tipo == 5) {
            html += `<td><input data-id="1" data-tipo="${id}" type="number" class="form-control valid" aria-invalid="false"></td>
                    <td><input id="resp${id}" type="number" class="form-control valid" aria-invalid="false"></td>
                    <td><input id="resp${id}${id}" type="number" class="form-control valid" aria-invalid="false"></td>
                    <td><input id="resp${id}${id}${id}"type="number" class="form-control valid" aria-invalid="false"></td>`
        }
        if (tipo == 6) {
            html += `<td><input data-id="2" data-tipo="${id}" type="number" class="form-control valid" aria-invalid="false"></td>
                    <td><input id="resp${id}" type="number" class="form-control valid" aria-invalid="false"></td>`
        }
        if (tipo == 7) {
            html += `<td><input data-id="3" data-tipo="${id}" type="number" class="form-control valid" aria-invalid="false"></td>`
        }
        if (tipo == 8) {
            html += `<td><input data-id="4" data-tipo="${id}" type="radio" name="radio-${id}" id="activarInput" class="styled" ></td>
                    <td><input data-id="5" data-tipo="${id}" type="radio" name="radio-${id}" id="desactivarInput" class="styled" ></td>
                    <td><input id="resp${id}" type="number" class="form-control valid" aria-invalid="false" disabled></td>`
        }
        if (tipo == 9) {
            html += `<td><input data-id="6" name="radio-${id}" type="radio" class="styled" ></td>
                    <td><input data-id="7" name="radio-${id}" type="radio" class="styled" ></td>
                    <td>
                        <input id="ra1" name="radio-${id}${id}" data-value="0" type="radio" class="styled"> Llego tarde<br>
                        <input id="ra2" name="radio-${id}${id}" data-value="1" type="radio" class="styled" > Profundizó en la explicación del tema expuesto<br>
                        <input id="ra3" name="radio-${id}${id}" data-value="2" type="radio" class="styled"> Le falto material y tuvo que salir a coordinar<br>
                        <input id="ra4" name="radio-${id}${id}" data-value="3" type="radio" class="styled"> Otros   
                    </td>`
        }
        return html
    }

    drawGrupoSubPreguntas(tipo: number, conjunto: number) {
        let html = ''
        if (tipo == 5) {
            html += `<tr class="bg-table-inei1">                                        
                        <td colspan="2">TURNO( REGISTRADOS POR EL INSTRUCTOR)</td>
                        <td colspan="2">TURNO( REGISTRADOS POR EL ANALISTA)</td>
                   </tr>
                   <tr class="bg-table-inei1">                                        
                     <td rowspan="1">Mañana</td>
                     <td rowspan="1">Tarde</td>
                     <td rowspan="1">Mañana</td>
                     <td rowspan="1">Tarde</td>
                  </tr>`
        }
        if (tipo == 6) {
            html += `<tr class="bg-table-inei1">
                        <td>Cuantos alumnos</td>
                        <td>Se corrigio</td>
                    </tr>`
        }
        if (tipo == 7) {
            html += `<tr class="bg-table-inei1">
                        <td>Total en el Aula</td>
                    </tr>`
        }
        if (tipo == 8) {
            let aux = ''
            if (conjunto == 10) aux = '¿Por que ?'
            else aux = 'Cuantos alumnos'
            html += `<tr class="bg-table-inei1">
                        <td>Si</td>
                        <td>No</td>
                        <td>${aux}</td>
                    </tr>`
        }

        return html
    }

    getManuales() {
        if (this.curso_selected) {
            this.controlcalidadService.getManuales(this.curso_selected.id_curso).done((manual) => {
                this.manual = manual
                this.drawManuales()
            })
        }
    }

    drawManuales() {
        let html = '';
        let html2 = '';
        let c = 1
        if (this.manual) {
            html2 += `<thead>
                    <tr class="bg-table-inei1">
                        <th>#</th>
                        <th>Manual</th>
                        <th>Evaluar Alumno</th>
                        <th>Evaluar capitulo</th>
                    </tr>
                    </thead>
                    <tbody></tbody>`
            $('#tablaManual').html(html2);
            this.manual.map((value: IManual, index: number) => {
                this.controlcalidadService.getEstadoDuranteManual(this.usuariologin, this.aulaMaster, value.id, this.cursoMaster).done((estado) => {
                    html += `<tr data-titulo="${value.nombre}">
                            <td>${c}</td>
                            <td>${value.nombre}</td>                            
                            <td>${this.drawEstadoManual(estado.success, value.id)}</td>
                            <td>
                                <button data-id="${value.id}" name="modalCapitulo" data-conjunto="9" type="button" 
                                class="btn btn-primary active legitRipple">Evaluar</button>
                            </td>
                            </tr>`
                    c++
                    $('#tablaManual').find('tbody').html(html);
                })

            })

        }
    }

    drawEstadoManual(aux: any, id: number) {
        let html = ''
        if (id == 0) {
            if (aux == false) html = `<ul class="icons-list">                            
                                     <li data-popup="tooltip" title="Editar" data-conjunto="9" data-id="0" 
                                     name="evaluarCapitulo" style="color: #8bc34a" data-toggle="modal" data-target="#tablaR1">
                                     <a><i class="icon-pencil"></i></a>
                                     </li>
                                 </ul>`
            else html = `<span class="label label-success">Completo</span>`
        }
        else {
            if (aux == false) html = `<ul class="icons-list">                            
                                     <li data-id="${id}" data-popup="tooltip" title="Editar" data-conjunto="8"
                                        name="modalAlumnos" style="color: #8bc34a" data-toggle="modal" data-target="#tablaR1">
                                     <a><i class="icon-pencil"></i></a>
                                     </li>
                                 </ul>`
            else html = `<span class="label label-success">Completo</span>`

        }

        return html
    }

    drawLocalesSeleccionador() {
        let html = '';
        let c = 1
        if (this.locales) {
            this.locales.map((value: ILocal, index: number) => {
                if (c == 1) {
                    html += `<option value="" selected="selected">Seleccione local</option>`
                    c++
                }
                if (value.seleccionar != 0 && value.instructor != null) {
                    html += `<option data-id="${value.id_directoriolocal_id}" value="${value.id_directoriolocal_id}">${value.nombre_local}</option>`
                }
            });
        }
        $('#local').html(html);
    }

    getAulas() {
        this.controlcalidadService.getAulas(this.selectLocal).done((aulas) => {
            this.aulas = aulas
            this.drawAulas();
        })
    }

    drawAulas() {
        let html = '';
        if (this.aulas) {
            html += `<option value="" selected="selected">Seleccione aula</option>`
            this.aulas.map((value: IAula, index: number) => {
                this.controlcalidadService.set_userAula(value.id_localambiente).done((data) => {
                    this.controlcalidadService.getAnalistas().done((analistas) => {
                        this.analistas = analistas
                        html += `${this.drawDibujar(data.id_instructor, value.id_localambiente)}`
                        $('#aula').html(html);
                    })

                })

            })
        }
    }

    drawDibujar(a: number, b: number) {
        let html = ''
        this.analistas.map((value: IAnalista, index: number) => {
            if (value.id == a) {
                if (value.rol.id == this.usuariologin) {
                    html += `<option data-value="${a}" data-id="${b}">${b}</option>`
                }
            }
        })
        return html
    }
}


new DuranteCalidadView();



