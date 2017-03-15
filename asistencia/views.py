from locales_consecucion.models import *
from locales_consecucion.serializer import LocalCursoDetalleSerializer
from .serializer import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F, FloatField, Sum
from .utils import *
import json


class LocalAmbientebyInstructorViewSet(generics.ListAPIView):
    serializer_class = LocalAmbienteInstructorSerializer

    def get_queryset(self):
        id_instructor = self.kwargs['id_instructor']
        curso = self.kwargs['curso']

        return LocalAmbiente.objects.filter(localcurso__curso=curso, id_instructor=id_instructor)


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
        return PersonalAula.objects.filter(id_localambiente_id=id_localambiente)


@csrf_exempt
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
