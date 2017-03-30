/**
 * Created by Administrador on 29/03/2017.
 */
import {EvaluacionService} from '../evaluacion/evaluacion.service'
import {CursoInyection} from '../comun.utils';

import * as utils from '../core/utils';
import {
    ICargoFuncionalDetalle,
    IPeaNotaFinal, IPeaNotaFinalSinInternet
} from "../evaluacion/evaluacion.interface";
import {SinInternetService} from 'sininternet.service';
import {IPersonal} from "../distribucion/distribucion.interface";

declare var ubigeo: any;
class SinInternetView {
    private evaluacionService: EvaluacionService = new EvaluacionService();
    private cursoInyection: CursoInyection = new CursoInyection();
    private ambitos: any = {};
    private personalNoInternet: IPeaNotaFinalSinInternet[] = [];
    private personalRankeoNotaFinal: IPeaNotaFinalSinInternet[] = [];
    private ambitoDetalle: any = {};
    private cargosFuncionales: ICargoFuncionalDetalle[] = [];
    private sininternetService: SinInternetService = new SinInternetService();

    constructor() {
        $('#cursos').on('change', () => {
            this.getPersonas();
        });
        $('#btn_save_asistencia').on('click', () => {
            utils.alert_confirm(() => {
                this.saveNotaFinalSinInternet();
            }, 'Esta seguro de guardar la nota final ?');

        });
        $('#select_cargos_funcionales').on('change', () => {
            this.getMeta();
        });
        $('#select_zonas').on('change', () => {
            this.getMeta();
        });
        $('#btn_ver_personal').on('click', () => {
            this.getPersonalNotaFinal();
        });
        $('#btn_rankeo_temporal').on('click', () => {
            this.rankear();
        });
        $('#cursos').on('change', (element: JQueryEventObject) => {
            let curso_id = $(element.currentTarget).val();
            $('#p_curso_actual').text($('#cursos :selected').text());
            this.getCargosFuncionales(curso_id);
        });
        $('#select_cargos_funcionales').on('change', () => {
            this.getMeta();
        });
        $('#select_zonas').on('change', () => {
            this.getMeta();
        });
        this.getAmbitos();
    }

    getCargosFuncionales(id_curso: number) {
        this.evaluacionService.cargosCurso(id_curso).done((cargosFuncionales) => {
            this.cargosFuncionales = cargosFuncionales;
            let html: string = `<option value="">Seleccione cargo</option>`;
            this.cargosFuncionales.map((value: ICargoFuncionalDetalle) => {
                html += `<option value="${value.id_cargofuncional.id_cargofuncional}">${value.id_cargofuncional.nombre_funcionario}</option>`
            });
            $('#select_cargos_funcionales').html(html);
        })
    }

    getMeta() {
        let cargofuncional = $('#select_cargos_funcionales').val();
        let zona = $('#select_zonas').val() == "-1" ? null : $('#select_zonas').val();

        this.evaluacionService.getMeta(`${ubigeo.ccdd}${ubigeo.ccpp}${ubigeo.ccdi}`, cargofuncional, zona).done((meta: Array<any>) => {
            if (meta.length) {
                $('#meta').text(meta[0].meta)
            } else {
                $('#meta').text('No existe meta')
            }
        }).fail(() => {
            $('#meta').text('')
        });
    }

    rankear() {
        let meta: any = $('#meta').text();
        let inputsTable: any = $('#table_personalnotafinal').find('input[type="number"]');
        let count = 0;
        inputsTable.map((index: number, input: Element) => {
            count++;
            let span: any = $(input).parent().parent().find('span')
            if (meta >= count) {
                if ($(input).val() >= 11) {
                    span.addClass('label-success')
                    span.text('Titular')
                } else {
                    span.addClass('label-danger')
                    span.text('No seleccionado')
                }
            } else {
                if ($(input).val() >= 11) {
                    span.addClass('label-primary')
                    span.text('reserva')
                } else {
                    span.addClass('label-danger')
                    span.text('No seleccionado')
                }
            }
        });
    }

    getPersonalNotaFinal() {
        let cargo: number = $('#select_cargos_funcionales').val();
        let ambito_selected = $('#select_zonas').val();
        let ubigeo: any = {};
        this.setUbigeo();
        if (this.ambitos.ccdd == null) {
            this.ambitos.ccdd = ambito_selected
        } else if (this.ambitos.ccdd != null && this.ambitos.ccpp == null) {
            this.ambitos.ccpp = ambito_selected
        } else if (this.ambitos.ccpp != null && this.ambitos.ccdi == null) {
            this.ambitos.ccdi = ambito_selected
        } else if (this.ambitos.ccdi != null && this.ambitos.zona == null) {
            this.ambitos.zona = ambito_selected
        }

        if (ambito_selected == "-1") {
            this.ambitos.zona = null
        }
        this.sininternetService.filterPersonalSinInternet(cargo, this.ambitos.ccdd, this.ambitos.ccpp, this.ambitos.ccdi, this.ambitos.zona).done((personalNotaFinal) => {
            this.personalRankeoNotaFinal = personalNotaFinal;
            this.drawPersonalNotaFinal();
        });
    }

