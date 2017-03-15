from datetime import datetime
import pandas


def getRangoFechas(fechainicio, fechafin):
    fechas_range = []
    fecha_inicio = datetime.strptime(fechainicio, '%d/%m/%Y').strftime('%Y-%m-%d')
    fecha_fin = datetime.strptime(fechafin, '%d/%m/%Y').strftime('%Y-%m-%d')
    rango_fechas = pandas.Series(pandas.date_range(fecha_inicio, fecha_fin).format())
    for f in rango_fechas:
        fechas_range.append(datetime.strptime(f, '%Y-%m-%d').strftime('%d/%m/%Y'))

    return fechas_range
