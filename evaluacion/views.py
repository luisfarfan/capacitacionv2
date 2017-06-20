from .serializer import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from .models import Ficha177
from reportes.models import MetaSeleccion,MetaSeleccion_zona
import json
from django.db.models import Count, Sum
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
        for person in PersonalAula.objects.all():
            print( person.id_pea)
        return PersonalAula.objects.filter(**filter).order_by(
            '-personalaula_notafinal__nota_final')


class PersonalAulaDetalleNotaFinalSinInternetViewSet(generics.ListAPIView):
    serializer_class = PersonalSinInternetSerializer

    def get_queryset(self):
        print('get_queryset PersonalAulaDetalleNotaFinalSinInternetViewSet')
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
        for person in Personal.objects.filter(**filter):
            print(person.ape_paterno)
        #return Personal.objects.filter(**filter)
        return Personal.objects.filter(**filter).order_by(
           '-personal_notafinal__nota_final')


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

        return PeaNotaFinalSinInternet.objects.filter(**filter).order_by('-nota_final')


def saveNotas(request):
    postdata = request.POST['personalnotas']
    dataDict = json.loads(postdata)

    for data in dataDict:
        evaluacion = PersonalCursoCriterio.objects.filter(peaaula_id=data['peaaula'],
                                                          cursocriterio_id=data['criterio']).count()

        ##if data['nota'] == '':

         ##   data['nota'] = None

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
    def get(self, request, cargofuncional, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {'id_cargofuncional': cargofuncional}
        meta = None
        annotate = ()
        if ccdd is not None:
            filter['ccdd'] = ccdd
            annotate = ('ccdd',)
        if ccpp is not None:
            filter['ccpp'] = ccpp
            annotate = ('ccdd', 'ccpp')
        if ccdi is not None:
            filter['ccdi'] = ccdi
            annotate = ('ccdd', 'ccpp', 'ccdi')
        if zona is not None:
            filter['zona'] = zona

        query = MetaSeleccion.objects.using('consecucion').filter(**filter)
        print(query)

        meta = 0
        if len(query) > 0:
            x=0
            for i in query:
                meta = meta + query[x].meta_campo
                x+=1

        #query = MetaSeleccion.objects.using('consecucion').filter(**filter).values(*annotate).annotate(
        #    sum=Sum('meta'))

        #print("meta a contratar --->{0}".format(query[0]['sum']))
        return JsonResponse({'meta': meta})

class PersonalNotasSinInternetViewSet(viewsets.ModelViewSet):
    queryset = PeaNotaFinalSinInternet.objects.all()
    serializer_class = PersonalNotaFinalSinInternetSerializer


class PersonalNotasSinInternet(generics.ListAPIView):
    serializer_class = PeaNotaFinalSinInternetSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        ubigeo = self.kwargs['ubigeo']
        cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)

        return PeaNotaFinalSinInternet.objects.filter(pea__id_cargofuncional__in=cargos, pea__ubigeo=ubigeo).order_by('pea__ape_paterno')


