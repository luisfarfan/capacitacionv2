/**
 * Created by Administrador on 3/03/2017.
 */
import {
    LocalService,
    LocalAmbienteService,
    DirectorioLocalService,
    DirectorioLocalCursoService,
    LocalCurso,
    CursoService
} from './locales.service'
import {ILocal, ILocalAmbiente, ILocalCurso, ICurso} from './local.interface';
import UbigeoView from '../ubigeo/ubigeo.view';
import * as utils from '../core/utils';
import {IUbigeo} from "../ubigeo/ubigeo.view";
import {CursoInyection} from '../comun.utils';


declare var $: any;
declare var jQuery: any;
declare var ubigeo: IUbigeo;
class LocalController {
    private ubigeo: any = {};
    private localService = new LocalService();
    private cursoService = new CursoService();
    private directoriolocalService = new DirectorioLocalService();
    private dirlocalcursoService = new DirectorioLocalCursoService();
    private localambienteService = new LocalAmbienteService();
    private etapa_id: number;
    private local: ILocal = null;
    private locales: ILocal[] = [];
    private directorioLocal: ILocal = null;
    private directorioLocales: ILocal[] = null;
    private localCurso: ILocalCurso = null;
    private localesCurso: ILocalCurso[] = null;
    private directoriolocalCurso: ILocalCurso = null;
    private cursos: ICurso[];
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
    private inputs: any;

    private cursoInyection: CursoInyection;
    private ambito: any = {};

    private _UBIGEO: any = {ccdd: null, ccpp: null, ccdi: null, zona: null};

    constructor() {
        this.cursoInyection = new CursoInyection();
        this.form_local_validate = $('#form_local').validate(utils.validateForm(this.localJsonRules));
        this.setEvents();
        this.addMethodJqueryValidator();
        this.setUbigeo();
        new UbigeoView('departamentos', 'provincias', 'distritos', 'zona', {
            ccdd: ubigeo.ccdd,
            ccpp: ubigeo.ccpp,
            ccdi: ubigeo.ccdi,
            zona: ubigeo.zona,
        });
        this.inputs = $('input[type="text"]');
        $('#departamentos').on('change', () => {
            let val = $('#departamentos').val();
            if (val != "-1") {
                this._UBIGEO.ccdd = val;
                this._UBIGEO.ccpp = null;
                this._UBIGEO.ccdi = null;
                this._UBIGEO.zona = null;
            } else {
                this._UBIGEO.ccdd = null;
                this._UBIGEO.ccpp = null;
                this._UBIGEO.ccdi = null;
                this._UBIGEO.zona = null;
            }
            this.saveUbigeo()
        });
        $('#provincias').on('change', () => {
            let val = $('#provincias').val();
            if (val != "-1") {
                this._UBIGEO.ccpp = val;
                this._UBIGEO.ccdi = null;
                this._UBIGEO.zona = null;
            } else {
                this._UBIGEO.ccpp = null;
                this._UBIGEO.ccdi = null;
                this._UBIGEO.zona = null;
            }
            this.saveUbigeo()
        });
        $('#distritos').on('change', () => {
            let val = $('#distritos').val();
            if (val != "-1") {
                this._UBIGEO.ccdi = val;
                this._UBIGEO.zona = null;
            } else {
                this._UBIGEO.ccdi = null;
                this._UBIGEO.zona = null;
            }
            this.saveUbigeo()
        });
    }

    setUbigeo() {
        localStorage.setItem('ubigeo', JSON.stringify({
            ccdd: ubigeo.ccdd == '' ? null : ubigeo.ccdd,
            ccpp: ubigeo.ccpp == '' ? null : ubigeo.ccpp,
            ccdi: ubigeo.ccdi == '' ? null : ubigeo.ccdi,
            zona: ubigeo.zona == '' ? null : ubigeo.zona
        }))
    }

    getUbigeo() {
        if (localStorage.getItem('ubigeo') !== null) {
            this._UBIGEO = JSON.parse(localStorage.getItem('ubigeo'));
        }

    }

    ubigeoUsuarioToUbigeoRankeo() {

    }

