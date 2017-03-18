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


class CargosCursoViewSet(generics.ListAPIView):
    serializer_class = CargosCursoSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        return CursoCargoFuncional.objects.filter(id_curso_id=curso)


class PersonalAulaDetalleNotaFinalViewSet(generics.ListAPIView):
    serializer_class = PersonalAulaDetalleNotaFinalSerializer

    def get_queryset(self):
        ubigeo = self.kwargs['ubigeo']
        zona = self.kwargs['zona']
        id_cargofuncional = self.kwargs['id_cargofuncional']
        return PersonalAula.objects.filter(id_pea__ubigeo=ubigeo, id_pea__zona=zona,
                                           id_pea__id_cargofuncional_id=id_cargofuncional).order_by(
            '-personalaula_notafinal__nota_final')


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


@csrf_exempt
def saveNotasFinal(request):
    postdata = request.POST['personalnotasfinal']
    dataDict = json.loads(postdata)

    for data in dataDict:
        nota_final = PersonalAulaNotaFinal.objects.filter(peaaula_id=data['peaaula']).count()
        if nota_final:
            notafinalpea = PersonalAulaNotaFinal.objects.get(peaaula_id=data['peaaula'])
            notafinalpea.nota_final = data['nota_final']
        else:
            notafinalpea = PersonalAulaNotaFinal(peaaula_id=data['peaaula'], nota_final=data['nota_final'])
        notafinalpea.save()
    return JsonResponse({'msg': 'Guardado correcto'})
