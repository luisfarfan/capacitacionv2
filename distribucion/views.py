from locales_consecucion.models import *
from .serializer import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


class LocalZonaViewSet(viewsets.ModelViewSet):
    queryset = LocalZonas.objects.all()
    serializer_class = LocalZonasSerializer


class LocalZonaDetalleViewSet(generics.ListAPIView):
    serializer_class = LocalZonasDetalleSerializer

    def get_queryset(self):
        localcurso = self.kwargs['localcurso']
        return LocalZonas.objects.filter(localcurso_id=localcurso)


class FilterZonaViewSet(generics.ListAPIView):
    serializer_class = ZonaSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        # localcurso = self.kwargs['localcurso']
        ubigeo = self.kwargs['ubigeo']
        return Zona.objects.exclude(
            ID__in=LocalZonas.objects.filter(localcurso__curso_id=curso).values('zona_id')).filter(
            UBIGEO=ubigeo)


@csrf_exempt
def saveZonasLocal(request):
    localcurso = request.POST['localcurso']
    zonas = request.POST.getlist('zonas[]')

    for zona in zonas:
        localzona = LocalZonas(localcurso_id=localcurso, zona_id=zona)
        localzona.save()

    response = list(LocalZonas.objects.filter(localcurso_id=localcurso).values())
    return JsonResponse(response, safe=False)