    saveUbigeo() {
        localStorage.setItem('ubigeo', JSON.stringify(this._UBIGEO))
    }

    setEvents() {
        $('input[type="text"]').on('keyup', (ev: JQueryEventObject) => {
            let texto: string = `${$(ev.target).val()}`.toUpperCase();
            $(ev.target).val(texto);
            if (ev.keyCode == 13) {
                let indexInput: number = this.inputs.index($(ev.target));
                let nextInput: any = $(this.inputs)[indexInput + 1];
                $(nextInput).focus();
            }
        });

        $('#reset').on('click', () => {
            this.resetForm();
            $('#modal_localesmarco').modal('hide');
        })

        $('#etapa').on('change', () => {
            this.etapa_id = $('#etapa').val();
            this.getCursos();
        });
        $('#btn_save_local').on('click', () => {
            this.form_local_validate.form();
            if ($('#cursos').val() == "-1" || $('#cursos').val() == "") {
                utils.showInfo('Por favor, seleccione un curso');
                return false
            }
            if (this.form_local_validate.valid()) {
                this.saveLocales()
            } else {
                $('#modal_erroresformulario').modal('show');
                let ul: string = '';
                this.form_local_validate.errorList.map((value: any) => {
                    let name = $(value.element).parent().parent().find('label').text()
                    let message = value.message;
                    ul += `<li><a href="#"><span class="text-bold">${name}:</span> ${message}</a></li>`;
                })
                $('#errores').html(ul);
            }
        });
        $('#btn_generar_ambientes').on('click', () => {
            this.form_local_validate.form()
            if ($('#cursos').val() == "-1" || $('#cursos').val() == "") {
                utils.showInfo('Por favor, seleccione un curso');
                return false
            }
            if (this.form_local_validate.valid()) {
                this.saveLocales(true)
            }
            //this.generarAmbientes();
        });
        $('#buscarlocalmarco').on('click', () => {
            if ($('#cursos').val() == "-1" || $('#cursos').val() == "") {
                utils.showInfo('Por favor, seleccione un curso');
                return false
            } else {
                this.filterDirectorioLocal();
                $('#modal_localesmarco').modal('show');
            }
        });
        $('#buscarlocal').on('click', () => {
            if ($('#cursos').val() == "-1" || $('#cursos').val() == "") {
                utils.showInfo('Por favor, seleccione un curso');
                return false
            } else {
                this.filterLocal();
                $('#modal_localesbyubigeo').modal('show');
            }
        });
        $('#tabla_directorio_locales_filter').DataTable();

        $('input[name="fecha_inicio"]').daterangepicker({
            //"minDate": fecha_hoy,
            "minDate": "19/01/2017",
            "maxDate": "31/10/2017",
            singleDatePicker: true,
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, function (chosen_date: any) {
            $('input[name="fecha_inicio"]').val(chosen_date.format('DD/MM/YYYY'));
        });

        $('input[name="fecha_fin"]').daterangepicker({
            //"minDate": fecha_hoy,
            "minDate": "19/01/2017",
            "maxDate": "31/10/2017",
            singleDatePicker: true,
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, function (chosen_date: any) {
            $('input[name="fecha_fin"]').val(chosen_date.format('DD/MM/YYYY'));
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

    getCursos() {
        this.cursoService.get(this.etapa_id).done((cursos) => {
            this.cursos = cursos
            utils.setDropdown(this.cursos, {id: 'id_curso', text: ['nombre_curso']}, {
                id_element: 'cursos',
                bootstrap_multiselect: true,
                select2: false
            })
        })
    }

    saveLocales(isgenerar: boolean = false) {
        let texto: string = isgenerar ? 'Se generarón los ambientes a usar!' : '';

        this.form_local_serializado = utils.formToObject(utils.serializeForm('form_local'));
        if (this.form_local_serializado.zona_ubicacion_local == "-1") {
            utils.showInfo('Por favor seleccione la ubicación del Local');
            //$('#zona_ubicacion_local').select2('open');
            return false;
        }
        this.form_local_serializado.ubigeo = `${$('#departamentos').val()}${$('#provincias').val()}${$('#distritos').val()}`
        if (this.directorioLocal == null && this.local == null) {
            this.directoriolocalService.add(this.form_local_serializado).done((directoriolocal: ILocal) => {
                this.directorioLocal = directoriolocal;
                this.dirlocalcursoService.add({
                    local: this.directorioLocal.id_local,
                    curso: $('#cursos').val()
                }).done((directoriolocalCurso: ILocalCurso) => {
                    this.directoriolocalCurso = directoriolocalCurso
                    isgenerar ? utils.showSwalAlert(texto, 'Exito', 'success') : utils.showSwalAlert('Se agrego el Local al Directorio!', 'Exito!', 'success');
                    this.form_local_validate.resetForm();
                    this.generarAmbientes();
                }).fail()
            }).fail(() => {
                utils.showSwalAlert('Errorrrr!!', 'Error', 'error');
            });
        } else if (this.directorioLocal) {
            this.directoriolocalService.update(this.directorioLocal.id_local, this.form_local_serializado).done((directoriolocal: ILocal) => {
                this.directorioLocal = directoriolocal;
                isgenerar ? utils.showSwalAlert(texto, 'Exito', 'success') : utils.showSwalAlert('El Local del Directorio se ha editado con éxito!', 'Exito!', 'success');
                this.generarAmbientes();
            });
        } else if (this.local) {
            this.localService.update(this.local.id_local, this.form_local_serializado).done((local) => {
                this.local = local;
                isgenerar ? utils.showSwalAlert(texto, 'Exito', 'success') : utils.showSwalAlert('El Local del Directorio se ha editado con éxito!', 'Exito!', 'success')
                this.generarAmbientes();
            })
        }
    }

    getPartUbigeo(ubigeo: string) {
        this.ambito.ccdd = ubigeo.substring(0, 2)
        this.ambito.ccpp = ubigeo.substring(2, 4)
        this.ambito.ccdi = ubigeo.substring(4, 6)

        $('#departamentos').val(this.ambito.ccdd).trigger('change');
        $('#provincias').val(this.ambito.ccpp).trigger('change');
        $('#distritos').val(this.ambito.ccdi).trigger('change');
    }

    generarAmbientes() {
        let object: Object = {}
        debugger
        if (this.directorioLocal) {
            object = {
                'local': this.directorioLocal.id_local,
                'curso': this.directoriolocalCurso.curso,
                'cantidad_usar_aulas': this.directorioLocal.cantidad_usar_aulas,
                'cantidad_usar_auditorios': this.directorioLocal.cantidad_usar_auditorios,
                'cantidad_usar_sala': this.directorioLocal.cantidad_usar_sala,
                'cantidad_usar_oficina': this.directorioLocal.cantidad_usar_oficina,
                'cantidad_usar_computo': this.directorioLocal.cantidad_usar_computo,
                'cantidad_usar_otros': this.directorioLocal.cantidad_usar_otros,
                'directorio': 1
            }
        }
        if (this.local) {
            object = {
                'local': this.localCurso.local.id_local,
                'curso': this.localCurso.curso,
                'cantidad_usar_aulas': this.local.cantidad_usar_aulas,
                'cantidad_usar_auditorios': this.local.cantidad_usar_auditorios,
                'cantidad_usar_sala': this.local.cantidad_usar_sala,
                'cantidad_usar_oficina': this.local.cantidad_usar_oficina,
                'cantidad_usar_computo': this.local.cantidad_usar_computo,
                'cantidad_usar_otros': this.local.cantidad_usar_otros,
                'directorio': 0
            }
        }
        this.localambienteService.generarAmbientes(object).done(() => {
            this.setDirectorioLocalAmbientes();
        });
    }

    setAmbito() {
        let ccdd = $('#departamentos').val();
        let ccpp = $('#provincias').val();
        let ccdi = $('#distritos').val();
        let zona = $('#zona').val();
        if (ccdd != "-1" && ccdd != "") {
            this.ubigeo['ccdd'] = ccdd;
        }
        if (ccpp != "-1" && ccpp != "") {
            this.ubigeo['ccpp'] = ccpp;
        }
        if (ccdi != "-1" && ccdi != "") {
            this.ubigeo['ccdi'] = ccdi;
        }
        if (zona != "-1" && zona != "") {
            this.ubigeo['zona'] = zona;
        }
    }

    filterLocal() {
        let curso: number = $('#cursos').val();
        this.setAmbito();
        this.localService.getbyAmbienteGeografico(curso, this.ubigeo).done((localcurso: ILocalCurso[]) => {
            this.localesCurso = localcurso
            this.locales = [];
            this.localesCurso.map((value: ILocalCurso, index: number) => this.locales.push(value.local));
            utils.drawTable(this.locales, ['nombre_local', 'zona_ubicacion_local', 'nombre_via', 'n_direccion', 'referencia'], 'id_local', {
                edit_name: 'local_edit',
                delete_name: 'local_delete',
                enumerar: false,
                table_id: 'tabla_locales_filter',
                datatable: true,
                checkbox: '',
                checked: false
            });
            $('[name="local_edit"]').on('click', (element: JQueryEventObject) => {
                this.setDirectorioLocal($(element.currentTarget).data('value'), false);
                this.directorioLocal = null;
                this.directoriolocalCurso = null;
                $('#modal_localesbyubigeo').modal('hide');
            });
            $('[name="local_delete"]').on('click', (element: JQueryEventObject) => {
                utils.alert_confirm(() => this.deleteLocal($(element.currentTarget).data('value')), 'Esta seguro de quitar este local de los locales seleccionados?', 'error');

            });
        });
    }

    filterDirectorioLocal() {
        let curso: number = $('#cursos').val();
        this.setAmbito();
        this.directoriolocalService.getbyAmbienteGeografico(curso, this.ubigeo).done((directorioLocales: ILocal[]) => {
            this.localService.getbyAmbienteGeografico(curso, this.ubigeo).done((localcurso: ILocalCurso[]) => {
                this.localesCurso = localcurso;
                this.locales = [];
                this.localesCurso.map((value: ILocalCurso, index: number) => this.locales.push(value.local))
                this.filterLocal();
                this.directorioLocales = directorioLocales;
                let directoriolocales_ids: Array<number> = []
                this.locales.map((value: ILocal, index: number) => directoriolocales_ids.push(value.id_directoriolocal));
                utils.drawTable(this.directorioLocales, ['nombre_local', 'zona_ubicacion_local'], 'id_local', {
                    edit_name: 'directoriolocal_edit',
                    delete_name: '',
                    enumerar: true,
                    table_id: 'tabla_directorio_locales_filter',
                    datatable: true,
                    checkbox: 'chk_directoriolocal_seleccionado',
                    checked: false,
                });
                $('[name="directoriolocal_edit"]').off('click')
                $('[name="chk_directoriolocal_seleccionado"]').off('click');
                $('[name="directoriolocal_edit"]').on('click', (element: JQueryEventObject) => {
                    this.setDirectorioLocal($(element.currentTarget).data('value'));
                    this.local = null;
                    this.localCurso = null;
                    $('#modal_localesmarco').modal('hide');
                });
                $('[name="chk_directoriolocal_seleccionado"]').on('click', (element: JQueryEventObject) => {
                    utils.alert_confirm(() => {
                        this.directoriolocalService.seleccionarDirectorio($(element.currentTarget).val(), $('#cursos').val()).done(() => {
                            $(element.currentTarget).prop('checked', true)
                        });
                    }, 'Esta seguro de guardar?', 'info', $(element.currentTarget).prop('checked', false))
                });
                let chk_directoriolocal: any = $('[name="chk_directoriolocal_seleccionado"]');
                chk_directoriolocal.map((index: number, value: any) => {
                    directoriolocales_ids.indexOf(parseInt(value.value)) != -1 ? $(value).prop('checked', true) && $(value).prop('disabled', true) : '';
                })
            });
        })
    }

    setDirectorioLocal(local_id: number, is_directorio: boolean = true) {
        let curso: number = $('#cursos').val();
        if (is_directorio) {
            this.directoriolocalService.setDirectorioLocal(curso, local_id).done((directoriolocal: ILocalCurso[]) => {
                this.directoriolocalCurso = directoriolocal[0];
                this.getPartUbigeo(this.directoriolocalCurso.local.ubigeo);
                this.directorioLocal = this.directoriolocalCurso.local;
                this.setForm(this.directorioLocal);
            });
        } else {
            this.localesCurso.map((value: ILocalCurso, index: number) => {
                if (value.local.id_local == local_id) {
                    this.local = value.local
                    this.localCurso = value;
                    this.getPartUbigeo(this.local.ubigeo);
                    this.setForm(this.local);
                }
            });
        }
    }

    setForm(obj: ILocal) {
        utils.objectToForm(obj);
        this.setDirectorioLocalAmbientes();
    }

    setDirectorioLocalAmbientes() {
        if (this.local) {
            this.localService.getAmbientes(this.localCurso.id).done((ambientes: ILocalAmbiente[]) => {
                this.localCurso.ambienteslocalcurso = ambientes;
                console.log(this.localesCurso);
                this.formatAmbienteCurso(ambientes)
            }).fail()
        } else {
            this.directoriolocalService.getAmbientes(this.directoriolocalCurso.id).done((ambientes: ILocalAmbiente[]) => {
                this.directoriolocalCurso.ambienteslocalcurso = ambientes;
                console.log(this.localesCurso);
                this.formatAmbienteCurso(ambientes)
            }).fail()
        }

    }

    formatAmbienteCurso(ambientes: ILocalAmbiente[]) {
        let html: string = ``;
        ambientes.map((value: ILocalAmbiente, index: number) => {
            html += `<tr>
                        <td>${index + 1}</td><td>${value.id_ambiente.nombre_ambiente}</td><td>${value.numero}</td>
                        <td><input type="number" name="capacidad_ambiente" class="form-control" value="${value.capacidad == null ? '' : value.capacidad}"></td>
                        <td><input type="number" name="piso_ambiente" class="form-control" value="${value.n_piso == null ? '' : value.n_piso}"></td>
                        <td>
                            <ul class="icons-list">
                                <li name="li_save_capacidad_piso" data-value="${value.id_localambiente}" class="text-primary-600"><a><i class="icon-pencil7"></i></a></li>
                            </ul>
                        </td>
                     </tr>`
        });
        if ($.fn.DataTable.isDataTable('#tabla_aulas')) {
            $('#tabla_aulas').DataTable().destroy()
            $('#tabla_aulas').find('tbody').html(html);
            $('#tabla_aulas').DataTable()
            $('.dataTables_length select').select2({
                minimumResultsForSearch: Infinity,
                width: 'auto'
            });
        } else {
            $('#tabla_aulas').find('tbody').html(html);
            $('#tabla_aulas').DataTable();
        }
        $('[name="li_save_capacidad_piso"]').on('click', (element: JQueryEventObject) => {
            let li: any = $(element.currentTarget);
            let tr: any = li.parent().parent().parent();
            let capacidad: number = tr.find('[name="capacidad_ambiente"]').val()
            let piso: number = tr.find('[name="piso_ambiente"]').val();
            let pk: number = li.data('value');
            if (this.local) {
                this.localService.saveDetalleAmbiente(pk, {
                    capacidad: capacidad,
                    n_piso: piso
                }).done(() => {
                    utils.showSwalAlert('Se grabo con éxito!', 'Correcto', 'success');
                });
            } else {
                this.directoriolocalService.saveDetalleAmbiente(pk, {
                    capacidad: capacidad,
                    n_piso: piso
                }).done(() => {
                    utils.showSwalAlert('Se grabo con éxito!', 'Correcto', 'success');
                });
            }
        });
    }

    deleteLocal(id_local: number) {
        this.localService.delete(id_local).done((deleted) => {
            $('#modal_localesbyubigeo').modal('hide');
        })
    }

    resetForm() {
        this.local = null;
        this.directorioLocal = null;
        let table = $('#tabla_aulas').DataTable()
        table.destroy();
        $('#tabla_aulas').find('tbody').html('');

        $('#form_local')[0].reset();
    }
}

new LocalController();
