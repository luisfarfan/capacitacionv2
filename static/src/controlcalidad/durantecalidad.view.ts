/**
 * Created by prueba on 13/06/2017.
 */

import {ControlCalidadService} from '../controlcalidad/controlcalidad.service';
import {IManual, IGrupoPregunta} from '../controlcalidad/controlcalidad.interfaces';
import {CursoInyection} from '../comun.utils'
import * as utils from '../core/utils';
declare var $: any;
class DuranteCalidadView extends CursoInyection {
    private controlcalidadService: ControlCalidadService = new ControlCalidadService();
    private manual: IManual[] = []
    private grupoPregunta: IGrupoPregunta[] = []
    private conjunto: number = null

    constructor() {
        super()

        console.log(this.getManuales())
        $('#cursos').on('change', () => {
            this.getManuales();
        });

        $('#tablaManual').on('click', '[name="modalManual"]', (element: JQueryEventObject) => {
            this.conjunto = $(element.currentTarget).data('conjunto')
            this.getGrupoPreguntas();
        })
    }

    getGrupoPreguntas() {
        this.controlcalidadService.getLocalFotmato(this.conjunto).done((gpregunta) => {
            this.grupoPregunta = gpregunta
            this.drawFormatoGrupoPregunta();
        })
    }

    drawFormatoGrupoPregunta() {
        this.grupoPregunta.map((value: IGrupoPregunta, index: number) => {
            let aux = ""
            aux += `<table class="table datatable-basic table-bordered" id="">
                                    <thead>
                                    <tr class="bg-table-inei1">
                                        <td rowspan="3">${value.titulo1}</td>
                                    </tr>
                                    ${this.drawGrupoSubPreguntas(value.tipo_titulo)}
                                     </thead>
                                    <tbody>`
            aux += `</tbody></table>`

            $('#grupoPregunta1').html(aux);

        })
    }

    drawGrupoSubPreguntas(tipo: number) {
        let html = `<tr class="bg-table-inei1">                                        
                        <td colspan="2">TURNO( REGISTRADOS POR EL INSTRUCTOR)</td>
                   </tr>
                  <tr class="bg-table-inei1">                                        
                     <td colspan="2">TURNO( REGISTRADOS POR EL ANALISTA)</td>
                  </tr>`
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
        let c = 1
        if (this.manual) {
            html += `<thead>
                <tr class="bg-table-inei1">
                    <th>#</th>
                    <th>Manual</th>
                    <th>EVALUAR</th>
                </tr>
                </thead>
                <tbody>`
            this.manual.map((value: IManual, index: number) => {
                html += `<tr data-titulo="${value.nombre}">
                            <td>${c}</td>
                            <td>${value.nombre}</td>                            
                            <td><ul class="icons-list">                            
                                     <li data-value="${value.id}" data-popup="tooltip" title="Editar" data-conjunto="8" data-tipo="3"
                                     name="modalManual" style="color: #8bc34a" data-toggle="modal" data-target="#tablaR1">
                                     <a><i class="icon-pencil"></i></a>
                                     </li>
                                 </ul>
                            </td>
                            
                            </tr>`
                html += `</tbody>`
                $('#tablaManual').html(html);
                c++
            })
        }
    }
}

new DuranteCalidadView();



