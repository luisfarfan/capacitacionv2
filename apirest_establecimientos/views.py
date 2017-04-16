from django.shortcuts import render
from rest_framework.views import APIView
from django.http import JsonResponse
from .models import FenomenoMonitoreo, FenomenoMarcoDistrito
from django.db.models.functions import Length


class Establecimientos(APIView):
    def get(self, request, ccdd=None, ccpp=None, ccdi=None, zona=None):
        if ccdd is None:
            queryNacional = FenomenoMonitoreo.objects.using('segmentacion').filter(COD_AMBITO='00')
            query = FenomenoMonitoreo.objects.using('segmentacion').exclude(COD_AMBITO='00').annotate(
                cod_ambito=Length('COD_AMBITO')).filter(
                cod_ambito=2)
        elif ccdd is not None and ccpp is None:
            query = FenomenoMonitoreo.objects.using('segmentacion').annotate(cod_ambito=Length('COD_AMBITO')).filter(
                cod_ambito=4,
                COD_AMBITO__startswith=ccdd)
        elif ccpp is not None:
            query = FenomenoMonitoreo.objects.using('segmentacion').annotate(cod_ambito=Length('COD_AMBITO')).filter(
                cod_ambito=6,
                COD_AMBITO__startswith=ccdd + ccpp)
        if ccdd is None:
            formatQuery = sorted(getCampos(query), key=lambda k: k['ambito'])
            nacional = getCampos(queryNacional)[0]
            formatQuery.insert(0, nacional)
        else:
            formatQuery = getCampos(query)
        return JsonResponse(list(formatQuery), safe=False)


class EstablecimientosDistritosZonas(APIView):
    def get(self, request, ubigeo, zona=None):
        if zona is not None:
            query = FenomenoMonitoreo.objects.using('segmentacion').annotate(cod_ambito=Length('COD_AMBITO')).filter(
                cod_ambito__gte=10, COD_AMBITO__startswith=ubigeo + zona)
            formatQuery = getCampos(query, False)
        else:
            query = FenomenoMonitoreo.objects.using('segmentacion').annotate(cod_ambito=Length('COD_AMBITO')).filter(
                cod_ambito__in=[10, 11], COD_AMBITO__startswith=ubigeo)
            formatQuery = getCampos(query, True)

        return JsonResponse(list(formatQuery), safe=False)


def getCampos(datos, nombre=True):
    dictTodos = []
    for dato in datos:
        dictValues = {'COD_AMBITO': '', 'ambito': '', 'establecimientos_empadronados': 0,
                      'municipalidadAbs': 0, 'municipalidadPercent': 0,
                      'comidariaAbs': 0, 'comisariaPercent': 0,
                      'institucionEducativaAbs': 0, 'institucionEducativaPercent': 0,
                      'establecimientosSaludAbs': 0, 'establecimientosSaludPercent': 0,
                      'localComunalAbs': 0, 'localComunalPercent': 0,
                      'gobernacionAbs': 0, 'gobernacionPercent': 0,
                      'otroAbs': 0, 'otroPercent': 0,
                      'aptoFuncionamientoAbs': 0, 'aptoFuncionamientoPercent': 0,
                      'noaptoFuncionamientoAbs': 0, 'noaptoFuncionamientoPercent': 0,
                      'colapsadoAbs': 0, 'colapsadoPercent': 0,
                      'noexisteEstAbs': 0, 'noexisteEstPercent': 0,
                      'noafectadaAbs': 0, 'noafectadaPercent': 0}
        dictValues['COD_AMBITO'] = dato.COD_AMBITO
        if nombre:
            dictValues['ambito'] = getNameAmbito(dato.COD_AMBITO)
        else:
            dictValues['ambito'] = dato.COD_AMBITO
        dictValues['establecimientos_empadronados'] = dato.EST_EMP
        dictValues['municipalidadAbs'] = dato.MUNICIPALIDAD
        dictValues['municipalidadPercent'] = calcPocentaje(dato.MUNICIPALIDAD, dato.EST_EMP)
        dictValues['comisariaAbs'] = dato.COMISARIA
        dictValues['comisariaPercent'] = calcPocentaje(dato.COMISARIA, dato.EST_EMP)
        dictValues['institucionEducativaAbs'] = dato.INST_EDU
        dictValues['institucionEducativaPercent'] = calcPocentaje(dato.INST_EDU, dato.EST_EMP)
        dictValues['establecimientosSaludAbs'] = dato.EST_SALUD
        dictValues['establecimientosSaludPercent'] = calcPocentaje(dato.EST_SALUD, dato.EST_EMP)
        dictValues['localComunalAbs'] = dato.LO_COM
        dictValues['localComunalPercent'] = calcPocentaje(dato.LO_COM, dato.EST_EMP)
        dictValues['gobernacionAbs'] = dato.GOBERNACION
        dictValues['gobernacionPercent'] = calcPocentaje(dato.GOBERNACION, dato.EST_EMP)
        dictValues['otroAbs'] = dato.OTRO
        dictValues['otroPercent'] = calcPocentaje(dato.OTRO, dato.EST_EMP)
        dictValues['aptoFuncionamientoAbs'] = dato.EST_APTO_FUN
        dictValues['aptoFuncionamientoPercent'] = calcPocentaje(dato.EST_APTO_FUN, dato.EST_EMP)
        dictValues['noaptoFuncionamientoAbs'] = dato.EST_NO_APTO
        dictValues['noaptoFuncionamientoPercent'] = calcPocentaje(dato.EST_NO_APTO, dato.EST_EMP)
        dictValues['colapsadoAbs'] = dato.EST_COLAPSADO
        dictValues['colapsadoPercent'] = calcPocentaje(dato.EST_COLAPSADO, dato.EST_EMP)
        dictValues['noexisteEstAbs'] = dato.EST_NO_EXIST
        dictValues['noexisteEstPercent'] = calcPocentaje(dato.EST_NO_EXIST, dato.EST_EMP)
        dictValues['noafectadaAbs'] = 0
        dictValues['noafectadaPercent'] = calcPocentaje(0, dato.EST_EMP)
        dictTodos.append(dictValues)

    return dictTodos


