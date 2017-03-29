from django.shortcuts import render
from ubigeo.models import *
from locales_consecucion.models import *
from .models import Reportes
from django.http import JsonResponse
from rest_framework.views import APIView
from django.db.models import Count, Value, F, Sum
from asistencia.serializer import PersonalAulaDetalleSerializer
from rest_framework import generics, viewsets


def getReportes(request):
    query = list(Reportes.objects.all().values().order_by('order'))
    return JsonResponse(query, safe=False)


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


class asistenciaporCurso(generics.ListAPIView):
    serializer_class = PersonalAulaDetalleSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']

        ambientes = LocalAmbiente.objects.filter(localcurso__curso_id=curso).values_list('id_localambiente', flat=True)
        return PersonalAula.objects.filter(id_localambiente_id__in=ambientes)
