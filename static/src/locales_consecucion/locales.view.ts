/**
 * Created by Administrador on 3/03/2017.
 */
import {LocalService} from './locales.service'
import {ILocal} from './local.interface';
import UbigeoView from '../ubigeo/ubigeo.view';
import * as utils from '../core/utils';

declare var $: any;
declare var jQuery: any;
class LocalController {
    private localService = new LocalService()
    private local: ILocal;
    private localJsonRules: Object = {
        nombre_local: {
            maxlength: 100
        },
        nombre_via: {
            maxlength: 200
        },
        referencia: {
            maxlength: 100
        },
        n_direccion: {
            maxlength: 4
        },
        km_direccion: {
            maxlength: 3
        },
        mz_direccion: {
            maxlength: 4
        },
        lote_direccion: {
            maxlength: 4
        },
        piso_direccion: {
            number: true,
            range: [1, 999]
        },
        telefono_local_fijo: {
            maxlength: 9
        },
        telefono_local_celular: {
            maxlength: 10,
            validar9: true
        },
        fecha_fin: {
            validateFechaFin: true,
        },
        responsable_nombre: {
            minlength: 9,
        },
        responsable_email: {
            minlength: 1,
        },
        responsable_telefono: {
            maxlength: 9
        },
        responsable_celular: {
            maxlength: 10,
            validar9: true
        },
        cantidad_disponible_aulas: {
            esMenor2: true
        },
        cantidad_disponible_auditorios: {
            esMenor2: true
        },
        cantidad_disponible_sala: {
            esMenor2: true
        },
        cantidad_disponible_oficina: {
            esMenor2: true
        },
        cantidad_disponible_otros: {
            esMenor2: true
        },
        cantidad_usar_aulas: {
            esMenor: true
        },
        cantidad_usar_auditorios: {
            esMenor: true
        },
        cantidad_usar_sala: {
            esMenor: true
        },
        cantidad_usar_oficina: {
            esMenor: true
        },
        cantidad_usar_otros: {
            esMenor: true
        },
    };
    private form_local_validate: any;
    private form_local_serializado: ILocal;

    constructor() {
        new UbigeoView('departamentos', 'provincias', 'distritos', 'zona');
        this.form_local_validate = $('#form_local').validate(utils.validateForm(this.localJsonRules));
        this.getLocales();
        this.setEvents();
        this.addMethodJqueryValidator();
    }

    setEvents() {
        $('#registrar').on('click', () => {
            this.addLocales();
        });
    }

    addMethodJqueryValidator() {
        jQuery.validator.addMethod("validateFechaInicio", (value: any, element: any) => {
            let fechafin = $('input[name="fecha_fin"]').val();
            var part_ff = fechafin.split("/");
            var fin: any = new Date(`${part_ff[1]}/${part_ff[0]}/${part_ff[2]}`);
            var part_fi = value.split("/");
            var inicio: any = new Date(`${part_fi[1]}/${part_fi[0]}/${part_fi[2]}`);

            var f = Date.parse(fin);
            var i = Date.parse(inicio);
            return f >= i
        }, jQuery.validator.format("Fecha de Inicio tiene que ser menor que la Fecha Fin"));

        jQuery.validator.addMethod("esMenor", (value: any, element: any) => {
            var nameelement = $(element).attr('name');
            nameelement = nameelement.replace('usar', 'disponible');
            var val_ne = $('#' + nameelement).val();
            if (value == '') {
                return true
            } else {
                return parseInt(value) <= parseInt(val_ne)
            }

        }, jQuery.validator.format("Debe ser menor a Disponible"));

        jQuery.validator.addMethod("esMenor2", (value: any, element: any) => {
            var nameelement = $(element).attr('name');
            nameelement = nameelement.replace('disponible', 'total');
            var val_ne = $('#' + nameelement).val();
            if (value == '') {
                return true
            } else {
                return parseInt(value) <= parseInt(val_ne)
            }

        }, jQuery.validator.format("Debe ser menor a Total"));
        jQuery.validator.addMethod("validar9", (value: any, element: any) => {
            var count = 0;
            if (value.length > 0) {
                for (let k in value) {
                    if (value[0] == value[parseInt(k) + 1]) {
                        count++;
                    }
                }
            }
            return (count > 5) ? false : true;
        }, jQuery.validator.format("Número no permitido"));
        jQuery.validator.addMethod("validateFechaFin", (value: any, element: any) => {
            let fechafin = $('input[name="fecha_inicio"]').val();
            var part_ff = fechafin.split("/");
            var fin: any = new Date(`${part_ff[1]}/${part_ff[0]}/${part_ff[2]}`);
            var part_fi = value.split("/");
            var inicio: any = new Date(`${part_fi[1]}/${part_fi[0]}/${part_fi[2]}`);

            var f = Date.parse(fin);
            var i = Date.parse(inicio);
            return f <= i
        }, jQuery.validator.format("Fecha de Fin tiene que ser mayor que la Fecha Inicio"));
    }

    getLocales() {
        this.localService.get().done((response) => {
            console.log(response)
        }).fail((error: any) => {
            console.log(error)
        });
    }

    addLocales() {
        console.log(this.form_local_serializado = utils.formToObject(utils.serializeForm('form_local')));
    }

}

new LocalController();