def validarCerrarCurso(curso, ubigeo, zona=None):
    print(curso, ubigeo, zona)
    cargos = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional', flat=True)
    if zona:
        personalaula = PersonalAula.objects.filter(id_pea__ubigeo=ubigeo, id_pea__id_cargofuncional__in=cargos,
                                                   id_pea__contingencia=0).count()
        personalaulanotas = PersonalAulaNotaFinal.objects.filter(peaaula__id_pea__ubigeo=ubigeo,
                                                                 peaaula__id_pea__id_cargofuncional__in=cargos,
                                                                 peaaula__id_pea__contingencia=0).count()
    else:
        if len(ubigeo) == 6:
            personalaula = PersonalAula.objects.filter(id_pea__ubigeo=ubigeo, id_pea__zona=zona,
                                                       id_pea__id_cargofuncional__in=cargos,
                                                       id_pea__contingencia=0).count()
            personalaulanotas = PersonalAulaNotaFinal.objects.filter(peaaula__id_pea__ubigeo=ubigeo,
                                                                     peaaula__id_pea__id_cargofuncional__in=cargos,
                                                                     peaaula__id_pea__contingencia=0).count()
        elif len(ubigeo) == 4:
            personalaula = PersonalAula.objects.filter(id_pea__ubigeo__ccdd=ubigeo[:2],
                                                       id_pea__ubigeo__ccpp=ubigeo[2:4],
                                                       id_pea__id_cargofuncional__in=cargos,
                                                       id_pea__contingencia=0).count()
            personalaulanotas = PersonalAulaNotaFinal.objects.filter(peaaula__id_pea__ubigeo__ccdd=ubigeo[:2],
                                                                     peaaula__id_pea__ubigeo__ccpp=ubigeo[2:4],
                                                                     peaaula__id_pea__id_cargofuncional__in=cargos,
                                                                     peaaula__id_pea__contingencia=0).count()
        elif len(ubigeo) == 2:
            print(ubigeo)
            personalaula = PersonalAula.objects.filter(id_pea__ubigeo__ccdd=ubigeo[:2],
                                                       id_pea__id_cargofuncional__in=cargos,
                                                       id_pea__contingencia=0).count()
            personalaulanotas = PersonalAulaNotaFinal.objects.filter(peaaula__id_pea__ubigeo__ccdd=ubigeo[:2],
                                                                     peaaula__id_pea__id_cargofuncional__in=cargos,
                                                                     peaaula__id_pea__contingencia=0).count()
    if personalaula > personalaulanotas:
        return False

    return True


def cerrarCursoConInternet(request, curso, ubigeo):
    if len(ubigeo) == 11:
        zona = ubigeo[-5:]
        ubigeo = ubigeo[:6]
    else:
        zona = None
    if validarCerrarCurso(curso, ubigeo, zona):
        postdata = request.POST['data']
        dataDict = json.loads(postdata)
        count = 0
        for data in dataDict:
            peanota = PersonalAulaNotaFinal.objects.get(peaaula=data['peaaula'])
            peanota.bandaprob = data['bandaprob']
            peanota.capacita = data['capacita']
            peanota.seleccionado = data['seleccionado']
            peanota.sw_titu = data['sw_titu']
            peanota.notacap = data['notacap']
            peanota.save()
            count = count + 1
            sendChio(peanota)
        return JsonResponse({'status': True, 'msg': 'Curso cerrado exitosamente!'})
    else:
        return JsonResponse({'status': False, 'msg': 'Aun no se puede cerrar curso, por que falta notas en zonas'})


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
        print(ficha.bandaprob, ficha.capacita, ficha.seleccionado, ficha.sw_titu, ficha.notacap, ficha.zona_i,
              ficha.seccion_i)
    except:
        pass

    return True


def algo(request):
    query = PersonalAulaNotaFinal.objects.filter(peaaula__id_pea__ubigeo=150113, peaaula__id_pea__zona='00500').values(
        'peaaula__id_pea__dni', 'nota_final', 'bandaprob', 'capacita', 'sw_titu', 'seleccionado',
        'peaaula__id_pea__zona')
    return JsonResponse(list(query), safe=False)


def bajas(request):
    query = PersonalAulaNotaFinal.objects.filter(peaaula__id_pea__ubigeo=150113, peaaula__id_pea__zona='00500',
                                                 bandaprob=4).values(
        'peaaula__id_pea__dni', 'nota_final', 'bandaprob', 'capacita', 'sw_titu', 'seleccionado',
        'peaaula__id_pea__zona')
    return JsonResponse(list(query), safe=False)


def altas(request):
    query = PersonalAulaNotaFinal.objects.filter(peaaula__id_pea__ubigeo=150113, peaaula__id_pea__zona='00500',
                                                 bandaprob=3).values(
        'peaaula__id_pea__dni', 'nota_final', 'bandaprob', 'capacita', 'sw_titu', 'seleccionado',
        'peaaula__id_pea__zona')
    return JsonResponse(list(query), safe=False)


def titulares(request):
    query = PersonalAulaNotaFinal.objects.exclude(
        id__in=PersonalAulaNotaFinal.objects.filter(bandaprob=3).values_list('id', flat=True)).filter(
        peaaula__id_pea__ubigeo=150113, peaaula__id_pea__zona='00500', sw_titu=1, capacita=1, seleccionado=1).values(
        'peaaula__id_pea__dni', 'nota_final', 'bandaprob', 'capacita', 'sw_titu', 'seleccionado',
        'peaaula__id_pea__zona')
    return JsonResponse(list(query), safe=False)


