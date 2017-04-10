# from rest_framework import generics
from builtins import filter
from locales_consecucion.models import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count, Min, Sum, Avg, F, IntegerField
from rest_framework.views import APIView
from .utils import cleanDict
from evaluacion.models import Ficha177


class Etapas(APIView):
    def get(self, request):
        etapa = Etapa.objects.all().values()
        return JsonResponse(list(etapa), safe=False)


class Cursos(APIView):
    def get(self, request, etapa=None):
        filter = {}
        if etapa is not None:
            filter['etapa_id'] = etapa

        cursos = Curso.objects.filter(**filter).values()
        return JsonResponse(list(cursos), safe=False)


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


class consecucionAulas(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        response = {'programados': 0, 'disponibles': 0, 'locales_disponibles': 0}
        filter = {'curso_id': curso}
        if ccdd is not None:
            filter['local__ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['local__ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['local__ubigeo__ccdi'] = ccdi
        query = LocalCurso.objects.filter(**filter)
        queryLocalesCount = query.count()
        queryProgramados = query.aggregate(programados=Sum('local__total_aulas'))
        for disponible in query:
            disponible_total = disponible.local.cantidad_disponible_auditorios + disponible.local.cantidad_disponible_sala + disponible.local.cantidad_disponible_aulas + disponible.local.cantidad_disponible_computo + disponible.local.cantidad_disponible_oficina + disponible.local.cantidad_disponible_otros
            response['disponibles'] = response['disponibles'] + disponible_total

        response['locales_disponibles'] = queryLocalesCount
        response['programados'] = queryProgramados['programados']

        return JsonResponse(cleanDict(response))


class personalCapacitar(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        response = {'metacapacitar': 0, 'inscritos': 0, 'aptoscapacitar': 0, 'seleccionadoscapacitacion': 0,
                    'reserva': 0}
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
        filter = {'id_cargofuncional__in': cargos}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi

        personal = Personal.objects.filter(**filter)
        response['aptoscapacitar'] = personal.count()
        response['seleccionadoscapacitacion'] = personal.filter(contingencia=0).count()
        response['reserva'] = personal.filter(contingencia=1).count()

        return JsonResponse(cleanDict(response))


class personalCapacitado(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        response = {'seleccionadoscapacitacion': 0, 'asistieron': 0, 'bajas': 0, 'altas': 0,
                    'personalcapacitado': 0}
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
        filter = {'id_cargofuncional__in': cargos}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi

        personal = Personal.objects.filter(**filter)
        response['seleccionadoscapacitacion'] = personal.count()
        response['asistieron'] = personal.filter(contingencia=0).count()
        response['bajas'] = personal.filter(baja_estado=1).count()
        response['altas'] = personal.filter(alta_estado=1).count()
        response['personalcapacitado'] = personal.filter(baja_estado=0, contingencia=0).count()

        return JsonResponse(cleanDict(response))


class resultadosCapacitacion(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        response = {'metacampo': 0, 'personalcapacitado': 0, 'titulares': 0, 'reserva': 0}
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
        if ccdd != 13:
            filter = {'peaaula__id_pea__id_cargofuncional__in': cargos}
            if ccdd is not None:
                filter['peaaula__id_pea__ubigeo__ccdd'] = ccdd
            if ccpp is not None:
                filter['peaaula__id_pea__ubigeo__ccpp'] = ccpp
            if ccdi is not None:
                filter['peaaula__id_pea__ubigeo__ccdi'] = ccdi

            personal = PersonalAulaNotaFinal.objects.filter(**filter)
            response['personalcapacitado'] = personal.filter(peaaula__id_pea__contingencia=0).count()
        else:
            filter = {'pea__id_cargofuncional__in': cargos}
            if ccdd is not None:
                filter['pea__ubigeo__ccdd'] = ccdd
            if ccpp is not None:
                filter['pea__ubigeo_ccpp'] = ccpp
            if ccdi is not None:
                filter['pea__ubigeo__ccdi'] = ccdi
            personal = PeaNotaFinalSinInternet.objects.filter(**filter)
            response['personalcapacitado'] = personal.filter(pea__contingencia=0).count()

        response['titulares'] = personal.filter(sw_titu=1, seleccionado=1).count()
        response['reserva'] = personal.filter(sw_titu=1, seleccionado=0).count()

        return JsonResponse(cleanDict(response))


def updateCantidadAulasLocales(request):
    locales = Local.objects.all()
    for local in locales:
        filtro = {}
        if local.cantidad_disponible_auditorios is None:
            filtro['cantidad_disponible_auditorios'] = 0
        if local.cantidad_disponible_sala is None:
            filtro['cantidad_disponible_sala'] = 0
        if local.cantidad_disponible_aulas is None:
            filtro['cantidad_disponible_aulas'] = 0
        if local.cantidad_disponible_computo is None:
            filtro['cantidad_disponible_computo'] = 0
        if local.cantidad_disponible_oficina is None:
            filtro['cantidad_disponible_oficina'] = 0
        if local.cantidad_disponible_otros is None:
            filtro['cantidad_disponible_otros'] = 0

        Local.objects.filter(pk=local.id_local).update(**filtro)

    return JsonResponse({'msg': True})


def updatePersonal(request):
    personal = Personal.objects.all()
    for pea in personal:
        ficha = Ficha177.objects.get(id_per=pea.id_per, id_convocatoriacargo=pea.id_convocatoriacargo)
        pea.tipo_inst = ficha
