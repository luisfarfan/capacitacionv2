/**
 * Created by prueba on 30/05/2017.
 */
/**
 * Created by Administrador on 23/05/2017.
 */
import {ControlCalidadService} from '../controlcalidad/controlcalidad.service';
import {IAnalista, ILocal, IAula, IManual, IRespuesta, IOpcion} from '../controlcalidad/controlcalidad.interfaces';
import {CursoInyection} from '../comun.utils'
import * as utils from '../core/utils';
declare var $: any;
class ControlCalidadView extends CursoInyection {
    private controlcalidadService: ControlCalidadService = new ControlCalidadService();
    private analistas: IAnalista[] = [];
    private locales: ILocal[] = null;
    private localSelected: ILocal = null;
    private aulas: IAula[] = null;
    private manual: IManual[] = null;
    private respuesta: IRespuesta[] = [];
    private veces: number = 4;
    private idLocal: number = null
    private tipo: number = null
    private tipoFormato: number = null
    private preguntas: number = null
    private localMaster: number = null
    private aulaMaster: number = null
    private estado: any = null
    private manualMaster: number = null
    private opcionGuardar: number = null
    private titulomanual: string = null

    constructor() {
        super();

        console.log(this.getLocales())

        $("#tablaR1").on('click', '#guardarForm', (element: JQueryEventObject) => {
            this.respuesta = []
            let opcion: any
            let bodyrespuesta: any = {}
            var llave: number
            var llave2: number
            var condicion = this.opcionGuardar
            if (condicion == 1) {
                llave = this.localMaster
            }
            if (condicion == 2) {
                llave = this.aulaMaster
            }
            if (condicion == 3) {
                llave = this.aulaMaster
                llave2 = this.manualMaster
            }
            var body = $("#grupoPregunta1").find("tbody");

            body.map((index: number, element: Element) => {
                let tr = $(element).find("tr")
                tr.map((indice: number, dato: Element) => {
                    bodyrespuesta = {}
                    let grupoPregunta = $(dato).data("id")
                    let input = $(dato).find("input");
                    bodyrespuesta['id'] = llave;
                    if (condicion == 3) {
                        bodyrespuesta['id_manual'] = llave2;
                    }
                    bodyrespuesta['pregunta'] = grupoPregunta;
                    bodyrespuesta['opciones'] = []
                    input.map((i: number, f: Element) => {
                        let tipoPregunta = $(f).attr("data-tipo")
                        let doble = $(f).attr("data-id")
                        if (doble == 4) {
                            if (($(f).is(':checked'))) {
                                bodyrespuesta['opciones'].push({
                                    'opcion': $(f).attr("data-opcion"),
                                    'respuesta': 'si',
                                    'opcional': ''
                                });
                            }
                            else {
                            }

                        }
                        if (doble == 3) {
                            if (($(f).is(':checked'))) {
                                    bodyrespuesta['opciones'].push({
                                        'opcion': $(f).attr("data-opcion"),
                                        'respuesta': 'no',
                                        'opcional': $("#inputChk"+tipoPregunta).val()
                                    });
                            }
                        }
                        if (doble == 1) {
                            if (($(f).val() != "")) {
                                bodyrespuesta['opciones'].push({
                                    'opcion': $(f).attr("data-opcion"),
                                    'respuesta': $(f).val(),
                                    'opcional': ''
                                });
                            }
                        }
                        if (doble == 0) {
                            if (($(f).val() != "")) {
                                bodyrespuesta['opciones'].push({
                                    'opcion': $(f).attr("data-opcion"),
                                    'respuesta': $(f).val(),
                                    'opcional': $("#inputChk"+tipoPregunta).val()
                                });
                            }
                        }
                        if (doble == 5) {
                            if (($(f).is(':checked'))) {
                                bodyrespuesta['opciones'].push({
                                    'opcion': $(f).attr("data-opcion"),
                                    'respuesta': 'si',
                                    'opcional': '',
                                    'cantidad': $("#inputChk" + tipoPregunta + tipoPregunta).val()
                                });
                            }
                        }
                        if (doble == 6) {
                            if (($(f).is(':checked'))) {
                                bodyrespuesta['opciones'].push({
                                    'opcion': $(f).attr("data-opcion"),
                                    'respuesta': 'no',
                                    'opcional': $("#inputChk"+tipoPregunta).val(),
                                    'cantidad': $("#inputChk" + tipoPregunta + tipoPregunta).val()
                                });
                            }
                        }
                        else {
                            // console.log(tipoPregunta)
                        }
                    });
                    this.respuesta.push(bodyrespuesta)
                })
            })
            this.guardardatos(condicion)
        })

        $('#cursos').on('change', () => {
            this.getLocales();
        });

        $("#tablaR1").on('click', '#activarInput', (element: JQueryEventObject) => {
            let aux = $(element.currentTarget).data('value');
            $("#inputChk" + aux).prop('disabled', true)
        });

        $("#tablaR1").on('click', '#desactivarInput', (element: JQueryEventObject) => {
            let aux = $(element.currentTarget).data('value');
            $("#inputChk" + aux).prop('disabled', false)
        });

        $('#divInformacion').hide();

        $('#tablaAnalista').on('click', '[name="btn_EvaluarLocal"]', (element: JQueryEventObject) => {
            this.preguntas = $(element.currentTarget).data('tipo');
            this.localMaster = $(element.currentTarget).data('value');
            this.opcionGuardar = 1

            this.tipoFormato = this.preguntas
            this.getGrupoPreguntas();
        })

        $('#tablaAulas').on('click', '[name="btnGPreguntas2"]', (element: JQueryEventObject) => {
            this.aulaMaster = $(element.currentTarget).data('value');
            this.getManuales()
            this.getManual()
        })

        $('#tablaAulas').on('click', '[name="modalPregunta"]', (element: JQueryEventObject) => {
            this.tipo = $(element.currentTarget).data('value');
            this.preguntas = $(element.currentTarget).data('tipo');
            this.aulaMaster = $(element.currentTarget).data('value');
            this.opcionGuardar = 2
            this.tipoFormato = this.preguntas
            this.getGrupoPreguntas();
        })

        $('#grupolistaformato').on('click', '[name="modalManual"]', (element: JQueryEventObject) => {
            this.tipo = $(element.currentTarget).data('value');
            this.preguntas = $(element.currentTarget).data('grupo');
            this.tipoFormato = $(element.currentTarget).data('tipo');
            this.manualMaster = $(element.currentTarget).data('value');
            this.titulomanual = $(element.currentTarget).data('titulo');
            this.opcionGuardar = 3
            this.getGrupoPreguntas();
        })

        $('#tablaAnalista').on('click', '[name="btn_EvaluarAula"]', (element: JQueryEventObject) => {
            this.idLocal = $(element.currentTarget).data('value');
            this.getAulas();
        })

        $('#div_repetir1').on('click', '#btn_guardar', (element: JQueryEventObject) => {
            $('#div_repetir1').hide();
            $('#div_repetir2').show();
            this.veces = 5;
            let serialArray = $("#div_repetir1").serializeArray();
        })

    }