def reserva(request):
    query = PersonalAulaNotaFinal.objects.exclude(
        id__in=PersonalAulaNotaFinal.objects.filter(bandaprob=4).values_list('id', flat=True)).filter(
        peaaula__id_pea__ubigeo=150113, peaaula__id_pea__zona='00500', sw_titu=0, capacita=1, seleccionado=1).values(
        'peaaula__id_pea__dni', 'nota_final', 'bandaprob', 'capacita', 'sw_titu', 'seleccionado',
        'peaaula__id_pea__zona')
    return JsonResponse(list(query), safe=False)


def aprobados(request):
    query = PersonalAulaNotaFinal.objects.exclude(
        id__in=PersonalAulaNotaFinal.objects.filter(bandaprob=4).values_list('id', flat=True)).filter(
        peaaula__id_pea__ubigeo=150113, peaaula__id_pea__zona='00500', nota_final__gt=10).values(
        'peaaula__id_pea__dni', 'nota_final', 'bandaprob', 'capacita', 'sw_titu', 'seleccionado',
        'peaaula__id_pea__zona')
    return JsonResponse(list(query), safe=False)


def chio(request):
    query = PersonalAulaNotaFinal.objects.exclude(
        id__in=PersonalAulaNotaFinal.objects.filter(bandaprob=4).values_list('id', flat=True)).filter(
        peaaula__id_pea__ubigeo=150113, peaaula__id_pea__zona='00500', nota_final__gt=11).values_list(
        'peaaula__id_pea__dni', flat=True)
    return JsonResponse(list(query), safe=False)


def updateBajas(request):
    PersonalAulaNotaFinal.objects.filter(
        peaaula__id_pea__ubigeo='150113', peaaula__id_pea__zona='00400', peaaula__id_pea__baja_estado=1).update(
        nota_final=0)
    query = PersonalAulaNotaFinal.objects.filter(
        peaaula__id_pea__ubigeo='150113', peaaula__id_pea__zona='00400', peaaula__id_pea__baja_estado=1).values()
    return JsonResponse(list(query), safe=False)


"""
bandaprob:
- 3 alta
- 4 baja
capacita=0, seleccionado=0, sw_titu=0  = No seleccionado
capacita=1, seleccionado=1, sw_titu=1  = TITULAR
capacita=1, seleccionado=1, sw_titu=0  = RESERVA
"""


def cerrarCursoEmpadronador(request):
    postdata = request.POST['data']
    dataDict = json.loads(postdata)
    for data in dataDict:
        peaaula = PersonalAula.objects.get(pk=data)
        persona = Personal.objects.get(id_pea=peaaula.id_pea_id)
        PersonalAulaNotaFinal(peaaula_id=peaaula.id_peaaula, bandaprob=1, capacita=1, seleccionado=1, sw_titu=1,
                              notacap=20, nota_final=20).save()
        sendFicha177Empadronador(persona.id_per)

    return JsonResponse({'msg': 'Cierre de curso exitoso'})


def sendFicha177Empadronador(id_per):
    try:
        print(id_per)
        ficha = Ficha177.objects.using('consecucion').get(id_per=id_per)
        ficha.bandaprob = 1
        ficha.capacita = 1
        ficha.seleccionado = 1
        ficha.sw_titu = 1
        ficha.notacap = 20
        ficha.save()
    except:
        pass

    return True


def cerrarCursoSinInternet(request, curso, ubigeo):
    postdata = request.POST['data']
    dataDict = json.loads(postdata)

    for data in dataDict:
        peanota = PeaNotaFinalSinInternet.objects.get(pea_id=data['pea']['id_pea'])
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
        ficha = Ficha177.objects.using('consecucion').get(id_per=peanota.pea.id_per)
        ficha.bandaprob = peanota.bandaprob
        ficha.capacita = peanota.capacita
        ficha.seleccionado = peanota.seleccionado
        ficha.sw_titu = peanota.sw_titu
        ficha.notacap = peanota.notacap
        ficha.save()
    except:
        pass

    return True
