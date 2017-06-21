from rest_framework.views import APIView
from django.db.models import Count, Value
from django.http import JsonResponse
from .models import Ubigeo, Zona
from locales_consecucion.models import Local, LocalAmbiente


class DepartamentosList(APIView):
    def get(self, request):
        departamentos = list(
            Ubigeo.objects.values('ccdd', 'departamento').annotate(dcount=Count('ccdd', 'departamento')))
        response = JsonResponse(departamentos, safe=False)
        return response


class ProvinciasList(APIView):
    def get(self, request, ccdd):
        provincias = list(
            Ubigeo.objects.filter(ccdd=ccdd).values('ccpp', 'provincia').annotate(dcount=Count('ccpp', 'provincia')))
        response = JsonResponse(provincias, safe=False)
        return response


class DistritosList(APIView):
    def get(self, request, ccdd, ccpp):
        distritos = list(Ubigeo.objects.filter(ccdd=ccdd, ccpp=ccpp).values('ccdi', 'distrito').annotate(
            dcount=Count('ccdi', 'distrito')))
        response = JsonResponse(distritos, safe=False)
        return response


class ZonasList(APIView):
    def get(self, request, ubigeo):
        zonas = list(
            Zona.objects.filter(UBIGEO=ubigeo).values('ID', 'UBIGEO', 'ZONA', 'ETIQ_ZONA').annotate(
                dcount=Count('UBIGEO', 'ZONA')).order_by('ZONA'))
        response = JsonResponse(zonas, safe=False)
        return response


class LocalesList(APIView):
    def get(self, request, curso, ubigeo, zona):
        response = Local.objects.filter(ubigeo_id=ubigeo, zona_ubicacion_local=zona, localcurso__curso_id=curso).values(
            'id_local',
            'nombre_local')
        return JsonResponse(list(response), safe=False)


class AulasList(APIView):
    def get(self, request, id_local):
        response = LocalAmbiente.objects.filter(localcurso__local_id=id_local).values()

        return JsonResponse(list(response), safe=False)

class Dep_ubigeo(APIView):
    def get(self, request, ubigeo):
        response = Ubigeo.objects.get(ubigeo=ubigeo).departamento
        print(response)

        return JsonResponse(response, safe=False)