    drawEstado(aux: any) {
        let html = ''
        if(aux == false ) html = `<td><span class="label label-info">Pendiente</span></td>`
        else html = `<td><span class="label label-success">Completo</span></td>`
        return html
    }

    getManual() {
        if (this.curso_selected) {
            this.controlcalidadService.getManuales(this.curso_selected.id_curso).done((manual) => {
                this.manual = manual
            })
        } else {
            this.locales = null
        }
    }

    getManuales() {
        let html = '';
        if (this.manual) {
            html += `<thead>
                <tr class="bg-table-inei1">
                    <th>ID</th>
                    <th>FORMATO</th>
                    <th>EVALUAR</th>
                    <th>ESTADO</th>
                </tr>
                </thead>
                <tbody>`
            this.manual.map((value: IManual, index: number) => {
                this.controlcalidadService.getEstadoManual(this.aulaMaster, value.id).done((estado) => {
                html += `<tr data-titulo="${value.nombre}">
                            <td>${value.id + index}</td>
                            <td>${value.nombre}</td>                            
                            <td><ul class="icons-list">                            
                                     <li data-value="${value.id}" data-popup="tooltip" title="Editar" data-grupo="${value.id + 2}" data-tipo="3"
                                     name="modalManual" style="color: #8bc34a" data-toggle="modal" data-target="#tablaR1">
                                     <a><i class="icon-pencil"></i></a>
                                     </li>
                                 </ul>
                            </td>
                            ${this.drawEstado(estado.success)} 
                            </tr>`
                    html += `</tbody>`
                    $('#listaformato').html(html);
                })
            })
        }
    }