    setUbigeo() {
        let ambito: any = {};
        ubigeo.ccdd !== '' ? this.ambitos['ccdd'] = ubigeo.ccdd : this.ambitos['ccdd'] = null;
        ubigeo.ccpp !== '' ? this.ambitos['ccpp'] = ubigeo.ccpp : this.ambitos['ccpp'] = null;
        ubigeo.ccdi !== '' ? this.ambitos['ccdi'] = ubigeo.ccdi : this.ambitos['ccdi'] = null;
        ubigeo.zona !== '' ? this.ambitos['zona'] = ubigeo.zona : this.ambitos['zona'] = null;
    }

    getPersonas() {
        let curso: number = $('#cursos').val();
        let ubigeo: any = {};
        this.setUbigeo();
        this.sininternetService.personasSinInternet(curso, `${this.ambitos.ccdd}${this.ambitos.ccpp}${this.ambitos.ccdi}`).done((personalNotaFinal) => {
            this.personalNoInternet = personalNotaFinal;
            console.log(this.personalNoInternet);
            this.drawPersonal();
        });
    }

    drawPersonal() {
        let html: string = '';
        this.personalNoInternet.map((peanota: IPeaNotaFinalSinInternet, index: number) => {
            html += `<tr data-value="${peanota.pea.id_pea}">
                        <td>${index + 1}</td>
                        <td>${peanota.pea.ape_paterno} ${peanota.pea.ape_materno} ${peanota.pea.nombre}</td>
                        <td>${peanota.pea.dni}</td>
                        <td>${peanota.pea.zona}</td>
                        <td><input name="nota_final" value="${peanota.nota_final}" type="number"></td>
                     </tr>`;
        });
        $('#table_personalnotafinal1').find('tbody').html(html);
    }

    drawPersonalNotaFinal() {
        let html: string = '';
        this.personalRankeoNotaFinal.map((pea: IPeaNotaFinalSinInternet, index: number) => {

            // html += `<tr data-value="${pea.id_peaaula}">
            //             <td>${index + 1}</td>
            //             <td>${pea.id_pea.ape_paterno} ${pea.id_pea.ape_materno} ${pea.id_pea.nombre}</td>
            //             <td>${pea.id_pea.dni}</td>
            //             <td>${pea.id_pea.zona}</td>
            //             <td><input name="nota_final" value="${pea.personalaula_notafinal[0].nota_final}" type="number"></td>
            //             <td><span class="label"></span></td>
            //          </tr>`;

        });
        $('#table_personalnotafinal').find('tbody').html(html);
    }

    saveNotaFinalSinInternet() {
        let inputsNotafinal: any = $('input[name="nota_final"]')
        let request: Array<Object> = [];
        inputsNotafinal.each((index: number, element: Element) => {
            let trpeaaula: number;
            if ($(element).val() != '') {
                trpeaaula = $(element).parent().parent().data('value')
                request.push({id_pea: trpeaaula, nota_final: $(element).val()})
            }
        });
        this.sininternetService.saveNotasFinalSinInternet(request).done((response) => {
            this.getPersonas();
            utils.showSwalAlert('La nota final se guardo correctamente', 'Exito', 'success');
        });
    }

    getAmbitos() {
        this.setUbigeo();
        let by: any;
        this.evaluacionService.ambitos(this.ambitos.ccdd, this.ambitos.ccpp, this.ambitos.ccdi).done((ambitos) => {
            if (this.ambitos.ccdd == null) {
                by = {id: 'ccdd', text: ['departamento']}
            }
            else if (this.ambitos.ccdd != null && this.ambitos.ccpp == null) {
                by = {id: 'ccpp', text: ['provincia']}
            } else if (this.ambitos.ccpp != null && this.ambitos.ccdi == null) {
                by = {id: 'ccdi', text: ['distrito']}
            } else if (this.ambitos.ccpp != null && this.ambitos.ccdi != null) {
                by = {id: 'ZONA', text: ['ZONA']}
            }
            this.ambitoDetalle = ambitos;

            utils.setDropdown(this.ambitoDetalle, by, {
                id_element: 'select_zonas',
                bootstrap_multiselect: true,
                select2: false
            }, false, 'Todos');
        });
    }
}

new SinInternetView();