# from rest_framework import generics
from builtins import filter
from locales_consecucion.models import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count, Min, Sum, Avg
from rest_framework.views import APIView


def resumenNacional(request, curso, ccdd, ):
    pass


class ResumenNacional(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        cargosCurso = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
        response = {'ambito': '', 'programados': 0, 'disponibles': 0, 'percent': 0, 'personalcapacitar': 0,
                    'personalreclutado': 0}
        responseTotal = []
        ambitos = getAmbitosIterator(curso, ccdd, ccpp, ccdi).values()
        for ambito in ambitos:
            print(ambito)
            pass

        return JsonResponse(response)


def getDisponiblesTotal(curso, ccdd=None, ccpp=None, ccdi=None):
    filter = {'curso_id': curso}
    if ccdd is not None:
        filter['local__ubigeo__ccdd'] = ccdd

    if ccpp is not None:
        filter['local__ubigeo__ccpp'] = ccpp

    if ccdi is not None:
        filter['local__ubigeo__ccdi'] = ccdi

    return LocalCurso.objects.filter(**filter).aggregate(total=Sum('local__total_aulas'))


def getNameAmbito(ccdd=None, ccpp=None, ccdi=None):
    filter = {}
    nombreambito = ''
    if ccdd is not None:
        filter['ccdd'] = ccdd
        nombreambito = 'departamento'
    if ccpp is not None:
        filter['ccpp'] = ccpp
        nombreambito = 'provincia'
    if ccdi is not None:
        filter['ccdi'] = ccdi
        nombreambito = 'distrito'

    query = Ubigeo.objects.filter(**filter).values()
    return query[0][nombreambito]


def getMetaAula(curso, ccdd=None, ccpp=None, ccdi=None):
    filter = {'curso': curso}
    if ccdd is not None:
        filter['ccdd'] = ccdd
    if ccpp is not None:
        filter['ccpp'] = ccpp
    if ccdi is not None:
        filter['ccdi'] = ccdi

    meta = MetaAula.objects.filter(**filter).aggregate(total=Sum('meta'))
    return meta['total']


def getAmbitosIterator(curso, ccdd=None, ccpp=None, ccdi=None):
    filter = {'curso': curso}
    if ccdd is not None:
        filter['ccdd'] = ccdd
    if ccpp is not None:
        filter['ccpp'] = ccpp
    if ccdi is not None:
        filter['ccdi'] = ccdi

    return MetaAula.objects.filter(**filter).values()


def llenarDBGIS(request):
    metaubigeos = MetaAula.objects.values('ubigeo').distinct()
    responseTotal = []
    for metaubigeo in metaubigeos:
        metaCurso = MetaAula.objects.filter(ubigeo=metaubigeo['ubigeo'])
        response = {}
        response['UBIGEO'] = metaubigeo['ubigeo']
        for ubigeo in metaCurso:
            metaubigeocurso = LocalCurso.objects.filter(curso_id=ubigeo.curso, local__ubigeo=ubigeo.ubigeo).aggregate(
                total=Sum('local__total_aulas'))
            model_key = 'CAPACITACION_CURSO{}'.format(ubigeo.curso)
            if metaubigeocurso['total'] is not None:
                print(metaubigeocurso['total'], ubigeo.meta)
                percent = int(round((metaubigeocurso['total'] / ubigeo.meta) * 100))
                response[model_key] = percent
            else:
                response[model_key] = 0
        GISLimiteDis.objects.using('arcgis').filter(UBIGEO=response['UBIGEO']).update(**response)
        metaubigeos = list(MetaAula.objects.values_list('ubigeo', flat=True).distinct())
        query = GISLimiteDis.objects.using('arcgis').filter(UBIGEO__in=metaubigeos).values()
    return JsonResponse(list(query), safe=False)
