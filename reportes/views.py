from django.shortcuts import render
from ubigeo.models import *
from locales_consecucion.models import *
from .models import Reportes
from django.http import JsonResponse
from rest_framework.views import APIView
from django.db.models import Count, Value, F, Sum
from asistencia.serializer import PersonalAulaDetalleSerializer
from rest_framework import generics, viewsets
from django.utils.text import slugify
from evaluacion.serializer import PeaNotaFinalSinInternetSerializer


def getReportes(request):
    query = list(Reportes.objects.all().values().order_by('order'))
    return JsonResponse(query, safe=False)


def putHTMLSlugReportes(request):
    reportes = Reportes.objects.all()
    for reporte in reportes:
        reporte.slug = slugify(reporte.nombre)
        reporte.template_html = slugify(reporte.nombre) + '.html'
        reporte.save()
        open('templates/reportes/' + reporte.template_html, 'w')

    return JsonResponse({'msg': 'Slug actualizado'})


"""
Reporte N° 1
"""


class NumeroaulasCoberturadas(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {}
        if ccdd is not None:
            filter['ccdd'] = ccdd
            annotate = ('ccpp',)
        if ccpp is not None:
            filter['ccpp'] = ccpp
            annotate = ('ccdi',)
        if ccdi is not None:
            filter['ccdi'] = ccdi
            annotate = ('zona',)
        if zona is not None:
            filter['zona'] = zona

        response = []
        print(filter)
        metaUbigeos = MetaAula.objects.filter(**filter).values(*annotate).annotate(dcount=Count(*annotate))
        print(metaUbigeos)
        for meta in metaUbigeos:
            data = {'departamento': '', 'provincia': '', 'distrito': '', 'totalaulas_meta': 0, 'aulas_disponible': 0,
                    'aulas_usar': 0}

            response.append(data)

        return JsonResponse(response, safe=False)


"""
Reporte N° 2
"""


class postulantesSeleccionadosporCurso(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)

        filter = {}
        filter['id_cargofuncional_id__in'] = cargos
        filter['contingencia'] = 0
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi
        if zona is not None:
            filter['ubigeo__zona'] = zona

        cantidad = Personal.objects.filter(**filter).count()
        return JsonResponse({'cantidad': cantidad})


"""
Reporte N° 3
"""


class postulantesAsistieronporCurso(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)

        filter = {}
        filter['id_cargofuncional_id__in'] = cargos
        filter['contingencia'] = 0
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi
        if zona is not None:
            filter['ubigeo__zona'] = zona

        cantidad = Personal.objects.filter(**filter).count()
        return JsonResponse({'cantidad': cantidad})


"""
Reporte N°7
"""


class directoriolocalesNumeroAmbientes(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi
        if zona is not None:
            filter['zona_ubicacion_local'] = zona

        query = DirectorioLocal.objects.filter(**filter, directoriolocalcurso__curso_id=curso).values()
        return JsonResponse(list(query), safe=False)


"""
Reporte N°8
"""


class localseleccionadoNumeroAmbientes(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi
        if zona is not None:
            filter['zona_ubicacion_local'] = zona

        query = Local.objects.filter(**filter, localcurso__curso_id=curso).values()
        return JsonResponse(list(query), safe=False)


"""
Reporte N°10
"""


class asistenciaporCurso(generics.ListAPIView):
    serializer_class = PersonalAulaDetalleSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']

        ambientes = LocalAmbiente.objects.filter(localcurso__curso_id=curso).values_list('id_localambiente', flat=True)
        return PersonalAula.objects.filter(id_localambiente_id__in=ambientes)


"""
Reporte N°11 Con Internet
"""


class registroNotasporCursoConInternet(generics.ListAPIView):
    serializer_class = PersonalAulaDetalleSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)
        filter = {}
        if 'ccdd' in self.kwargs:
            filter['id_pea__ubigeo__ccdd'] = self.kwargs['ccdd']

        if 'ccpp' in self.kwargs:
            filter['id_pea__ubigeo__ccpp'] = self.kwargs['ccpp']

        if 'ccdi' in self.kwargs:
            filter['id_pea__ubigeo__ccdi'] = self.kwargs['ccdi']

        if 'zona' in self.kwargs:
            filter['id_pea__zona'] = self.kwargs['zona']

        query = PersonalAula.objects.filter(id_pea__id_cargofuncional__in=cargos, **filter)
        return query


"""
Reporte N°11 Sin Internet
"""


class registroNotasporCursoSinInternet(generics.ListAPIView):
    serializer_class = PeaNotaFinalSinInternetSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)
        filter = {}
        if 'ccdd' in self.kwargs:
            filter['id_pea__ubigeo__ccdd'] = self.kwargs['ccdd']

        if 'ccpp' in self.kwargs:
            filter['id_pea__ubigeo__ccpp'] = self.kwargs['ccpp']

        if 'ccdi' in self.kwargs:
            filter['id_pea__ubigeo__ccdi'] = self.kwargs['ccdi']

        if 'zona' in self.kwargs:
            filter['id_pea__zona'] = self.kwargs['zona']

        query = PeaNotaFinalSinInternet.objects.filter(id_pea__id_cargofuncional__in=cargos, **filter)
        return query