    guardardatos(condicion: number) {
        if (condicion == 1) {
            utils.alert_confirm(() => {
                this.controlcalidadService.addEditRespuestas(this.respuesta).done((response) => {
                });
            })
        }
        if (condicion == 2) {
            utils.alert_confirm(() => {
                this.controlcalidadService.addEditRespuestasAula(this.respuesta).done((response) => {
                });
            })
        }
        if (condicion == 3) {
            utils.alert_confirm(() => {
                this.controlcalidadService.addEditManuales(this.respuesta).done((response) => {
                });
                this.getManuales()
            })
        }
    }

    getGrupoPreguntas() {
        this.controlcalidadService.getLocalFotmato(this.preguntas).done((gpregunta) => {
            let aux = ""
            this.controlcalidadService.getPregunta().done((pregunta) => {
                for (let entryG of gpregunta) {
                    aux += `<table class="table datatable-basic table-bordered" id="a${entryG.id}">
                                    <thead>
                                    <tr class="bg-table-inei1">
                                        <td>${entryG.id}</td>
                                        <td>${entryG.titulo1}</td>
                                        ${this.drawRespuestas(entryG.tipo_titulo)}                        
                                    </tr>
                                     </thead>
                                    <tbody>`
                    for (let entryP of pregunta) {
                        if (entryG.conjunto == entryP.conjunto) {
                            aux += `<tr data-id="${entryP.id}">
                                    <td>${entryP.id}</td>
                                    <td>${entryP.nombre}</td> 
                                    ${this.drawTipoPregunta(entryP.tipo, entryP.id)}                            
                                    </tr>`
                        }
                    }
                    aux += `</tbody></table>`
                }
                $('#grupoPregunta1').html(aux);
            })
        })
    }

    getLocales() {
        if (this.curso_selected) {
            this.controlcalidadService.getLocalesCurso(this.curso_selected.id_curso).done((locales) => {
                this.controlcalidadService.getAnalistas().done((analistas) => {
                    this.analistas = analistas;
                    this.locales = locales;
                    this.drawLocalesSeleccionador()
                });
            })
        } else {
            this.locales = null
        }
    }

    getAulas() {
        this.controlcalidadService.getAulas(this.idLocal).done((aulas) => {
            this.aulas = aulas
            this.drawAulas();
        })
    }

    drawAulas() {
        let html = '';
        if (this.aulas) {
            html += `<table class="table datatable-basic" id="listaAulas">
                        <thead>
                        <tr class="bg-table-inei1">
                            <th>ID</th>
                            <th>SALON</th>
                            <th>EVALULAR</th>
                            <th>MANUALES</th>
                        </tr>
                        </thead>
                        <tbody>`
            this.aulas.map((value: IAula, index: number) => {
                    html += `<tr>
                             <td>${index + 1}</td>
                             <td>${value.id_localambiente}</td>
                             <td>
                                 <ul class="icons-list">
                                     <li data-value="${value.id_localambiente}" data-popup="tooltip" title="Editar" data-tipo="2"
                                     name="modalPregunta" style="color: #8bc34a" data-toggle="modal" data-target="#tablaR1">
                                     <a><i class="icon-pencil"></i></a>
                                     </li>
                                 </ul>
                             </td>
                             <td>
                                <button data-value="${value.id_localambiente}" type="button" class="btn btn-primary active legitRipple"
                                name="btnGPreguntas2">Evaluar </button>
                            </td>
                        </tr>`


            })
            html += `</tbody></table>`
        }

        $('#tablaAulas').html(html);
    }

    drawRespuestas(tipoRespuesta: String) {
        let reespuestaHTML = ''
        if (tipoRespuesta == '1') reespuestaHTML = `<td>Cantidad</td>`
        if (tipoRespuesta == '2') reespuestaHTML = `<td>SI</td><td>NO</td><td>SE CORRIGIO</td>`
        if (tipoRespuesta == '3') reespuestaHTML = `<td>SI</td><td>NO</td><td>¿Cuantos?</td><td>SE CORRIGIO</td>`
        if (tipoRespuesta == '4') reespuestaHTML = `<td>Cumple</td><td>No cumple</td>`
        return reespuestaHTML
    }

