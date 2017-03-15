define(["require", "exports", "asistencia.service", "../comun.utils", "../core/utils"], function (require, exports, asistencia_service_1, comun_utils_1, utils) {
    "use strict";
    var AsistenciaView = (function () {
        function AsistenciaView() {
            var _this = this;
            this.localesAmbientes = [];
            this.localAmbienteSelected = null;
            this.rangoFechas = [];
            this.asistenciaService = new asistencia_service_1.AsistenciaService();
            this.cursoInyection = new comun_utils_1.CursoInyection();
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
                            _this.drawPersonal();
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
        }
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
                tbody += "<tr>\n                        <td>" + (index + 1) + "</td>\n                        <td>" + value.id_pea.ape_paterno + " " + value.id_pea.ape_materno + " " + value.id_pea.nombre + "</td>\n                        <td>" + value.id_pea.id_cargofuncional.nombre_funcionario + "</td>";
                _this.rangoFechas.map(function (fecha, index) {
                    var divParams = {
                        fecha: fecha,
                        id_personalaula: value.id_peaaula,
                        turno_manana: null,
                        turno_tarde: null
                    };
                    value.personalaula.map(function (personalaula, index) {
                        if (personalaula.fecha == fecha) {
                            divParams.turno_manana = personalaula.turno_manana;
                            divParams.turno_tarde = personalaula.turno_tarde;
                        }
                    });
                    tbody += _this.drawDivAsistencia(divParams);
                });
                tbody += "</tr>";
            });
            $('#tabla_asistencia').find('tbody').html(tbody);
            var tablaasistenciaDT = $('#tabla_asistencia').DataTable();
            tablaasistenciaDT.destroy();
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
        return AsistenciaView;
    }());
    new AsistenciaView();
});
//# sourceMappingURL=asistencia.view.js.map