/**
 * Created by prueba on 16/06/2017.
 */

import {ControlCalidadService} from '../controlcalidad/controlcalidad.service';
import {IRespuestaLocal, IRespuestaManual, IRespuestaAula} from '../controlcalidad/controlcalidad.interfaces';
import {CursoInyection} from '../comun.utils';
import * as utils from '../core/utils';
declare var $: any;
class ReportesView extends CursoInyection {
    private controlcalidadService: ControlCalidadService = new ControlCalidadService();
    private respuestaLocal: IRespuestaLocal[] = [];
    private respuestaManual: IRespuestaManual[] = [];
    private respuestaAula: IRespuestaAula[] = [];
    private totalCumple: number = 0
    private totalNoCumple: number = 0
    private cantidadDocumentos: number = 0
    private cantidadDefectuoso: number = 0
    private cursoMaster: number = 0

    constructor() {
        super()

        this.cursoMaster = $("#cursos").val()

        console.log(this.getReporteLocal())
        console.log(this.getReporteManual())
        console.log(this.getReporteAula())
        $('#cursos').on('change', () => {
            this.getReporteLocal();
            this.getReporteManual();
            this.getReporteAula();
        });
    }

    getReporteAula() {
        this.controlcalidadService.getRespuestasAula(this.cursoMaster, 0).done((respuestaA) => {
            this.respuestaAula = respuestaA
            this.drawDataoAula()
        })
    }

    getReporteManual() {
        this.controlcalidadService.getRespuestasManual(this.cursoMaster, 0).done((respuestaM) => {
            this.respuestaManual = respuestaM
            this.drawDataoManual()
        })
    }

    getReporteLocal() {
        this.controlcalidadService.getRespuestasLocal(this.cursoMaster, 0).done((respuestaL) => {
            this.respuestaLocal = respuestaL
            this.drawDataLocal()
        })
    }

    drawDataoAula() {
        let cantAulas = 0
        let aula = 0
        let aulaD = 0
        let cantDefect = 0
        this.respuestaAula.map((valueRA: IRespuestaAula, index: number) => {
            if (valueRA.aula != aula) {
                cantAulas += 1
                aula = valueRA.aula
            }
            if (valueRA.aula != aulaD) {
                if (valueRA.respuesta_texto == 'no') {
                    cantDefect += 1
                    aulaD = valueRA.aula
                }
            }
            this.drawGraficoInspeccionAula(cantAulas, cantDefect)
        })
    }

    drawDataLocal() {
        let local = 0
        let cantLocal = 0
        let obeservaciones = 0
        this.respuestaLocal.map((valueRL: IRespuestaLocal, index: number) => {
            if (valueRL.pregunta == 2 || valueRL.pregunta == 3 || valueRL.pregunta == 4) {
                this.totalCumple += parseInt(valueRL.respuesta_texto)
                this.totalNoCumple += parseInt(valueRL.opcional)
            }
            this.drawGraficoCapacitacion(this.totalCumple, this.totalNoCumple)
            if (valueRL.local != local) {
                cantLocal += 1
                local = valueRL.local
            }
            if (valueRL.respuesta_texto == 'no') {
                obeservaciones += 1
            }
            this.drawLocalInspecionado(cantLocal, obeservaciones)
        })
    }

    drawDataoManual() {
        let manual = 0
        this.respuestaManual.map((valueRM: IRespuestaManual, index: number) => {
            if (valueRM.manual != manual) {
                this.cantidadDocumentos += valueRM.cantidaddocumentos
                this.cantidadDefectuoso += valueRM.cantidaddodefectuosos
                manual = valueRM.manual
            }
            this.drawGraficoManual(this.cantidadDocumentos, this.cantidadDefectuoso)
        })
    }

    drawGraficoInspeccionAula(cantAulas: number, cantDefect: number) {
        google.charts.load("current", {packages: ['corechart']});
        google.charts.setOnLoadCallback(drawInspeccionAula);
        function drawInspeccionAula() {
            var data = google.visualization.arrayToDataTable([
                ["Element", "Cantidad", {role: "style"}],
                ["Aulas inspeccionadas", cantAulas, "#b87333"],
                ["Aulas defectuosas", cantDefect, "silver"],
            ]);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                },
                2]);

            var options = {
                title: "Inspeccion del Aulas",
                width: 600,
                height: 400,
                bar: {groupWidth: "65%"},
                legend: {position: "none"},
            };
            var chart = new google.visualization.ColumnChart(document.getElementById("graficoCursoCapacitacion4"));
            chart.draw(view, options);
        }
    }

    drawLocalInspecionado(cantLocal: number, obeservaciones: number) {
        google.charts.load("current", {packages: ['corechart']});
        google.charts.setOnLoadCallback(drawObservacionLocal);
        function drawObservacionLocal() {
            var data = google.visualization.arrayToDataTable([
                ["Element", "Cantidad", {role: "style"}],
                ["Locales inspeccionados", cantLocal, "#b87333"],
                ["# de observaciones en el Local", obeservaciones, "silver"],
            ]);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                },
                2]);

            var options = {
                title: "Inspeccion del Local",
                width: 600,
                height: 400,
                bar: {groupWidth: "65%"},
                legend: {position: "none"},
            };
            var chart = new google.visualization.ColumnChart(document.getElementById("graficoCursoCapacitacion3"));
            chart.draw(view, options);
        }
    }

    drawGraficoCapacitacion(totalCumple: number, totalNoCumple: number) {
        google.charts.load("current", {packages: ['corechart']});
        google.charts.setOnLoadCallback(drawCapacitacion);
        function drawCapacitacion() {
            var data = google.visualization.arrayToDataTable([
                ["Element", "Cantidad", {role: "style"}],
                ["Participantes que cumplen el perfil", totalCumple, "#b87333"],
                ["Participantes que no cumplen el perfil", totalNoCumple, "silver"],
            ]);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                },
                2]);

            var options = {
                title: "Personal para el curso de capacitación",
                width: 600,
                height: 400,
                bar: {groupWidth: "65%"},
                legend: {position: "none"},
            };
            var chart = new google.visualization.ColumnChart(document.getElementById("graficoCursoCapacitacion"));
            chart.draw(view, options);
        }
    }

    drawGraficoManual(cantidadDocumentos: number, totalDocumentos: number) {
        google.charts.load("current", {packages: ['corechart']});
        google.charts.setOnLoadCallback(drawDocumentos);
        function drawDocumentos() {
            var data = google.visualization.arrayToDataTable([
                ["Element", "Cantidad", {role: "style"}],
                ["Documentos Inspeccionados", cantidadDocumentos, "#b87333"],
                ["Documentos defectuosos", totalDocumentos, "silver"],
            ]);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                },
                2]);

            var options = {
                title: "Total de documentos inspeccionados",
                width: 600,
                height: 400,
                bar: {groupWidth: "65%"},
                legend: {position: "none"},
            };
            var chart = new google.visualization.ColumnChart(document.getElementById("graficoCursoCapacitacion2"));
            chart.draw(view, options);
        }
    }
}

new ReportesView()