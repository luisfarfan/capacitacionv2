from locales_consecucion.models import *
from locales_consecucion.serializer import LocalCursoDetalleSerializer
from .serializer import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F, FloatField, Sum
import json


# class LocalAmbientebyInstructorViewSet(generics.ListAPIView):
#     serializer_class = LocalAmbienteInstructorSerializer
#
#     def get_queryset(self):
#         id_instructor = self.kwargs['id_instructor']
#         curso = self.kwargs['curso']
#
#         return LocalAmbiente.objects.filter(localcurso__curso=curso, id_instructor=id_instructor)

class CriterioCursoFilterViewSet(generics.ListAPIView):
    serializer_class = CriterioCursoSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        return CursoCriterio.objects.filter(curso_id=curso)


class CriteriosCursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer


class LocalCursoDetallebyLocalAmbienteViewSet(viewsets.ModelViewSet):
    queryset = LocalCurso.objects.all()
    serializer_class = LocalCursoDetalleSerializer


@csrf_exempt
def saveNotas(request):
    postdata = request.POST['personalnotas']
    dataDict = json.loads(postdata)

    for data in dataDict:
        evaluacion = PersonalCursoCriterio.objects.filter(peaaula_id=data['peaaula'],
                                                          cursocriterio_id=data['criterio']).count()

        if data['nota'] == '':
            data['nota'] = None

        if evaluacion:
            notapea = PersonalCursoCriterio.objects.get(peaaula_id=data['peaaula'], cursocriterio_id=data['criterio'])
            notapea.nota = data['nota']
        else:
            notapea = PersonalCursoCriterio(peaaula_id=data['peaaula'],
                                            cursocriterio_id=data['criterio'], nota=data['nota'])
        notapea.save()
    return JsonResponse({'msg': 'Guardado correcto'})

# def saveNotas(request):
#     data = request.POST['personalnotas']
#
#     evaluacion = PersonalCursoCriterio.objects.filter(peaaula_id=data['peaaula'],
#                                                       criterio_id=data['criterio']).count()
#     if data['nota'] == '':
#         data['nota'] = None
#
#     if evaluacion:
#         notapea = PersonalCursoCriterio.objects.get(peaaula_id=data['peaaula'], criterio_id=data['criterio'])
#         notapea.nota = data['nota']
#     else:
#         notapea = PersonalCursoCriterio(peaaula_id=data['peaaula'],
#                                         criterio_id=data['criterio'], nota=data['nota'])
#     notapea.save()
#
#     return JsonResponse({'msg': 'Guardado correcto'})
