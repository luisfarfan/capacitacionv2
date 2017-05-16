from locales_consecucion.models import *
from locales_consecucion.serializer import LocalCursoDetalleSerializer
from .serializer import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F, FloatField, Sum
from .utils import *
import json
from distribucion.serializer import CrudPersonalSerializer, DetallePersonalSerializer


class LocalAmbientebyInstructorViewSet(generics.ListAPIView):
    serializer_class = LocalAmbienteInstructorSerializer

    def get_queryset(self):
        id_instructor = self.kwargs['id_instructor']
        curso = self.kwargs['curso']

        return LocalAmbiente.objects.filter(localcurso__curso=curso, id_instructor=id_instructor)


class LocalAmbientebyLocal(generics.ListAPIView):
    serializer_class = LocalAmbienteInstructorSerializer

    def get_queryset(self):
        id_local = self.kwargs['id_local']
        return LocalAmbiente.objects.filter(localcurso__local_id=id_local)


class LocalCursoDetallebyLocalAmbienteViewSet(viewsets.ModelViewSet):
    queryset = LocalCurso.objects.all()
    serializer_class = LocalCursoDetalleSerializer


@csrf_exempt
def rangoFechas(request):
    fecha_inicio = request.POST['fecha_inicio']
    fecha_fin = request.POST['fecha_fin']
    rango = getRangoFechas(fecha_inicio, fecha_fin)

    return JsonResponse(rango, safe=False)


class PersonalAulaDetalleViewSet(viewsets.ModelViewSet):
    queryset = PersonalAula.objects.all()
    serializer_class = PersonalAulaDetalleSerializer


class FilterPersonalAulaDetalleViewSet(generics.ListAPIView):
    serializer_class = PersonalAulaDetalleSerializer

    def get_queryset(self):
        id_localambiente = self.kwargs['id_localambiente']
        return PersonalAula.objects.filter(id_localambiente_id=id_localambiente).order_by('id_pea__baja_estado',
                                                                                          'id_pea__ape_paterno')


def saveAsistencia(request):
    postdata = request.POST['personalasistencia']
    dataDict = json.loads(postdata)

    for data in dataDict:
        asistencia = PersonalAulaAsistencia.objects.filter(peaaula_id=data['id_personalaula'],
                                                           fecha=data['fecha']).count()
        if asistencia:
            personalAsistencia = PersonalAulaAsistencia.objects.get(peaaula_id=data['id_personalaula'],
                                                                    fecha=data['fecha'])
            personalAsistencia.turno_manana = data['turno_manana']
            personalAsistencia.turno_tarde = data['turno_tarde']
        else:
            personalAsistencia = PersonalAulaAsistencia(peaaula_id=data['id_personalaula'],
                                                        fecha=data['fecha'])
            personalAsistencia.turno_manana = data['turno_manana']
            personalAsistencia.turno_tarde = data['turno_tarde']

        personalAsistencia.save()

    return JsonResponse({'msg': 'Guardado correcto'})


def saveAsistenciaEmpadronadorUrbano(request):
    postdata = request.POST['personalasistencia']
    dataDict = json.loads(postdata)
    bulk_insert = []

    for data in dataDict:
        personalAsistencia = PersonalAulaAsistencia()
        personalAsistencia.peaaula_id = data['id_personalaula']
        personalAsistencia.fecha = data['fecha']
        personalAsistencia.turno_manana = data['turno_manana']
        personalAsistencia.turno_tarde = data['turno_tarde']
        bulk_insert.append(personalAsistencia)

    PersonalAulaAsistencia.objects.bulk_create(bulk_insert)

    return JsonResponse({'msg': 'Guardado correcto'})


class PersonalViewSet(viewsets.ModelViewSet):
    serializer_class = CrudPersonalSerializer
    queryset = Personal.objects.all()


class DetallePersonalViewSet(viewsets.ModelViewSet):
    serializer_class = DetallePersonalSerializer
    queryset = Personal.objects.all()


@csrf_exempt
def darAlta(request):
    id_localambiente = request.POST['id_localambiente']
    id_pea = request.POST['id_pea']
    id_pea_reemplazo = request.POST['id_pea_reemplazo']

    pea = Personal.objects.get(pk=id_pea)
    pea.id_pea_reemplazo_id = id_pea_reemplazo
    pea.save()

    peareemplazo = Personal.objects.get(pk=id_pea_reemplazo)
    peareemplazo.contingencia = 0
    peareemplazo.alta_estado = 1
    peareemplazo.zona = pea.zona
    peareemplazo.save()

    peaaula = PersonalAula(id_localambiente_id=id_localambiente, id_pea_id=id_pea_reemplazo)
    peaaula.save()

    return JsonResponse({'msg': True})


def deshacerBaja(request):
    id_pea = request.POST['id_pea']
    personal_baja = Personal.objects.get(pk=id_pea)
    personal_baja.baja_estado = 0
    if personal_baja.id_pea_reemplazo_id is not None:
        personal_alta = Personal.objects.get(pk=personal_baja.id_pea_reemplazo_id)
        personal_alta.alta_estado = 0
        personal_alta.contingencia = 1
        personal_alta.save()
    personal_baja.id_pea_reemplazo_id = None
    personal_baja.save()

    return JsonResponse({'msg': 'Hecho'})


def deshacerAlta(request):
    id_pea = request.POST['id_pea']
    Personal.objects.filter(id_pea_reemplazo_id=id_pea).update(id_pea_reemplazo_id=None)
    Personal.objects.filter(id_pea=id_pea).update(contingencia=1, alta_estado=0)
    return JsonResponse({'msg': 'Hecho'})
