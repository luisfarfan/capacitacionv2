define(["require", "exports", '../core/utils', 'evaluacion.service', '../asistencia/asistencia.service', '../ubigeo/ubigeo.service', '../comun.utils'], function (require, exports, utils, evaluacion_service_1, asistencia_service_1, ubigeo_service_1, comun_utils_1) {
    "use strict";
    var EvaluacionView = (function () {
        function EvaluacionView() {
            this.detalleCriterios = [];
            this.localesAmbientes = [];
            this.zonasRankeo = [];
            this.cargosFuncionales = [];
            this.personalNotaFinal = [];
            this.cursoInyection = new comun_utils_1.CursoInyection();
            this.evaluacionService = new evaluacion_service_1.EvaluacionService();
            this.asistenciaService = new asistencia_service_1.AsistenciaService();
            this.ubigeoService = new ubigeo_service_1["default"]();
            this.getZonas();
            this.setEvents();
        }
        EvaluacionView.prototype.setEvents = function () {
            var _this = this;
            $('#cursos').on('change', function (element) {
                var curso_id = $(element.currentTarget).val();
                $('#p_curso_actual').text($('#cursos :selected').text());
                _this.getAulas(curso_id);
                _this.getCriterios(curso_id);
                _this.getCargosFuncionales(curso_id);
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
                    _this.asistenciaService.getPersonalAsistenciaDetalle(_this.localAmbienteSelected.id_localambiente).done(function (personal) {
                        _this.personal = personal;
                        _this.drawTbody();
                    });
                }
            });
            $('#btn_save_asistencia').on('click', function () {
                _this.saveNotas();
            });
            $('#btn_ver_personal').on('click', function () {
                _this.getPersonalNotaFinal();
            });
            $('#btn_rankeo_temporal').on('click', function () {
                _this.rankear();
            });
        };
        EvaluacionView.prototype.getCriterios = function (id_curso) {
            var _this = this;
            this.evaluacionService.criteriosCurso(id_curso).done(function (criteriosCurso) {
                _this.criteriosCurso = criteriosCurso;
            });
            this.evaluacionService.criteriosDetalleCurso(id_curso).done(function (detalleCriterio) {
                _this.detalleCriterios = detalleCriterio;
            });
        };
        EvaluacionView.prototype.getPersonalNotaFinal = function () {
            var _this = this;
            var zona = $('#select_zonas').val();
            var cargo = $('#select_cargos_funcionales').val();
            this.evaluacionService.filterPersonalNotaFinal("" + ubigeo.ccdd + ubigeo.ccpp + ubigeo.ccdi, zona, cargo).done(function (personalNotaFinal) {
                _this.personalNotaFinal = personalNotaFinal;
                _this.drawPersonalNotaFinal();
            });
        };
        EvaluacionView.prototype.drawPersonalNotaFinal = function () {
            var html = '';
            this.personalNotaFinal.map(function (pea, index) {
                if (pea.personalaula_notafinal.length) {
                    html += "<tr data-value=\"" + pea.id_peaaula + "\">\n                        <td>" + (index + 1) + "</td>\n                        <td>" + pea.id_pea.ape_paterno + " " + pea.id_pea.ape_materno + " " + pea.id_pea.nombre + "</td>\n                        <td>" + pea.id_pea.dni + "</td>\n                        <td><input value=\"" + pea.personalaula_notafinal[0].nota_final + "\" type=\"number\"></td>\n                        <td><span class=\"label\"></span></td>\n                     </tr>";
                }
            });
            $('#table_personalnotafinal').find('tbody').html(html);
        };
        EvaluacionView.prototype.rankear = function () {
            var meta = 6;
            var inputsTable = $('#table_personalnotafinal').find('input[type="number"]');
            var count = 0;
            inputsTable.map(function (index, input) {
                count++;
                var span = $(input).parent().parent().find('span');
                if (meta >= count) {
                    if ($(input).val() >= 11) {
                        span.addClass('label-success');
                        span.text('Titular');
                    }
                    else {
                        span.addClass('label-danger');
                        span.text('No seleccionado');
                    }
                }
                else {
                    if ($(input).val() >= 11) {
                        span.addClass('label-primary');
                        span.text('reserva');
                    }
                    else {
                        span.addClass('label-danger');
                        span.text('No seleccionado');
                    }
                }
            });
        };
        EvaluacionView.prototype.getCargosFuncionales = function (id_curso) {
            var _this = this;
            this.evaluacionService.cargosCurso(id_curso).done(function (cargosFuncionales) {
                _this.cargosFuncionales = cargosFuncionales;
                var html = "<option value=\"\">Seleccione cargo</option>";
                _this.cargosFuncionales.map(function (value) {
                    html += "<option value=\"" + value.id_cargofuncional.id_cargofuncional + "\">" + value.id_cargofuncional.nombre_funcionario + "</option>";
                });
                $('#select_cargos_funcionales').html(html);
            });
        };
        EvaluacionView.prototype.getZonas = function () {
            var _this = this;
            this.ubigeoService.getZonas("" + ubigeo.ccdd + ubigeo.ccpp + ubigeo.ccdi).done(function (zonas) {
                _this.zonasRankeo = zonas;
                var html = "<option value=\"\">Seleccione zona</option>";
                _this.zonasRankeo.map(function (value) {
                    html += "<option value=\"" + value.ZONA + "\">" + value.ZONA + "</option>";
                });
                $('#select_zonas').html(html);
            });
        };
        EvaluacionView.prototype.drawHeader = function () {
            var thead = "<tr>";
            thead += "<th>N\u00B0</th><th>Nombre Completo</th><th>Cargo</th>";
            this.criteriosCurso.criterios.map(function (value, index) {
                thead += "<th>" + value.nombre_criterio + "</th>";
            });
            thead += "<th>Nota final</th><th>Aptos</th>";
            thead += "</tr>";
            return thead;
        };
        EvaluacionView.prototype.drawTbody = function () {
            var _this = this;
            var tbody = "";
            this.personal.map(function (persona, index) {
                var nota_final = 0;
                var disabled = '';
                if (persona.id_pea.baja_estado == 1) {
                    disabled = 'disabled';
                    tbody += "<tr style=\"background-color: #ffc1c1\" data-value=\"" + persona.id_peaaula + "\">";
                }
                else if (persona.id_pea.alta_estado == 1) {
                    disabled = '';
                    tbody += "<tr style=\"background-color: #cdf7cd\" data-value=\"" + persona.id_peaaula + "\">";
                }
                else {
                    disabled = '';
                    tbody += "<tr data-value=\"" + persona.id_peaaula + "\">";
                }
                tbody += "<td>" + (index + 1) + "</td>\n                      <td>" + persona.id_pea.ape_paterno + " " + persona.id_pea.ape_materno + " " + persona.id_pea.nombre + "</td>\n                      <td>" + persona.id_pea.id_cargofuncional.nombre_funcionario + "</td>";
                _this.criteriosCurso.criterios.map(function (criterio) {
                    var objCriterio = '';
                    _this.detalleCriterios.map(function (detalle) {
                        if (criterio.id_criterio == detalle.criterio) {
                            objCriterio = JSON.stringify({ id_criterio: detalle.cursocriterio });
                        }
                    });
                    var nota = null;
                    criterio.id_criterio == 2 ? nota = 18 : nota = null;
                    persona.personalaula_notas.filter(function (val) {
                        if (val.cursocriterio.criterio == criterio.id_criterio) {
                            criterio.id_criterio == 2 ? nota = 18 : nota = val.nota;
                            _this.detalleCriterios.map(function (criteriodetalle) {
                                if (val.cursocriterio.criterio == criteriodetalle.criterio) {
                                    nota_final = nota_final + (nota * (criteriodetalle.ponderacion / 100));
                                }
                            });
                        }
                    });
                    tbody += "<td><input " + disabled + " data-value=" + objCriterio + " value=\"" + nota + "\" min=\"0\" max=\"20\" type=\"number\"></td>";
                });
                nota_final = Math.round(nota_final * 100) / 100;
                var span = '';
                if (nota_final > 10) {
                    span = "<span name=\"span_state\" class=\"label label-success\">Apto</span>";
                }
                else {
                    span = "<span name=\"span_state\" class=\"label label-danger\">No apto</span>";
                }
                tbody += "<td><input disabled min=\"0\" max=\"20\" value=\"" + nota_final + "\" name=\"nota_final\" type=\"number\"></td>\n            <td>" + span + "</td></tr>";
            });
            $('#tabla_evaluacion').find('thead').html(this.drawHeader());
            $('#tabla_evaluacion').find('tbody').html(tbody);
            this.setCalculoPromedio();
        };
        EvaluacionView.prototype.saveNotas = function () {
            var _this = this;
            var registrosNotas = $('#tabla_evaluacion').find('tbody').find('tr');
            var request = [];
            var error = 0;
            var input;
            registrosNotas.map(function (index, domElement) {
                var peaaula = $(domElement).data('value');
                var inputs = $(domElement).find('input');
                inputs.map(function (ind, inputElement) {
                    var nota = $(inputElement).val();
                    if (nota > 20) {
                        error++;
                        if (error == 1) {
                            input = $(inputElement);
                        }
                    }
                    if ($(inputElement).val() != '' && !$(inputElement).is(':disabled')) {
                        request.push({
                            peaaula: peaaula,
                            criterio: $(inputElement).data('value').id_criterio,
                            nota: nota
                        });
                    }
                });
            });
            if (error > 0) {
                utils.showInfo('La nota no puede ser mayor a 20, por favor corrijalo');
                input.focus();
                return false;
            }
            utils.alert_confirm(function () {
                _this.evaluacionService.saveNotas(request).done(function (response) {
                    $('#select_aulas_asignadas').trigger('change');
                    utils.showSwalAlert('Se ha guardado las notas!', 'Exito!', 'success');
                    _this.saveNotaFinal();
                });
            }, 'Esta seguro de guardar las notas de estas personas?');
        };
        EvaluacionView.prototype.saveNotaFinal = function () {
            var inputsNotafinal = $('input[name="nota_final"]');
            var request = [];
            inputsNotafinal.each(function (index, element) {
                var trpeaaula;
                if ($(element).val() != '') {
                    trpeaaula = $(element).parent().parent().data('value');
                    request.push({ peaaula: trpeaaula, nota_final: $(element).val() });
                }
            });
            this.evaluacionService.saveNotasFinal(request).done(function (response) {
            });
        };
        EvaluacionView.prototype.getAulas = function (curso_id) {
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
        EvaluacionView.prototype.getDetalleCriterio = function () {
        };
        EvaluacionView.prototype.setCalculoPromedio = function () {
            var _this = this;
            $("input[type=number]").on('keyup', function (element) {
                var tr = $(element.target).parent().parent();
                var inputs = $(tr).find('input:not([name="nota_final"])');
                var nota_final = 0;
                var procesado = _this.detalleCriterios.length;
                var isProcesado = 0;
                inputs.map(function (index, inp) {
                    var ponderacion = 0;
                    var nota_input = $(inp).val() == '' ? 0 : $(inp).val();
                    if (nota_input != 0) {
                        isProcesado++;
                        _this.detalleCriterios.filter(function (value) { return value.cursocriterio == $(inp).data('value').id_criterio ? ponderacion = value.ponderacion : ''; });
                        nota_final = nota_final + (nota_input * (ponderacion / 100));
                    }
                });
                nota_final = Math.round(nota_final * 100) / 100;
                $(tr).find('[name="nota_final"]').val(nota_final);
                if (nota_final > 10) {
                    $(tr).find('span').removeClass('label-danger');
                    $(tr).find('span').addClass('label-success');
                    $(tr).find('span').text('Apto');
                }
                else {
                    $(tr).find('span').removeClass('label-success');
                    $(tr).find('span').addClass('label-danger');
                    $(tr).find('span').text('No apto');
                }
            });
        };
        return EvaluacionView;
    }());
    new EvaluacionView();
});
//# sourceMappingURL=evaluacion.view.js.map