    drawTipoPregunta(tipo: number, id: number) {
        let preguntaHTML = ''
        if (tipo == 1) preguntaHTML += `<td><input data-id="1" type="number" id="pregunta"  class="form-control valid requerido" data-opcion="1"
                                            required="required" value="" aria-invalid="false" value="1"></td>`
        if (tipo == 2) preguntaHTML += `<td>
											<input data-id="4" type="radio" id="activarInput" name="radio-${id}" class="styled" checked="checked" data-value="${id}" data-opcion="2">
                                        </td>
                                        <td>
                                            <input data-id="3"  data-tipo="${id}" type="radio" id="desactivarInput" name="radio-${id}" class="styled" data-value="${id}" data-opcion="2">
                                        </td>
                                        <td><input data-id="2" type="text" name="radio-${id}" class="form-control valid requerido" data-opcion="3"
                                           required="required" aria-invalid="false" data-tipo="1" id="inputChk${id}" disabled></td>`
        if (tipo == 3) preguntaHTML += `<td>
											<input data-id="5" data-tipo="${id}" data-value="${id}" data-id="4" id="activarInput" type="radio" name="radio-${id}" class="styled" checked="checked" value="0" data-opcion="2" >
                                        </td>
                                        <td>
                                            <input data-id="6" data-tipo="${id}" data-value="${id}" data-id="4" type="radio" id="desactivarInput" name="radio-${id}" class="styled" value="0" data-opcion="2">
                                        </td>
                                        <td><input data-id="3" type="text" name="pregunta" class="form-control valid requerido" data-opcion="${tipo}"
                                            required="required" id="inputChk${id}${id}" aria-invalid="false" data-opcion="3"></td>
                                        <td><input data-id="3" type="text" name="pregunta" class="form-control valid requerido" data-opcion="${tipo}"
                                            required="required" id="inputChk${id}" aria-invalid="false" data-opcion="3" disabled></td>`
        if (tipo == 4) preguntaHTML += `<td><input type="number" data-id="0" name="pregunta" class="form-control valid requerido" data-opcion="${tipo}"
                                            required="required" value="" aria-invalid="false" data-opcion="1" data-tipo="${id}"></td>
                                        <td><input type="number" data-id="1" name="pregunta" class="form-control valid requerido" data-opcion="${tipo}"
                                            required="required" value="" id="inputChk${id}" aria-invalid="false" data-opcion="1" value="1"></td>`

        return preguntaHTML
    }

    drawLocalesSeleccionador() {
        let html = '';
        if (this.locales) {
            this.locales.map((value: ILocal, index: number) => {
                if (value.seleccionar != 0 && value.instructor != null) {
                    html += `<tr>
                            <td>${value.nombre_local}</td>
                            <td>${value.zona_ubicacion_local}</td>
                            <td>${value.nombre_via}</td>
                            <td>${value.referencia}</td>
                            <td>${value.total_aulas}</td>
                            <td>${this.drawObtenerAnalista(value.instructor)}</td>
                            <td></td>
                            <td>
                                <button data-value="${value.id_local}" data-tipo="1" type="button" class="btn btn-primary active legitRipple" 
                                data-toggle="modal" data-target="#tablaR1" name="btn_EvaluarLocal">Evaluar </button>
                            <td>
                                <button data-value="${value.id_directoriolocal_id}" name="btn_EvaluarAula" type="button" 
                                class="btn btn-primary active legitRipple">Evaluar</button>
                            </td>
                            
                           </tr>`
                }

            });
        }
        $('#tablaAnalista').find('tbody').html(html);
    }

    drawObtenerAnalista(analista: number) {
        let analistaHTML = ``;
        this.analistas.map((value: IAnalista, index: number) => {
            if (value.id == analista) {
                analistaHTML = `${value.nombre}`
            }
        })
        return analistaHTML;
    }


    drawBtnSeleccion(id_local: number, seleccionado: number = 0) {
        let buttonHTML = '';
        if (seleccionado) {
            buttonHTML = `<button data-value="${id_local}" name="btn_deseleccionar" type="button" class="btn btn-success active legitRipple">Seleccionado</button>`
        } else {
            buttonHTML = `<button data-value="${id_local}" name="btn_seleccionar" type="button" class="btn btn-primary active legitRipple">Seleccionar</button>`
        }
        return buttonHTML;
    }

    setLocalSelected(id: number) {
        this.locales.filter((local: ILocal) => local.id_local == id ? this.localSelected = local : '');
    }

    seleccionarLocal() {
        this.controlcalidadService.add_userLocal({local: this.localSelected.id_local, usuario: null}).done((local) => {
            this.getLocales();
        });
    }

    deseleccionarLocal() {
        this.controlcalidadService.delete_userLocal(this.localSelected.localusuario).done(() => {
            this.getLocales();
        });
    }

}

new ControlCalidadView();