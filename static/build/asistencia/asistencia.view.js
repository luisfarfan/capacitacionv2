define(["require", "exports", "asistencia.service", "../distribucion/distribucion.service", "../comun.utils", "../core/utils"], function (require, exports, asistencia_service_1, distribucion_service_1, comun_utils_1, utils) {
    "use strict";
    var AsistenciaView = (function () {
        function AsistenciaView() {
            var _this = this;
            this.localesAmbientes = [];
            this.localAmbienteSelected = null;
            this.rangoFechas = [];
            this.personalparaBaja = [];
            this.personaldadadeBaja = [];
            this.personalContingencia = [];
            this.pea_id = null;
            this.asistenciaService = new asistencia_service_1.AsistenciaService();
            this.personalService = new asistencia_service_1.PersonalService();
            this.cursoInyection = new comun_utils_1.CursoInyection();
            this.distribucionService = new distribucion_service_1.DistribucionService();
            $('#cursos').on('change', function (element) {
                var curso_id = $(element.currentTarget).val();
                $('#p_curso_actual').text($('#cursos :selected').text());
                _this.getAulas(curso_id);
            });
            $('#select_aulas_asignadas').on('change', function (element) {
                var selected = $(element.currentTarget).val();
                if (selected == '') {
                    _this.localAmbienteSelected = null;
                }
                else {
                    _this.localesAmbientes.map(function (value, index) { return value.id_localambiente == selected ? _this.localAmbienteSelected = value : ''; });
                    $('#span_nombre_local').text("" + _this.localAmbienteSelected.localcurso.local.nombre_local);
                    $('#span_direccion').text("" + _this.localAmbienteSelected.localcurso.local.referencia);
                    $('#span_fecha_inicio').text("" + _this.localAmbienteSelected.localcurso.local.fecha_inicio);
                    $('#span_aula').text("" + _this.localAmbienteSelected.numero);
                    _this.asistenciaService.getRangoFechas(_this.localAmbienteSelected.localcurso.local.fecha_inicio, _this.localAmbienteSelected.localcurso.local.fecha_fin).done(function (fechasRango) {
                        _this.rangoFechas = fechasRango;
                        _this.drawHeaderFechas();
                        _this.asistenciaService.getPersonalAsistenciaDetalle(_this.localAmbienteSelected.id_localambiente).done(function (personalAsistencia) {
                            _this.personalAsistencia = personalAsistencia;
                            _this.setPersonalParaBaja(true);
                            _this.drawPersonal();
                            _this.getContingencia();
                        });
                    });
                }
            });
            $('#span_nombre_instructor').text($('#span_usuario_nombre').text());
            $('#btn_save_asistencia').on('click', function () {
                _this.saveAsistencia();
            });
            $('#btn_bajas_altas').on('click', function () {
                $('#modal_bajas_altas').modal('show');
            });
            $('#btn_dar_baja').on('click', function () {
                _this.darBaja();
            });
            $('#btn_dar_alta').on('click', function (element) {
                _this.darAlta(_this.pea_id);
            });
        }
        AsistenciaView.prototype.setPersonalParaBaja = function (draw) {
            var _this = this;
            if (draw === void 0) { draw = false; }
            this.personalparaBaja = [];
            this.personaldadadeBaja = [];
            this.personalAsistencia.map(function (value, index) {
                if (value.id_pea.baja_estado == 0) {
                    _this.personalparaBaja.push(value.id_pea);
                }
                if (value.id_pea.baja_estado == 1) {
                    _this.personaldadadeBaja.push(value.id_pea);
                }
            });
            if (draw) {
                utils.setDropdown(this.personalparaBaja, {
                    id: 'id_pea',
                    text: ['dni', 'ape_paterno', 'ape_materno', 'nombre']
                }, { id_element: 'select_personal_para_baja', bootstrap_multiselect: false, select2: true });
                var html_1 = '';
                this.personaldadadeBaja.map(function (value, index) {
                    var alta = "<td>-</td><td>-</td><td>-</td><td>-</td><td>\n                                    <button type=\"button\" data-popup=\"tooltip\" title=\"Dar de alta\" name=\"btn_dar_alta\"\n                                    data-value=\"" + value.id_pea + "\"\n                                    class=\"btn btn-primary active btn-icon btn-rounded legitRipple\"><i class=\"icon-thumbs-up2\"></i></button>\n                                    </td>";
                    if (value.id_pea_reemplazo) {
                        alta = "<td>" + value.id_pea_reemplazo.ape_paterno + "</td>\n                            <td>" + value.id_pea_reemplazo.ape_materno + "</td>\n                            <td>" + value.id_pea_reemplazo.nombre + "</td>\n                            <td>" + value.id_pea_reemplazo.dni + "</td>\n                            <td></td>";
                    }
                    html_1 += "<tr>\n                           <td rowspan=\"2\">" + (index + 1) + "</td>\n                           <td rowspan=\"2\">" + value.id_cargofuncional.nombre_funcionario + "</td>\n                           <td style=\"background-color:#ffc1c1\">BAJA</td>\n                           <td>" + value.ape_paterno + "</td>\n                           <td>" + value.ape_materno + "</td>\n                           <td>" + value.nombre + "</td>\n                           <td>" + value.dni + "</td>\n                           <td></td>\n                         </tr>\n                         <tr>\n                            <td style=\"background-color:#96e638\">ALTA</td>\n                             " + alta + "\n                         </tr>";
                });
                $('#tabla_baja_alta_reporte').find('tbody').html(html_1);
                utils.upgradeTooltip();
                $('[name="btn_dar_alta"]').on('click', function (element) {
                    _this.pea_id = $(element.currentTarget).data('value');
                    $('#modal_darAlta').modal('show');
                });
            }
        };
        AsistenciaView.prototype.getContingencia = function () {
            var _this = this;
            this.distribucionService.getPersonalbylocalCurso(this.localAmbienteSelected.localcurso.id, true).done(function (personalContingencia) {
                _this.personalContingencia = personalContingencia;
                utils.setDropdown(_this.personalContingencia, {
                    id: 'id_pea',
                    text: ['dni', 'ape_paterno', 'ape_materno', 'nombre']
                }, { id_element: 'select_personal_para_alta', bootstrap_multiselect: false, select2: true });
            });
        };
        AsistenciaView.prototype.darAlta = function (id_pea) {
            var _this = this;
            var peaAltaSelected = $('#select_personal_para_alta').val();
            if (peaAltaSelected == -1) {
                utils.showInfo('Para dar de alta, tiene que seleccionar a alguna persona!');
                return false;
            }
            utils.alert_confirm(function () { return _this._darAlta(id_pea, peaAltaSelected); }, 'Esta seguro de dar de alta a esta persona? Una vez dado de Alta, no podra rehacer el cambio.', 'warning');
        };
        AsistenciaView.prototype._darAlta = function (id_pea, id_pea_reemplazo) {
            this.asistenciaService.darAlta(this.localAmbienteSelected.id_localambiente, id_pea, id_pea_reemplazo).done(function () {
                utils.showSwalAlert('La persona ha sido dado de alta!', 'Éxito', 'success');
                $('#select_aulas_asignadas').trigger('change');
                $('#modal_darAlta').modal('hide');
            });
        };
        AsistenciaView.prototype.drawHeaderFechas = function () {
            var header = '';
            var subHeader = '<tr>';
            header += "<tr><th rowspan=\"2\">N\u00B0</th><th rowspan=\"2\">Nombre Completo</th><th rowspan=\"2\">Cargo</th>";
            this.rangoFechas.map(function (fecha, index) {
                header += "<th colspan=\"2\">" + fecha + "</th>";
                subHeader += "<th>MA\u00D1ANA</th><th>TARDE</th>";
            });
            header += "</tr>";
            $('#tabla_asistencia').find('thead').html(header + subHeader + '</tr>');
        };
        AsistenciaView.prototype.drawPersonal = function () {
            var _this = this;
            var tbody = '';
            this.personalAsistencia.map(function (value, index) {
                if (value.id_pea.baja_estado == 1) {
                    tbody += "<tr style=\"background-color: #ffc1c1\">";
                }
                else if (value.id_pea.alta_estado == 1) {
                    tbody += "<tr style=\"background-color: #cdf7cd\">";
                }
                else {
                    tbody += "<tr>";
                }
                tbody += "<td>" + (index + 1) + "</td>\n                      <td>" + value.id_pea.ape_paterno + " " + value.id_pea.ape_materno + " " + value.id_pea.nombre + "</td>\n                      <td>" + value.id_pea.id_cargofuncional.nombre_funcionario + "</td>";
                _this.rangoFechas.map(function (fecha, ind) {
                    var divParams = {
                        fecha: fecha,
                        id_personalaula: value.id_peaaula,
                        turno_manana: null,
                        turno_tarde: null,
                        baja: value.id_pea.baja_estado,
                        alta: value.id_pea.alta_estado
                    };
                    value.personalaula.map(function (personalaula, index) {
                        if (personalaula.fecha == fecha) {
                            divParams.turno_manana = personalaula.turno_manana;
                            divParams.turno_tarde = personalaula.turno_tarde;
                        }
                    });
                    if (value.id_pea.baja_estado == 1) {
                        tbody += "<td></td><td></td>";
                    }
                    else {
                        tbody += _this.drawDivAsistencia(divParams);
                    }
                });
                tbody += "</tr>";
            });
            $('#tabla_asistencia').find('tbody').html(tbody);
            var tablaasistenciaDT = $('#tabla_asistencia').DataTable();
            tablaasistenciaDT.destroy();
            $('#tabla_asistencia').find('tbody').html(tbody);
            $('#tabla_asistencia').DataTable({
                "bPaginate": false
            });
        };
        AsistenciaView.prototype.drawDivAsistencia = function (divParams) {
            var turno_uso_local = this.localAmbienteSelected.localcurso.local.turno_uso_local;
            var json = JSON.stringify({ fecha: divParams.fecha, id_personalaula: divParams.id_personalaula });
            var silverBrackground = "style=\"background-color: #dedede\"";
            return "<td " + (turno_uso_local == 1 ? silverBrackground : '') + "><div name=\"divTurnosManana\" data-value=" + json + " class=\"form-group\">\n                    <div class=\"checkbox checkbox-right\">\n                        <label style=\"display: table;\">\n                            <input type=\"radio\" " + (turno_uso_local == 1 ? 'disabled' : '') + "\n                             name=\"turno_manana" + divParams.fecha + divParams.id_personalaula + "\"\n                            " + (divParams.turno_manana == 0 ? 'checked' : '') + " value=\"0\">\n                            Puntual\n                        </label>\n                    </div>\n                    <div class=\"checkbox checkbox-right\">\n                        <label style=\"display: table;\">\n                            <input type=\"radio\" " + (turno_uso_local == 1 ? 'disabled' : '') + "\n                             name=\"turno_manana" + divParams.fecha + divParams.id_personalaula + "\"\n                             " + (divParams.turno_manana == 1 ? 'checked' : '') + " value=\"1\">\n                            Tardanza\n                        </label>\n                    </div>\n                    <div class=\"checkbox checkbox-right\">\n                        <label style=\"display: table;\">\n                            <input type=\"radio\" " + (turno_uso_local == 1 ? 'disabled' : '') + "\n                             name=\"turno_manana" + divParams.fecha + divParams.id_personalaula + "\"\n                             " + (divParams.turno_manana == 2 ? 'checked' : '') + " value=\"2\">\n                            Falta\n                        </label>\n                    </div>\n\t\t\t\t</div></td>\n                <td " + (turno_uso_local == 0 ? silverBrackground : '') + "><div name=\"divTurnosTarde\" data-value=" + json + " class=\"form-group\">\n                    <div class=\"checkbox checkbox-right\">\n                        <label style=\"display: flex;\">\n                            <input type=\"radio\" " + (turno_uso_local == 0 ? 'disabled' : '') + "\n                             name=\"turno_tarde" + divParams.fecha + divParams.id_personalaula + "\" \n                            " + (divParams.turno_tarde == 0 ? 'checked' : '') + " value=\"0\">\n                            Puntual\n                        </label>\n                    </div>\n                    <div class=\"checkbox checkbox-right\">\n                        <label style=\"display: flex;\">\n                            <input type=\"radio\" " + (turno_uso_local == 0 ? 'disabled' : '') + " \n                            name=\"turno_tarde" + divParams.fecha + divParams.id_personalaula + "\"\n                             " + (divParams.turno_tarde == 1 ? 'checked' : '') + " value=\"1\">\n                            Tardanza\n                        </label>\n                    </div>\n                    <div class=\"checkbox checkbox-right\">\n                        <label style=\"display: flex;\">\n                            <input type=\"radio\" " + (turno_uso_local == 0 ? 'disabled' : '') + "\n                             name=\"turno_tarde" + divParams.fecha + divParams.id_personalaula + "\"\n                             " + (divParams.turno_tarde == 2 ? 'checked' : '') + " value=\"2\">\n                            Falta\n                        </label>\n                    </div>\n\t\t\t\t</div></td>";
        };
        AsistenciaView.prototype.saveAsistencia = function () {
            var _this = this;
            var divsManana = $('[name="divTurnosManana"]');
            var divsTarde = $('[name="divTurnosTarde"]');
            var request = [];
            divsManana.map(function (index, domElement) {
                var radioButton = $(domElement).find('input[name^="turno"]:checked');
                if (radioButton.length) {
                    request.push({
                        id_personalaula: $(domElement).data('value').id_personalaula,
                        fecha: $(domElement).data('value').fecha,
                        turno_manana: $(radioButton[0]).val(),
                        turno_tarde: null
                    });
                }
            });
            divsTarde.map(function (index, domElement) {
                var radioButton = $(domElement).find('input[name^="turno"]:checked');
                var id_personalaula = $(domElement).data('value').id_personalaula;
                var fecha = $(domElement).data('value').fecha;
                if (radioButton.length) {
                    var exist_1 = false;
                    request.map(function (value, index) {
                        if (value.id_personalaula == id_personalaula && value.fecha == fecha) {
                            request[index].turno_tarde = $(radioButton[0]).val();
                            exist_1 = true;
                        }
                    });
                    if (!exist_1) {
                        request.push({
                            id_personalaula: $(domElement).data('value').id_personalaula,
                            fecha: $(domElement).data('value').fecha,
                            turno_manana: null,
                            turno_tarde: $(radioButton[0]).val()
                        });
                    }
                }
            });
            if (!request.length) {
                utils.showInfo('No ha marcado la asistencia de ninguna, no puede guardar aún');
                return false;
            }
            utils.alert_confirm(function () {
                _this.asistenciaService.saveAsistencia(request).done(function (response) {
                    utils.showSwalAlert('La asistencia fue guardad con éxito!', 'Exito', 'success');
                });
            }, 'Esta seguro de guardar la asistencia?', 'success');
        };
        AsistenciaView.prototype.getAulas = function (curso_id) {
            var _this = this;
            this.asistenciaService.getAulasbyInstructor(IDUSUARIO, curso_id).done(function (aulas) {
                _this.localesAmbientes = aulas;
                var html = '';
                html += "<option value=\"\">Seleccione Aula</option>";
                _this.localesAmbientes.map(function (value, index) {
                    html += "<option value=\"" + value.id_localambiente + "\">" + value.id_ambiente.nombre_ambiente + " - N\u00B0 " + value.numero + "</option>";
                });
                $('#select_aulas_asignadas').html(html);
            });
        };
        AsistenciaView.prototype.darBaja = function () {
            var _this = this;
            var peaBajaSelected = $('#select_personal_para_baja').val();
            if (peaBajaSelected == -1) {
                utils.showInfo('Para dar de baja, tiene que seleccionar a alguna persona!');
                return false;
            }
            utils.alert_confirm(function () { return _this._darBaja(peaBajaSelected); }, 'Esta seguro de dar de baja a esta persona? Una vez dado de baja, no podra rehacer el cambio.', 'warning');
        };
        AsistenciaView.prototype._darBaja = function (pk) {
            this.personalService.patch(pk, { baja_estado: 1 }).done(function () {
                utils.showSwalAlert('La persona se ha dado de baja!', 'Éxito', 'success');
                $('#select_aulas_asignadas').trigger('change');
            });
        };
        return AsistenciaView;
    }());
    new AsistenciaView();
});
//color para dar de baja #ffc1c1 
//# sourceMappingURL=asistencia.view.js.map