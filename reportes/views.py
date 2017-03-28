from django.shortcuts import render
from ubigeo.models import *
from locales_consecucion.models import *
from .models import Reportes
from django.http import JsonResponse
from rest_framework.views import APIView
from django.db.models import Count, Value, F, Sum


def getReportes(request):
    query = list(Reportes.objects.all().values().order_by('order'))
    return JsonResponse(query, safe=False)


class directoriolocalesNumeroAmbientes(APIView):
    def get(self, request, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi
        if zona is not None:
            filter['zona_ubicacion_local'] = zona

        query = DirectorioLocal.objects.filter(**filter).values()
        return JsonResponse(list(query), safe=False)


class localseleccionadoNumeroAmbientes(APIView):
    def get(self, request, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi
        if zona is not None:
            filter['zona_ubicacion_local'] = zona

        query = Local.objects.filter(**filter).values()
        return JsonResponse(list(query), safe=False)
