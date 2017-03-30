from locales_consecucion.models import *
from locales_consecucion.serializer import LocalCursoDetalleSerializer
from .serializer import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MetaSeleccion, Ficha177
import json
from django.db.models import Count, Value
from rest_framework.views import APIView


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
        id_cargofuncional = self.kwargs['id_cargofuncional']
        filter = {}
        filter['id_pea__id_cargofuncional_id'] = id_cargofuncional
        if 'ccdd' in self.kwargs:
            filter['id_pea__ubigeo__ccdd'] = self.kwargs['ccdd']

        if 'ccpp' in self.kwargs:
            filter['id_pea__ubigeo__ccpp'] = self.kwargs['ccpp']

        if 'ccdi' in self.kwargs:
            filter['id_pea__ubigeo__ccdi'] = self.kwargs['ccdi']

        if 'zona' in self.kwargs:
            filter['id_pea__zona'] = self.kwargs['zona']

        print(filter)
        return PersonalAula.objects.filter(**filter).order_by(
            '-personalaula_notafinal__nota_final')


class PersonalAulaDetalleNotaFinalSinInternetViewSet(generics.ListAPIView):
    serializer_class = PeaNotaFinalSinInternetSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
        filter = {}
        filter['id_cargofuncional_id__in'] = cargos
        if 'ccdd' in self.kwargs:
            filter['ubigeo__ccdd'] = self.kwargs['ccdd']

        if 'ccpp' in self.kwargs:
            filter['ubigeo__ccpp'] = self.kwargs['ccpp']

        if 'ccdi' in self.kwargs:
            filter['ubigeo__ccdi'] = self.kwargs['ccdi']

        if 'zona' in self.kwargs:
            filter['zona'] = self.kwargs['zona']

        return Personal.objects.filter(**filter).order_by(
            '-personalaula_notafinal__nota_final')


class PersonalNotaFinalSinInternetViewSet(generics.ListAPIView):
    serializer_class = PeaNotaFinalSinInternetSerializer

    def get_queryset(self):
        cargo = self.kwargs['cargo']
        filter = {}
        filter['pea__id_cargofuncional_id'] = cargo
        if 'ccdd' in self.kwargs:
            filter['pea__ubigeo__ccdd'] = self.kwargs['ccdd']

        if 'ccpp' in self.kwargs:
            filter['pea__ubigeo__ccpp'] = self.kwargs['ccpp']

        if 'ccdi' in self.kwargs:
            filter['pea__ubigeo__ccdi'] = self.kwargs['ccdi']

        if 'zona' in self.kwargs:
            filter['pea__zona'] = self.kwargs['zona']
        print(filter)
        return PeaNotaFinalSinInternet.objects.filter(**filter)


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


def saveNotaFinalSinInternet(request):
    postdata = request.POST['data']
    dataDict = json.loads(postdata)

    for data in dataDict:
        nota_final = PeaNotaFinalSinInternet.objects.filter(pea_id=data['id_pea']).count()
        if nota_final:
            notafinalpea = PeaNotaFinalSinInternet.objects.get(pea_id=data['id_pea'])
            notafinalpea.nota_final = data['nota_final']
        else:
            notafinalpea = PeaNotaFinalSinInternet(pea_id=data['id_pea'], nota_final=data['nota_final'])
        notafinalpea.save()
    return JsonResponse({'msg': 'Guardado correcto'})


class UbigeosRankeoViewSet(APIView):
    def get(self, request, ccdd=None, ccpp=None, ccdi=None):
        return JsonResponse(list(ambitosRankeo(ccdd, ccpp, ccdi)), safe=False)


def ambitosRankeo(ccdd=None, ccpp=None, ccdi=None):
    filter = {}
    zonaFilter = {}
    query = Ubigeo.objects
    if ccdd is None:
        queryFinal = query.values('ccdd', 'departamento').annotate(dcount=Count('ccdd', 'departamento'))
    if ccdd is not None:
        filter['ccdd'] = ccdd
        queryFinal = query.filter(**filter).values('ccdd', 'ccpp', 'provincia', 'departamento').annotate(
            dcount=Count('ccpp', 'provincia'))
    if ccpp is not None:
        filter['ccdd'] = ccdd
        filter['ccpp'] = ccpp
        queryFinal = query.filter(**filter).values('ccdd', 'ccpp', 'ccdi', 'distrito', 'departamento',
                                                   'provincia').annotate(dcount=Count('ccdi', 'distrito'))
    if ccdi is not None:
        zonaFilter['UBIGEO'] = ccdd + ccpp + ccdi
        return Zona.objects.filter(**zonaFilter).values()

    return queryFinal


class Meta(APIView):
    def get(self, request, ubigeo, cargofuncional, zona=None):
        filter = {'ubigeo': ubigeo, 'id_cargofuncional': cargofuncional}
        if zona is not None:
            filter['zona'] = zona
        else:
            filter['zona__isnull'] = True
        query = MetaSeleccion.objects.filter(**filter).values()
        return JsonResponse(list(query), safe=False)


class PersonalNotasSinInternetViewSet(viewsets.ModelViewSet):
    queryset = PeaNotaFinalSinInternet.objects.all()
    serializer_class = PersonalNotaFinalSinInternetSerializer


class PersonalNotasSinInternet(generics.ListAPIView):
    serializer_class = PeaNotaFinalSinInternetSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        ubigeo = self.kwargs['ubigeo']
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)

        return PeaNotaFinalSinInternet.objects.filter(pea__id_cargofuncional__in=cargos, pea__ubigeo=ubigeo)


def cerrarCursoConInternet(request):
    postdata = request.POST['data']
    dataDict = json.loads(postdata)

    for data in dataDict:
        peanota = PersonalAulaNotaFinal.objects.get(peaaula=data['peaaula'])
        peanota.bandaprob = data['bandaprob']
        peanota.capacita = data['capacita']
        peanota.seleccionado = data['seleccionado']
        peanota.sw_titu = data['sw_titu']
        peanota.notacap = data['notacap']
        peanota.save()
        sendChio(peanota)

    return JsonResponse({'msg': 'Guardado correcto'})


def sendChio(peanota):
    try:
        ficha = Ficha177.objects.using('consecucion').get(id_per=peanota.peaaula.id_pea.id_per)
        ficha.bandaprob = peanota.bandaprob
        ficha.capacita = peanota.capacita
        ficha.seleccionado = peanota.seleccionado
        ficha.sw_titu = peanota.sw_titu
        ficha.notacap = peanota.notacap
        ficha.zona_i = peanota.peaaula.id_pea.zona
        ficha.seccion_i = '1'
        ficha.save()
    except:
        pass

    return True