def calcPocentaje(partial, total):
    if partial is None or total is None:
        return 0
    if partial == 0 or total == 0:
        return 0

    return (partial * 100) / total


def getNameAmbito(codambito):
    name_ambito = ''
    if len(codambito) == 2:
        name_ambito = 'DEPARTAMENTO'
    elif len(codambito) == 4:
        name_ambito = 'PROVINCIA'
    elif len(codambito) == 6:
        name_ambito = 'DISTRITO'

    print(codambito, len(codambito))
    if codambito == '00':
        response = 'Total'
    elif len(codambito) == 11:
        response = codambito[-5:]
    else:
        query = FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito).values()[0]
        response = query[name_ambito]
    return response


def getNameAmbitoService(request, codambito):
    name_ambito = ''
    if len(codambito) == 2:
        name_ambito = 'DEPARTAMENTO'
    elif len(codambito) == 4:
        name_ambito = 'PROVINCIA'
    elif len(codambito) == 6:
        name_ambito = 'DISTRITO'

    if codambito == '00':
        response = 'Total'
    elif len(codambito) == 11:
        response = name_ambito[-5:]
    else:
        query = FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito).values()[0]
        print(query)
        response = query[name_ambito]
    return JsonResponse({'nombre_ambito': response})


def getFullNameAmbitoService(request, codambito):
    responseTotal = []
    if len(codambito) == 2:
        responseTotal.append({'ambito': '', 'ambito_nombre': 'Nacional'})
        query = FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito[:2]).values()[0]
        nameambito = query['DEPARTAMENTO']
        responseTotal.append({'ambito': codambito[:2], 'ambito_nombre': nameambito})
    elif len(codambito) == 4:
        responseTotal.append({'ambito': '', 'ambito_nombre': 'Nacional'})
        query = FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito[:2]).values()[0]
        nameambito = query['DEPARTAMENTO']
        responseTotal.append({'ambito': codambito[:2], 'ambito_nombre': nameambito})

        queryProvincia = \
            FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito[:4]).values()[0]
        nameambitoProvincia = queryProvincia['PROVINCIA']
        responseTotal.append({'ambito': codambito[:4], 'ambito_nombre': nameambitoProvincia})
    elif len(codambito) == 6:
        responseTotal.append({'ambito': '', 'ambito_nombre': 'Nacional'})
        queryProvincia = \
            FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito[:2]).values()[0]
        nameambitoProvincia = queryProvincia['DEPARTAMENTO']
        responseTotal.append({'ambito': codambito[:2], 'ambito_nombre': nameambitoProvincia})
        queryDistrito = \
            FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito[:4]).values()[0]
        nameambitoDistrito = queryDistrito['PROVINCIA']
        responseTotal.append({'ambito': codambito[:4], 'ambito_nombre': nameambitoDistrito})

        queryDistrito2 = \
            FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito[:6]).values()[0]
        nameambitoDistrito2 = queryDistrito2['DISTRITO']
        responseTotal.append({'ambito': codambito[:6], 'ambito_nombre': nameambitoDistrito2})
    elif len(codambito) > 6:
        responseTotal.append({'ambito': '', 'ambito_nombre': 'Nacional'})
        queryProvincia = \
            FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito[:2]).values()[0]
        nameambitoProvincia = queryProvincia['DEPARTAMENTO']
        responseTotal.append({'ambito': codambito[:2], 'ambito_nombre': nameambitoProvincia})
        queryDistrito = \
            FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito[:4]).values()[0]
        nameambitoDistrito = queryDistrito['PROVINCIA']
        responseTotal.append({'ambito': codambito[:4], 'ambito_nombre': nameambitoDistrito})

        queryDistrito2 = \
            FenomenoMarcoDistrito.objects.using('segmentacion').filter(UBIGEO__startswith=codambito[:6]).values()[0]
        nameambitoDistrito2 = queryDistrito2['DISTRITO']
        responseTotal.append({'ambito': codambito[:6], 'ambito_nombre': nameambitoDistrito2})

        responseTotal.append({'ambito': codambito[:11], 'ambito_nombre': codambito[-5:]})

    return JsonResponse(responseTotal, safe=False)
