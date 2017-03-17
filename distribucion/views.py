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
        peaDistribuida = PersonalAula.objects.filter(id_pea__ubigeo_id__in=ubigeos, id_pea__zona__in=zonas,
                                                     id_pea__id_cargofuncional_id__in=cargos).values_list('id_pea',
                                                                                                          flat=True)
        if 'contingencia' in self.kwargs:
            query = Personal.objects.exclude(id_pea__in=peaDistribuida).filter(ubigeo_id__in=ubigeos, zona__in=zonas,
                                                                               id_cargofuncional_id__in=cargos,
                                                                               contingencia=1)
        else:
            query = Personal.objects.exclude(id_pea__in=peaDistribuida).filter(ubigeo_id__in=ubigeos, zona__in=zonas,
                                                                               id_cargofuncional_id__in=cargos,
                                                                               contingencia=0, baja_estado=0)
        return query


@csrf_exempt
def distribuir_byLocalCurso(request, localcurso_id):
    localCurso = LocalCurso.objects.get(pk=localcurso_id)

    cargosporCurso = CursoCargoFuncional.objects.filter(id_curso_id=localCurso.curso_id).values_list(
        'id_cargofuncional', flat=True)
    localzona = LocalZonas.objects.filter(localcurso_id=localcurso_id)
    zonas = localzona.values_list('zona__ZONA', flat=True)
    ubigeo = localzona.values_list('zona__UBIGEO', flat=True)
    localAmbientes = LocalAmbiente.objects.filter(localcurso_id=localcurso_id).order_by('-capacidad')
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
            pea_distribuir = _pea_distribuir.order_by('zona', 'ape_paterno', 'ape_materno',
                                                      'nombre')[:capacidadDistribuir]
            if _pea_distribuir.count():
                for pea in pea_distribuir:
                    bulk.append(PersonalAula(id_pea_id=pea.id_pea, id_localambiente_id=localAmbiente.id_localambiente))

                PersonalAula.objects.bulk_create(bulk)

    return JsonResponse({'msg': 'Personal Distribuido exitosamente'})


class LocalAmbienteDetalleViewSet(generics.ListAPIView):
    serializer_class = LocalAmbienteDetalleSerializer

    def get_queryset(self):
        localcurso = self.kwargs['localcurso']
        return LocalAmbiente.objects.filter(localcurso_id=localcurso).order_by('id_ambiente', '-capacidad')


class PersonalAulaViewSet(viewsets.ModelViewSet):
    queryset = PersonalAula.objects.all()
    serializer_class = PersonalAulaCrudSerializer


@csrf_exempt
def setInstructor(request):
    localambiente_id = request.POST['localambiente_id']
    instructor_id = request.POST['instructor_id']

    PersonalAula.objects.filter(id_localambiente_id=localambiente_id).update(id_instructor=instructor_id)

    return JsonResponse(list(PersonalAula.objects.filter(id_localambiente_id=localambiente_id).values()), safe=False)


class PersonalAulaDetalleViewSet(generics.ListAPIView):
    serializer_class = PersonalAulaSerializer

    def get_queryset(self):
        localambiente = self.kwargs['id_localambiente']
        return PersonalAula.objects.filter(id_localambiente_id=localambiente, id_pea__baja_estado=0,
                                           id_pea__contingencia=0)
