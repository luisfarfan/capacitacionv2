from django.shortcuts import render
from ubigeo.models import *
from locales_consecucion.models import *
from .models import Reportes
from django.http import JsonResponse
from rest_framework.views import APIView

def getReportes(request):
    query = list(Reportes.objects.all().values().order_by('order'))
    return JsonResponse(query, safe=False)

# class directoriolocalesNumeroAmbientes(APIView):
#     def
