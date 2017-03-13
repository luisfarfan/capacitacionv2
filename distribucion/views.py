from locales_consecucion.models import *
from .serializer import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F, FloatField, Sum
from .utils import localAmbienteValid


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


class PersonalCapacitarbyCursoViewSet(generics.ListAPIView):
    serializer_class = PersonalSerializer

    def get_queryset(self):
        localcurso = self.kwargs['localcurso']
        curso_id = LocalCurso.objects.get(pk=localcurso).curso_id
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso_id).values_list('id_cargofuncional', flat=True)
        zonas = LocalZonas.objects.filter(localcurso_id=localcurso).values_list('zona__ZONA', flat=True)
        ubigeos = LocalZonas.objects.filter(localcurso_id=localcurso).values_list('zona__UBIGEO', flat=True).distinct()
        return Personal.objects.filter(ubigeo_id__in=ubigeos, zona__in=zonas, id_cargofuncional_id__in=cargos,
                                       contingencia=0, baja_estado=0)


@csrf_exempt
def distribuir_byLocalCurso(request, localcurso_id):
    localCurso = LocalCurso.objects.get(pk=localcurso_id)

    cargosporCurso = CursoCargoFuncional.objects.filter(id_curso_id=localCurso.curso_id).values_list(
        'id_cargofuncional', flat=True)
    localzona = LocalZonas.objects.filter(localcurso_id=localcurso_id)
    zonas = localzona.values_list('zona__ZONA', flat=True)
    ubigeo = localzona.values_list('zona__UBIGEO', flat=True)
    localAmbientes = LocalAmbiente.objects.filter(localcurso_id=localcurso_id).order_by('capacidad')
    # localAmbientesCapacidadTotal = localAmbientes.aggregate(capacidadTotal=Sum('capacidad'))

    # pea_distribuir_cantidad = pea_distribuir.count()
    for localAmbiente in localAmbientes:
        bulk = []
        capacidadDistribuir = localAmbienteValid(localAmbiente.id_localambiente)
        peaDistribuida = PersonalAula.objects.values_list('id_pea', flat=True)
        if capacidadDistribuir > 0:
            _pea_distribuir = Personal.objects.exclude(id_pea__in=peaDistribuida).filter(
                ubigeo_id=ubigeo[0], zona__in=zonas,
                id_cargofuncional_id__in=cargosporCurso, contingencia=0,
                baja_estado=0)
            pea_distribuir = _pea_distribuir.order_by('ubigeo', 'zona', 'ape_paterno', 'ape_materno',
                                                      'nombre')[:capacidadDistribuir]
            print(pea_distribuir.count(), _pea_distribuir.count())
            if _pea_distribuir.count():
                for pea in pea_distribuir:
                    bulk.append(PersonalAula(id_pea_id=pea.id_pea, id_localambiente_id=localAmbiente.id_localambiente))

                PersonalAula.objects.bulk_create(bulk)

    return JsonResponse({'msg': 'Personal Distribuido exitosamente'})


class LocalAmbienteDetalleViewSet(generics.ListAPIView):
    serializer_class = LocalAmbienteDetalleSerializer

    def get_queryset(self):
        localcurso = self.kwargs['localcurso']
        return LocalAmbiente.objects.filter(localcurso_id=localcurso)
