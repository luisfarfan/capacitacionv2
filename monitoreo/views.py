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
from reportes.models import Inscritos


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


class ResumenNacional(APIView):
    def get(self, request, curso):
        cargosCurso = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)

        responseTotal = []
        departamentos = Ubigeo.objects.values('ccdd', 'departamento').annotate(dcount=Count('ccdd', 'departamento'))
        for dep in departamentos:
            response = {'ambito': '', 'programados': 0, 'disponibles': 0, 'percent': 0, 'personalcapacitar': 0,
                        'personalreclutado': 0}
            query = LocalCurso.objects.filter(curso_id=curso, local__ubigeo__ccdd=dep['ccdd'])
            queryProgramados = query.aggregate(programados=Sum('local__total_aulas'))
            for disponible in query:
                disponible_total = disponible.local.cantidad_disponible_auditorios + disponible.local.cantidad_disponible_sala + disponible.local.cantidad_disponible_aulas + disponible.local.cantidad_disponible_computo + disponible.local.cantidad_disponible_oficina + disponible.local.cantidad_disponible_otros
                response['disponibles'] = response['disponibles'] + disponible_total
            response['personalcapacitar'] = Personal.objects.filter(id_cargofuncional__in=cargosCurso,
                                                                    ubigeo__ccdd=dep['ccdd'], contingencia=0).count()
            response['programados'] = queryProgramados['programados']
            response['ambito'] = dep['departamento']

            responseTotal.append(cleanDict(response))

        return JsonResponse(responseTotal, safe=False)


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
            disponible_total = int(
                disponible.local.cantidad_disponible_auditorios or 0) + int(
                disponible.local.cantidad_disponible_sala or 0) + int(
                disponible.local.cantidad_disponible_aulas or 0) + int(
                disponible.local.cantidad_disponible_computo or 0) + int(
                disponible.local.cantidad_disponible_oficina or 0) + int(
                disponible.local.cantidad_disponible_otros or 0)
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
        filter2 = {'id_cargofuncional__in': cargos}
        filter3 = {'id_cargofuncional__in': list(cargos)}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
            filter2['ccdd'] = ccdd
            filter3['ccdd_i'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
            filter2['ccpp'] = ccpp
            filter3['ccpp_i'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi
            filter2['ccdi'] = ccdi
            filter3['ccdi_i'] = ccdi
        print(filter3)
        personal = Personal.objects.filter(**filter)
        response['metacapacitar'] = MetaCapacitacionPersonal.objects.filter(**filter2).aggregate(
            meta_capacitacion=Sum('meta_capacitacion'))['meta_capacitacion']
        response['inscritos'] = Inscritos.objects.using('consecucion').filter(**filter3).count()
        response['aptoscapacitar'] = personal.count()
        response['seleccionadoscapacitacion'] = personal.filter(contingencia=0, baja_estado=0).count()
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
        response['asistieron'] = personal.filter(contingencia=0, baja_estado=0).count()
        response['bajas'] = personal.filter(baja_estado=1).count()
        response['altas'] = personal.filter(alta_estado=1).count()
        if ccdd == '13' or ccdd == 13:
            response['personalcapacitado'] = personal.filter(contingencia=0).count()
        else:
            response['personalcapacitado'] = personal.filter(baja_estado=0, contingencia=0).count()

        return JsonResponse(cleanDict(response))


class resultadosCapacitacion(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        response = {'metacampo': 0, 'personalcapacitado': 0, 'titulares': 0, 'reserva': 0}
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
        filter2 = {'id_cargofuncional__in': cargos}
        if ccdd != '13':
            filter = {'peaaula__id_pea__id_cargofuncional__in': cargos}
            if ccdd is not None:
                filter['peaaula__id_pea__ubigeo__ccdd'] = ccdd
                filter2['ccdd'] = ccdd
            if ccpp is not None:
                filter['peaaula__id_pea__ubigeo__ccpp'] = ccpp
                filter2['ccpp'] = ccpp
            if ccdi is not None:
                filter['peaaula__id_pea__ubigeo__ccdi'] = ccdi
                filter2['ccdi'] = ccdi

            personal = PersonalAulaNotaFinal.objects.filter(**filter)
            response['personalcapacitado'] = personal.filter(peaaula__id_pea__contingencia=0,
                                                             peaaula__id_pea__baja_estado=0).count()
        else:
            filter = {'pea__id_cargofuncional__in': cargos}
            if ccdd is not None:
                filter['pea__ubigeo__ccdd'] = ccdd
                filter2['ccdd'] = ccdd
            if ccpp is not None:
                filter['pea__ubigeo_ccpp'] = ccpp
                filter2['ccpp'] = ccpp
            if ccdi is not None:
                filter['pea__ubigeo__ccdi'] = ccdi
                filter2['ccdi'] = ccdi
            personal = PeaNotaFinalSinInternet.objects.filter(**filter)
            if curso == 5 or curso == '5' or curso == 17 or curso == '17':
                response['personalcapacitado'] = personal.filter(pea__contingencia=0).count() - 1
            else:
                response['personalcapacitado'] = personal.filter(pea__contingencia=0, pea__baja_estado=0).count()

        response['metacampo'] = MetaCapacitacionPersonal.objects.filter(**filter2).aggregate(
            metacampo=Sum('meta_campo'))['metacampo']
        response['titulares'] = personal.filter(sw_titu=1).count()
        response['reserva'] = personal.filter(sw_titu=1, seleccionado=0).count()

        return JsonResponse(cleanDict(response))


class porSexo(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
        filter = {'id_cargofuncional__in': cargos, 'contingencia': 0}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi

        personal = Personal.objects.filter(**filter)
        aprobadosM = PersonalAulaNotaFinal.objects.filter(
            peaaula__id_pea_id__in=personal.filter(sexo='M').values_list('id_pea', flat=True),
            nota_final__gte=10).count()
        aprobadosF = PersonalAulaNotaFinal.objects.filter(
            peaaula__id_pea_id__in=personal.filter(sexo='F').values_list('id_pea', flat=True),
            nota_final__gte=10).count()

        data = [
            {'name': 'Seleccionados para Capacitación',
             'data': [personal.filter(sexo='F').count(), personal.filter(sexo='M').count()]},
            {'name': 'Personal Capacitado',
             'data': [personal.filter(sexo='F').count(), personal.filter(sexo='M').count()]},
            {'name': 'Titulares', 'data': [aprobadosF, aprobadosM]}
        ]

        return JsonResponse(data, safe=False)


class grupoEdad(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
        filter = {'id_cargofuncional__in': cargos, 'contingencia': 0}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi

        personal = Personal.objects.filter(**filter)
        print(filter)
        aprobados = PersonalAulaNotaFinal.objects.filter(
            peaaula__id_pea_id__in=personal.values_list('id_pea', flat=True),
            nota_final__gte=10)
        p15_17 = personal.filter(edad__range=[15, 17]).count()
        p18_19 = personal.filter(edad__range=[18, 19]).count()
        p20_30 = personal.filter(edad__range=[20, 30]).count()
        p31_40 = personal.filter(edad__range=[31, 40]).count()
        p51_60 = personal.filter(edad__range=[41, 60]).count()
        p61_mas = personal.filter(edad__range=[61, 500]).count()

        a15_17 = aprobados.filter(peaaula__id_pea__edad__range=[15, 17]).count()
        a18_19 = aprobados.filter(peaaula__id_pea__edad__range=[18, 19]).count()
        a20_30 = aprobados.filter(peaaula__id_pea__edad__range=[20, 30]).count()
        a31_40 = aprobados.filter(peaaula__id_pea__edad__range=[31, 40]).count()
        a51_60 = aprobados.filter(peaaula__id_pea__edad__range=[41, 60]).count()
        a61_mas = aprobados.filter(peaaula__id_pea__edad__range=[61, 100]).count()
        data = [
            {'name': 'Seleccionados para Capacitación',
             'data': [p15_17, p18_19, p20_30, p31_40, p51_60, p61_mas]},
            {'name': 'Personal Capacitado',
             'data': [p15_17, p18_19, p20_30, p31_40, p51_60, p61_mas]},
            {'name': 'Titulares',
             'data': [a15_17, a18_19, a20_30, a31_40, a51_60, a61_mas]},
        ]
        return JsonResponse(data, safe=False)


class nivelEducativo(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
        filter = {'id_cargofuncional__in': cargos, 'contingencia': 0}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi

        personal = Personal.objects.filter(**filter)
        aprobados = PersonalAulaNotaFinal.objects.filter(
            peaaula__id_pea_id__in=personal.values_list('id_pea', flat=True), sw_titu=1, seleccionado=1).values_list(
            'peaaula__id_pea', flat=True)
        quintosecundaria = personal.filter(grado__grado_id=11).count()
        superiornouniversitaria = personal.filter(grado__nivel_id=5, grado__grado_id__in=[1, 2, 4]).count()
        superioruniversitaria = personal.filter(grado__nivel_id=4, grado__grado_id__in=[1, 2, 3, 4]).count()

        aquintosecundaria = Personal.objects.filter(id_pea__in=aprobados, grado__grado_id=11).count()
        asuperiornouniversitaria = Personal.objects.filter(id_pea__in=aprobados, grado__nivel_id=5,
                                                           grado__grado_id__in=[1, 2, 4]).count()
        asuperioruniversitaria = Personal.objects.filter(id_pea__in=aprobados, grado__nivel_id=4,
                                                         grado__grado_id__in=[1, 2, 3, 4]).count()

        data = [
            {'name': 'Seleccionados para Capacitación',
             'data': [quintosecundaria, superiornouniversitaria, superioruniversitaria]},
            {'name': 'Personal Capacitado',
             'data': [quintosecundaria, superiornouniversitaria, superioruniversitaria]},
            {'name': 'Titulares',
             'data': [aquintosecundaria, asuperiornouniversitaria, asuperioruniversitaria]},
        ]
        return JsonResponse(data, safe=False)


class profesion(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
        filter = {'id_cargofuncional__in': cargos, 'contingencia': 0}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi

        data = [
            {'name': 'Seleccionados para Capacitación',
             'data': []},
            {'name': 'Personal Capacitado',
             'data': []},
            {'name': 'Titulares',
             'data': []},
        ]
        personal = Personal.objects.filter(**filter)
        rank5 = personal.values('profesion_id', 'profesion__detalle').annotate(total=Count('profesion_id')).order_by(
            '-total')[:5]
        response = {'categories': [], 'series_data': data}
        aprobados = PersonalAulaNotaFinal.objects.filter(
            peaaula__id_pea_id__in=personal.values_list('id_pea', flat=True), sw_titu=1, seleccionado=1)
        for rank in rank5:
            response['categories'].append(rank['profesion__detalle'])
            data[0]['data'].append(personal.filter(profesion_id=rank['profesion_id']).count())
            data[1]['data'].append(personal.filter(profesion_id=rank['profesion_id']).count())
            data[2]['data'].append(aprobados.filter(peaaula__id_pea__profesion=rank['profesion_id']).count())

        return JsonResponse(response, safe=False)


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
        ficha = Ficha177.objects.using('consecucion').filter(dni=pea.dni)
        if ficha.count():
            ficha = Ficha177.objects.using('consecucion').get(dni=pea.dni)
            if ficha.tipo_inst != 0:
                pea.tipo_inst_id = ficha.tipo_inst
            if ficha.grado != 0:
                pea.grado_id = ficha.grado
            if ficha.profesion != '0' and ficha.profesion != '#N/A':
                pea.profesion_id = ficha.profesion
            print(ficha.profesion)
            pea.save()

    return JsonResponse({'msg': 'actualizado'})


def updateSexo(request):
    personal = Personal.objects.all()
    for pea in personal:
        ficha = Ficha177.objects.using('consecucion').filter(dni=pea.dni)
        if ficha.count():
            ficha = Ficha177.objects.using('consecucion').get(dni=pea.dni)
            pea.sexo = ficha.sexo
            pea.edad = ficha.edad
            pea.save()

    return JsonResponse({'msg': 'actualizado'})
