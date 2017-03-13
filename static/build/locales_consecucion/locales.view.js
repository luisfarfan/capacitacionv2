define(["require", "exports", './locales.service', '../ubigeo/ubigeo.view', '../core/utils'], function (require, exports, locales_service_1, ubigeo_view_1, utils) {
    "use strict";
    var LocalController = (function () {
        function LocalController() {
            this.localService = new locales_service_1.LocalService();
            this.cursoService = new locales_service_1.CursoService();
            this.directoriolocalService = new locales_service_1.DirectorioLocalService();
            this.dirlocalcursoService = new locales_service_1.DirectorioLocalCursoService();
            this.localambienteService = new locales_service_1.LocalAmbienteService();
            this.local = null;
            this.locales = [];
            this.directorioLocal = null;
            this.directorioLocales = null;
            this.localCurso = null;
            this.localesCurso = null;
            this.directoriolocalCurso = null;
            this.localJsonRules = {
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
                    validateFechaFin: true
                },
                responsable_nombre: {
                    minlength: 9
                },
                responsable_email: {
                    minlength: 1
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
                }
            };
            this.form_local_validate = $('#form_local').validate(utils.validateForm(this.localJsonRules));
            this.setEvents();
            this.addMethodJqueryValidator();
            new ubigeo_view_1["default"]('departamentos', 'provincias', 'distritos', 'zona', {
                ccdd: ubigeo.ccdd,
                ccpp: ubigeo.ccpp,
                ccdi: ubigeo.ccdi,
                zona: ubigeo.zona
            });
        }
        LocalController.prototype.setEvents = function () {
            var _this = this;
            $('#etapa').on('change', function () {
                _this.etapa_id = $('#etapa').val();
                _this.getCursos();
            });
            $('#btn_save_local').on('click', function () {
                _this.form_local_validate.form();
                if ($('#cursos').val() == "-1" || $('#cursos').val() == "") {
                    utils.showInfo('Por favor, seleccione un curso');
                    return false;
                }
                if (_this.form_local_validate.valid()) {
                    _this.saveLocales();
                }
            });
            $('#btn_generar_ambientes').on('click', function () {
                _this.generarAmbientes();
            });
            $('#buscarlocalmarco').on('click', function () {
                if ($('#cursos').val() == "-1" || $('#cursos').val() == "") {
                    utils.showInfo('Por favor, seleccione un curso');
                    return false;
                }
                else {
                    _this.filterDirectorioLocal();
                    $('#modal_localesmarco').modal('show');
                }
            });
            $('#buscarlocal').on('click', function () {
                if ($('#cursos').val() == "-1" || $('#cursos').val() == "") {
                    utils.showInfo('Por favor, seleccione un curso');
                    return false;
                }
                else {
                    _this.filterLocal();
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
            }, function (chosen_date) {
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
            }, function (chosen_date) {
                $('input[name="fecha_fin"]').val(chosen_date.format('DD/MM/YYYY'));
            });
        };
        LocalController.prototype.addMethodJqueryValidator = function () {
            jQuery.validator.addMethod("validateFechaInicio", function (value, element) {
                var fechafin = $('input[name="fecha_fin"]').val();
                var part_ff = fechafin.split("/");
                var fin = new Date(part_ff[1] + "/" + part_ff[0] + "/" + part_ff[2]);
                var part_fi = value.split("/");
                var inicio = new Date(part_fi[1] + "/" + part_fi[0] + "/" + part_fi[2]);
                var f = Date.parse(fin);
                var i = Date.parse(inicio);
                return f >= i;
            }, jQuery.validator.format("Fecha de Inicio tiene que ser menor que la Fecha Fin"));
            jQuery.validator.addMethod("esMenor", function (value, element) {
                var nameelement = $(element).attr('name');
                nameelement = nameelement.replace('usar', 'disponible');
                var val_ne = $('#' + nameelement).val();
                if (value == '') {
                    return true;
                }
                else {
                    return parseInt(value) <= parseInt(val_ne);
                }
            }, jQuery.validator.format("Debe ser menor a Disponible"));
            jQuery.validator.addMethod("esMenor2", function (value, element) {
                var nameelement = $(element).attr('name');
                nameelement = nameelement.replace('disponible', 'total');
                var val_ne = $('#' + nameelement).val();
                if (value == '') {
                    return true;
                }
                else {
                    return parseInt(value) <= parseInt(val_ne);
                }
            }, jQuery.validator.format("Debe ser menor a Total"));
            jQuery.validator.addMethod("validar9", function (value, element) {
                var count = 0;
                if (value.length > 0) {
                    for (var k in value) {
                        if (value[0] == value[parseInt(k) + 1]) {
                            count++;
                        }
                    }
                }
                return (count > 5) ? false : true;
            }, jQuery.validator.format("Número no permitido"));
            jQuery.validator.addMethod("validateFechaFin", function (value, element) {
                var fechafin = $('input[name="fecha_inicio"]').val();
                var part_ff = fechafin.split("/");
                var fin = new Date(part_ff[1] + "/" + part_ff[0] + "/" + part_ff[2]);
                var part_fi = value.split("/");
                var inicio = new Date(part_fi[1] + "/" + part_fi[0] + "/" + part_fi[2]);
                var f = Date.parse(fin);
                var i = Date.parse(inicio);
                return f <= i;
            }, jQuery.validator.format("Fecha de Fin tiene que ser mayor que la Fecha Inicio"));
        };
        LocalController.prototype.getCursos = function () {
            var _this = this;
            this.cursoService.get(this.etapa_id).done(function (cursos) {
                _this.cursos = cursos;
                utils.setDropdown(_this.cursos, { id: 'id_curso', text: ['nombre_curso'] }, {
                    id_element: 'cursos',
                    bootstrap_multiselect: true,
                    select2: false
                });
            });
        };
        LocalController.prototype.saveLocales = function () {
            var _this = this;
            this.form_local_serializado = utils.formToObject(utils.serializeForm('form_local'));
            this.form_local_serializado.ubigeo = "" + $('#departamentos').val() + $('#provincias').val() + $('#distritos').val();
            if (this.directorioLocal == null && this.local == null) {
                this.directoriolocalService.add(this.form_local_serializado).done(function (directoriolocal) {
                    _this.directorioLocal = directoriolocal;
                    _this.dirlocalcursoService.add({
                        local: _this.directorioLocal.id_local,
                        curso: $('#cursos').val()
                    }).done(function (directoriolocalCurso) {
                        _this.directoriolocalCurso = directoriolocalCurso;
                        utils.showSwalAlert('Se agrego el Local al Directorio!', 'Exito!', 'success');
                        _this.form_local_validate.resetForm();
                    }).fail();
                }).fail(function () {
                    utils.showSwalAlert('Errorrrr!!', 'Error', 'error');
                });
            }
            else if (this.directorioLocal) {
                this.directoriolocalService.update(this.directorioLocal.id_local, this.form_local_serializado).done(function (directoriolocal) {
                    _this.directorioLocal = directoriolocal;
                    utils.showSwalAlert('El Local del Directorio se ha editado con éxito!', 'Exito!', 'success');
                });
            }
            else if (this.local) {
                this.localService.update(this.local.id_local, this.form_local_serializado).done(function (local) {
                    _this.local = local;
                });
            }
        };
        LocalController.prototype.generarAmbientes = function () {
            var _this = this;
            var object = {};
            if (this.directorioLocal) {
                object = {
                    'local': this.directoriolocalCurso.local,
                    'curso': this.directoriolocalCurso.curso,
                    'cantidad_usar_aulas': this.directorioLocal.cantidad_usar_aulas,
                    'cantidad_usar_auditorios': this.directorioLocal.cantidad_usar_auditorios,
                    'cantidad_usar_sala': this.directorioLocal.cantidad_usar_sala,
                    'cantidad_usar_oficina': this.directorioLocal.cantidad_usar_oficina,
                    'cantidad_usar_computo': this.directorioLocal.cantidad_usar_computo,
                    'cantidad_usar_otros': this.directorioLocal.cantidad_usar_otros,
                    'directorio': 1
                };
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
                };
            }
            this.localambienteService.generarAmbientes(object).done(function () {
                _this.setDirectorioLocalAmbientes();
            });
        };
        LocalController.prototype.filterLocal = function () {
            var _this = this;
            var curso = $('#cursos').val();
            var ubigeo = "" + $('#departamentos').val() + $('#provincias').val() + $('#distritos').val();
            var zona = $('#zona').val() == "-1" ? null : $('#zona').val();
            this.localService.getbyAmbienteGeografico(curso, ubigeo, zona).done(function (localcurso) {
                _this.localesCurso = localcurso;
                _this.locales = [];
                _this.localesCurso.map(function (value, index) { return _this.locales.push(value.local); });
                utils.drawTable(_this.locales, ['nombre_local', 'nombre_via', 'referencia', 'zona_ubicacion_local'], 'id_local', {
                    edit_name: 'local_edit',
                    delete_name: 'local_delete',
                    enumerar: false,
                    table_id: 'tabla_locales_filter',
                    datatable: true,
                    checkbox: '',
                    checked: false
                });
                $('[name="local_edit"]').on('click', function (element) {
                    _this.setDirectorioLocal($(element.currentTarget).data('value'), false);
                    _this.directorioLocal = null;
                    _this.directoriolocalCurso = null;
                    $('#modal_localesmarco').modal('hide');
                });
                $('[name="local_delete"]').on('click', function (element) {
                    utils.alert_confirm(function () {
                    }, 'Esta quitar este local de los locales seleccionados', 'error');
                });
            });
        };
        LocalController.prototype.filterDirectorioLocal = function () {
            var _this = this;
            var curso = $('#cursos').val();
            var ubigeo = "" + $('#departamentos').val() + $('#provincias').val() + $('#distritos').val();
            var zona = $('#zona').val() == "-1" ? null : $('#zona').val();
            this.directoriolocalService.getbyAmbienteGeografico(curso, ubigeo, zona).done(function (directorioLocales) {
                _this.localService.getbyAmbienteGeografico(curso, ubigeo, zona).done(function (localcurso) {
                    _this.localesCurso = localcurso;
                    _this.locales = [];
                    console.log(_this.localesCurso);
                    _this.localesCurso.map(function (value, index) { return _this.locales.push(value.local); });
                    _this.filterLocal();
                    _this.directorioLocales = directorioLocales;
                    var directoriolocales_ids = [];
                    _this.locales.map(function (value, index) { return directoriolocales_ids.push(value.id_directoriolocal); });
                    utils.drawTable(_this.directorioLocales, ['nombre_local', 'zona_ubicacion_local'], 'id_local', {
                        edit_name: 'directoriolocal_edit',
                        delete_name: '',
                        enumerar: true,
                        table_id: 'tabla_directorio_locales_filter',
                        datatable: true,
                        checkbox: 'chk_directoriolocal_seleccionado',
                        checked: false
                    });
                    $('[name="directoriolocal_edit"]').off('click');
                    $('[name="chk_directoriolocal_seleccionado"]').off('click');
                    $('[name="directoriolocal_edit"]').on('click', function (element) {
                        _this.setDirectorioLocal($(element.currentTarget).data('value'));
                        _this.local = null;
                        _this.localCurso = null;
                        $('#modal_localesmarco').modal('hide');
                    });
                    $('[name="chk_directoriolocal_seleccionado"]').on('click', function (element) {
                        utils.alert_confirm(function () {
                            _this.directoriolocalService.seleccionarDirectorio($(element.currentTarget).val(), $('#cursos').val()).done(function () {
                                $(element.currentTarget).prop('checked', true);
                            });
                        }, 'Esta seguro de guardar este elemento?', 'info', $(element.currentTarget).prop('checked', false));
                    });
                    var chk_directoriolocal = $('[name="chk_directoriolocal_seleccionado"]');
                    chk_directoriolocal.map(function (index, value) {
                        directoriolocales_ids.indexOf(parseInt(value.value)) != -1 ? $(value).prop('checked', true) && $(value).prop('disabled', true) : '';
                    });
                });
            });
        };
        LocalController.prototype.setDirectorioLocal = function (local_id, is_directorio) {
            var _this = this;
            if (is_directorio === void 0) { is_directorio = true; }
            var curso = $('#cursos').val();
            if (is_directorio) {
                this.directoriolocalService.setDirectorioLocal(curso, local_id).done(function (directoriolocal) {
                    console.log(_this.directoriolocalCurso);
                    _this.directoriolocalCurso = directoriolocal[0];
                    _this.directorioLocal = _this.directoriolocalCurso.local;
                    _this.setForm(_this.directorioLocal);
                });
            }
            else {
                this.localesCurso.map(function (value, index) {
                    if (value.local.id_local == local_id) {
                        _this.local = value.local;
                        _this.localCurso = value;
                    }
                });
                this.setForm(this.local);
            }
        };
        LocalController.prototype.setForm = function (obj) {
            utils.objectToForm(obj);
            this.setDirectorioLocalAmbientes();
        };
        LocalController.prototype.setDirectorioLocalAmbientes = function () {
            var _this = this;
            if (this.local) {
                this.localService.getAmbientes(this.localCurso.id).done(function (ambientes) {
                    _this.localCurso.ambienteslocalcurso = ambientes;
                    console.log(_this.localesCurso);
                    _this.formatAmbienteCurso(ambientes);
                }).fail();
            }
            else {
                this.directoriolocalService.getAmbientes(this.directoriolocalCurso.id).done(function (ambientes) {
                    _this.directoriolocalCurso.ambienteslocalcurso = ambientes;
                    console.log(_this.localesCurso);
                    _this.formatAmbienteCurso(ambientes);
                }).fail();
            }
        };
        LocalController.prototype.formatAmbienteCurso = function (ambientes) {
            var _this = this;
            var html = "";
            ambientes.map(function (value, index) {
                html += "<tr>\n                        <td>" + (index + 1) + "</td><td>" + value.numero + "</td><td>" + value.id_ambiente.nombre_ambiente + "</td>\n                        <td><input type=\"number\" name=\"capacidad_ambiente\" class=\"form-control\" value=\"" + (value.capacidad == null ? '' : value.capacidad) + "\"></td>\n                        <td><input type=\"number\" name=\"piso_ambiente\" class=\"form-control\" value=\"" + (value.n_piso == null ? '' : value.n_piso) + "\"></td>\n                        <td>\n                            <ul class=\"icons-list\">\n                                <li name=\"li_save_capacidad_piso\" data-value=\"" + value.id_localambiente + "\" class=\"text-primary-600\"><a><i class=\"icon-pencil7\"></i></a></li>\n                            </ul>\n                        </td>\n                     </tr>";
            });
            if ($.fn.DataTable.isDataTable('#tabla_aulas')) {
                $('#tabla_aulas').DataTable().destroy();
                $('#tabla_aulas').find('tbody').html(html);
                $('#tabla_aulas').DataTable();
                $('.dataTables_length select').select2({
                    minimumResultsForSearch: Infinity,
                    width: 'auto'
                });
            }
            else {
                $('#tabla_aulas').find('tbody').html(html);
                $('#tabla_aulas').DataTable();
            }
            $('[name="li_save_capacidad_piso"]').on('click', function (element) {
                var li = $(element.currentTarget);
                var tr = li.parent().parent().parent();
                var capacidad = tr.find('[name="capacidad_ambiente"]').val();
                var piso = tr.find('[name="piso_ambiente"]').val();
                var pk = li.data('value');
                if (_this.local) {
                    _this.localService.saveDetalleAmbiente(pk, {
                        capacidad: capacidad,
                        n_piso: piso
                    }).done(function () {
                        utils.showSwalAlert('Se grabo con éxito!', 'Correcto', 'success');
                    });
                }
                else {
                    _this.directoriolocalService.saveDetalleAmbiente(pk, {
                        capacidad: capacidad,
                        n_piso: piso
                    }).done(function () {
                        utils.showSwalAlert('Se grabo con éxito!', 'Correcto', 'success');
                    });
                }
            });
        };
        return LocalController;
    }());
    new LocalController();
});
//# sourceMappingURL=locales.view.js.map