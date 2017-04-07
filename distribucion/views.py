from rest_framework.views import APIView

from locales_consecucion.models import *
from .models import EnvioSMS
from .serializer import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F, FloatField, Sum
from .utils import localAmbienteValid
from django.db.models import Count, Value
import json


# class LocalZonaViewSet(viewsets.ModelViewSet):
#     queryset = LocalZonas.objects.all()
#     serializer_class = LocalZonasSerializer
#
#
class LocalZonaDetalleViewSet(APIView):
    def get(self, request, localcurso):
        ambitosLocalDetalle = []
        ambitosLocal = LocalAmbito.objects.filter(localcurso_id=localcurso)
        for ambito in ambitosLocal:
            ambitosLocalDetalle.append(
                {'ccdd': ambito.ccdd, 'ccpp': ambito.ccpp, 'ccdi': ambito.ccdi, 'zona': ambito.zona,
                 'departamento': Ubigeo.objects.filter(ccdd=ambito.ccdd)[
                     0].departamento if ambito.ccdd is not None else None,
                 'provincia': Ubigeo.objects.filter(ccdd=ambito.ccdd, ccpp=ambito.ccpp)[
                     0].provincia if ambito.ccpp is not None else None,
                 'distrito': Ubigeo.objects.filter(ccdd=ambito.ccdd, ccpp=ambito.ccpp, ccdi=ambito.ccdi)[
                     0].distrito if ambito.ccdi is not None else None,
                 'localcurso': ambito.localcurso_id, 'nombre_local': ambito.localcurso.local.nombre_local,
                 'localambito_id': ambito.id})
        return JsonResponse(list(ambitosLocalDetalle), safe=False)


class LocalAmbitoViewSet(viewsets.ModelViewSet):
    serializer_class = LocalAmbitosDetalleSerializer
    queryset = LocalAmbito.objects.all()


# class FilterZonaViewSet(generics.ListAPIView):
#     serializer_class = ZonaSerializer
#
#     def get_queryset(self):
#         curso = self.kwargs['curso']
#         # localcurso = self.kwargs['localcurso']
#         ubigeo = self.kwargs['ubigeo']
#         return Zona.objects.exclude(
#             ID__in=LocalZonas.objects.filter(localcurso__curso_id=curso).values('zona_id')).filter(
#             UBIGEO=ubigeo)
class UbigeosLibresViewSet(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None):
        return JsonResponse(list(ambitoPorLocal(curso, ccdd, ccpp, ccdi)), safe=False)


class ZonasLibresViewSet(generics.ListAPIView):
    serializer_class = ZonaSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        ccdd = self.kwargs['ccdd']
        ccpp = self.kwargs['ccpp']
        ccdi = self.kwargs['ccdi']

        return ambitoPorLocal(curso, ccdd, ccpp, ccdi)


def ambitoPorLocal(curso, ccdd=None, ccpp=None, ccdi=None):
    filter = {}
    zonaFilter = {}
    query = Ubigeo.objects.exclude(ubigeo__in=excludeambitoPorLocal(curso, ccdd, ccpp, ccdi))
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
        # return Zona.objects.exclude(ZONA__in=excludeambitoPorLocal(curso, ccdd, ccpp, ccdi)).filter(**zonaFilter)
        return Zona.objects.filter(**zonaFilter)

    return queryFinal


def excludeambitoPorLocal(curso, ccdd=None, ccpp=None, ccdi=None):
    filter = {}
    filter['localcurso__curso_id'] = curso
    if ccdd is None:
        # ambitos usados
        localambito = LocalAmbito.objects.filter(**filter).values_list('ccdd', flat=True)
        query = Ubigeo.objects.filter(ccdd__in=localambito).values_list('ubigeo', flat=True)
    if ccdd is not None:
        filter['ccdd'] = ccdd
        localambito = LocalAmbito.objects.filter(**filter)
        deps = localambito.values_list('ccdd', flat=True)
        provs = localambito.values_list('ccpp', flat=True)
        query = Ubigeo.objects.filter(ccdd__in=deps, ccpp__in=provs).values_list('ubigeo', flat=True)
    if ccpp is not None:
        filter['ccdd'] = ccdd
        filter['ccpp'] = ccpp
        localambito = LocalAmbito.objects.filter(**filter)
        deps = localambito.values_list('ccdd', flat=True)
        provs = localambito.values_list('ccpp', flat=True)
        dist = localambito.values_list('ccdi', flat=True)
        query = Ubigeo.objects.filter(ccdd__in=deps, ccpp__in=provs, ccdi__in=dist).values_list('ubigeo', flat=True)
    if ccdi is not None:
        filter['ccdd'] = ccdd
        filter['ccpp'] = ccpp
        filter['ccdi'] = ccdi
        query = LocalAmbito.objects.filter(**filter).values_list('zona', flat=True)

    return query


# localcurso, ccdd,ccpp,ccdi,zona
def saveZonasLocal(request):
    postdata = request.POST['localambitos']
    localambitos = json.loads(postdata)
    # Agregando ambito o ambitos al localcurso
    for localambito in localambitos:
        local_Ambito = LocalAmbito()
        local_Ambito.localcurso_id = localambito['localcurso']
        local_Ambito.ccdd = localambito['ccdd'] if localambito['ccdd'] != '' else None
        local_Ambito.ccpp = localambito['ccpp'] if localambito['ccpp'] != '' else None
        local_Ambito.ccdi = localambito['ccdi'] if localambito['ccdi'] != '' else None
        local_Ambito.zona = localambito['zona'] if localambito['zona'] != '' else None
        local_Ambito.save()

    return JsonResponse({'msg': 'Ambitos agregados!'}, safe=False)


class PersonalLibreporCursoViewSet(generics.ListAPIView):
    serializer_class = PersonalSerializer

    def get_queryset(self):
        localcurso = self.kwargs['localcurso']
        contingencia = True if 'contingencia' in self.kwargs else False

        peaDistribuida = PersonalAula.objects.values_list('id_pea', flat=True).filter(
            id_localambiente__localcurso_id=localcurso)
        if contingencia:
            return personasLibres(localcurso).filter(contingencia=1)
        else:
            return personasLibres(localcurso, peaDistribuida).filter(contingencia=0)


def personasLibres(localcurso, exclude=[]):
    curso = LocalCurso.objects.get(pk=localcurso).curso_id
    cargosfuncionales = CursoCargoFuncional.objects.filter(id_curso_id=curso).values_list('id_cargofuncional',
                                                                                          flat=True)
    localambitos = LocalAmbito.objects.filter(localcurso_id=localcurso)
    deps = localambitos.values_list('ccdd', flat=True).distinct()
    provs = localambitos.values_list('ccpp', flat=True).distinct()
    dist = localambitos.values_list('ccdi', flat=True).distinct()
    zonas = localambitos.values_list('zona', flat=True)
    filter = {'baja_estado': 0}
    if localambitos[0].zona is not None:
        return Personal.objects.exclude(id_pea__in=exclude).filter(id_cargofuncional__in=cargosfuncionales,
                                                                   ubigeo__ccdd__in=deps, ubigeo__ccpp__in=provs,
                                                                   ubigeo__ccdi__in=dist,
                                                                   zona__in=zonas, **filter)

    elif localambitos[0].ccdi is not None and localambitos[0].zona is None:
        return Personal.objects.exclude(id_pea__in=exclude).filter(id_cargofuncional__in=cargosfuncionales,
                                                                   ubigeo__ccdd__in=deps,
                                                                   ubigeo__ccpp__in=provs, ubigeo__ccdi__in=dist,
                                                                   **filter)
    elif localambitos[0].ccpp is not None and localambitos[0].ccdi is None:
        return Personal.objects.exclude(id_pea__in=exclude).filter(id_cargofuncional__in=cargosfuncionales,
                                                                   ubigeo__ccdd__in=deps,
                                                                   ubigeo__ccpp__in=provs, **filter)
    elif localambitos[0].ccdd is not None and localambitos[0].ccpp is None:
        return Personal.objects.exclude(id_pea__in=exclude).filter(id_cargofuncional__in=cargosfuncionales,
                                                                   ubigeo__ccdd__in=deps, **filter)


def distribuir_byLocalCurso(request, localcurso_id):
    localAmbientes = LocalAmbiente.objects.filter(localcurso_id=localcurso_id).order_by('-capacidad')
    for localAmbiente in localAmbientes:
        bulk = []
        capacidadDistribuir = localAmbienteValid(localAmbiente.id_localambiente)
        peaDistribuida = PersonalAula.objects.values_list('id_pea', flat=True).filter(
            id_localambiente__localcurso_id=localcurso_id)
        if capacidadDistribuir > 0:
            _pea_distribuir = personasLibres(localcurso_id, peaDistribuida).filter(contingencia=0)
            pea_distribuir = _pea_distribuir.order_by('ubigeo__ccdd', 'ubigeo__ccpp', 'ubigeo__ccdi', 'zona',
                                                      'ape_paterno', 'ape_materno',
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

    return JsonResponse(list(PersonalAula.objects.filter(id_localambiente_id=localambiente_id).values()),
                        safe=False)


class PersonalAulaDetalleViewSet(generics.ListAPIView):
    serializer_class = PersonalAulaSerializer

    def get_queryset(self):
        localambiente = self.kwargs['id_localambiente']
        return PersonalAula.objects.filter(id_localambiente_id=localambiente, id_pea__baja_estado=0,
                                           id_pea__contingencia=0)


"""
leoncio prado 49
"""


def sendSMS(request):
    personalAulaLeoncio = PersonalAula.objects.all().filter(id_localambiente__localcurso_id=49)
    personalAulaDiego = PersonalAula.objects.all().filter(id_localambiente__localcurso_id=46)
    resultado = [{'mensaje': '', 'numeros': ''}, {'mensaje': '', 'numeros': ''}]
    mensaje1 = """
    Ha sido seleccionado para asistir al curso dirigido a jefes de sección urbano, a realizarse el día 29/03 a las 07:30 am en la I.E. 2670 Leoncio Prado_INEI
    """
    mensaje2 = """
    Ha sido seleccionado para asistir al curso dirigido a jefes de sección urbano, a realizarse el día 29/03 a las 03:30 pm en la I.E. Diego Ferre_INEI
    """
    resultado[0]['mensaje'] = mensaje1
    for data in personalAulaLeoncio:
        if validarCelular(data.id_pea.celular):
            resultado[0]['numeros'] = resultado[0]['numeros'] + data.id_pea.celular + ','

    resultado[1]['mensaje'] = mensaje2
    for data in personalAulaDiego:
        if validarCelular(data.id_pea.celular):
            resultado[1]['numeros'] = resultado[1]['numeros'] + data.id_pea.celular + ','

    return JsonResponse(resultado, safe=False)


def sendSMSEmpadronadorUrbano(request):
    # 150113 00400 00500
    # 150125 00200 02500
    texto00400 = """Usted ha sido seleccionado para participar en el curso de capacitación dirigido a “Empadronadores Urbanos”,
         el día de mañana 06 de abril en el local "CASA DE LA JUVENTUD MUNICIPALIDAD JESÚS MARÍA" Avenida Horacio Urteaga 1035 a las 07:30 am”
        Llevar consigo su DNI, se tomará en cuenta su puntualidad para el ingreso al local de capacitación_INEI.
        """
    texto00500 = """
    “Usted ha sido seleccionado para participar en el curso de capacitación dirigido a “Empadronadores Urbanos”,
    el día de mañana 06 de abril en el local "UNIVERSIDAD JAIME BAUSATE Y MEZA" Jirón Río de Janeiro 560 a las 07:30 am”
     Llevar consigo su DNI, se tomará en cuenta su puntualidad para el ingreso al local de capacitación _INEI.
                """

    texto00200 = """
    Usted ha sido seleccionado para participar en el curso de capacitación dirigido a “Empadronadores Urbanos”,
    el día de mañana 06 de abril en el local "​EX COLEGIO ​MIGUEL DE CERVANTES" Calle Los Claveles 125 a las 07:30 am”
    Llevar consigo su DNI, se tomará en cuenta su puntualidad para el ingreso al local de capacitación _INEI.
    """
    texto02500 = """
    Usted ha sido seleccionado para participar en el curso de capacitación dirigido a “Empadronadores Urbanos”,
     el día de mañana 06 de abril en el local "​EX COLEGIO ​MIGUEL DE CERVANTES" Calle Los Claveles 125 a las 07:30 am”
     Llevar consigo su DNI, se tomará en cuenta su puntualidad para el ingreso al local de capacitación _INEI.
    """
    jsonSend = [{'cod': 'jm00400', 'msg': texto00400, 'numeros': '', 'cant': 0},
                {'cod': 'jm00500', 'msg': texto00500, 'numeros': '', 'cant': 0},
                {'cod': 'pp00200', 'msg': texto00200,
                 'numeros': '997575460,991889695,967767430,989522941,990642582,997566305,986595664,950410178,993585787,946897632,955959369,987822369,991681402,966798025,990658702,966645378,964962079,997584522,991681383,992194145',
                 'cant': 0},
                {'cod': 'pp02500', 'msg': texto02500, 'numeros': '', 'cant': 0}]

    cargofuncional = {'id_cargofuncional': 549}

    personalJesusMariazona00400 = Personal.objects.filter(**cargofuncional, ubigeo='150113',
                                                          zona='00400').order_by('ape_paterno')[:405]
    for jm00400 in personalJesusMariazona00400:
        if validarCelular(jm00400.celular):
            jsonSend[0]['numeros'] = jsonSend[0]['numeros'] + jm00400.celular + ','
            jsonSend[0]['cant'] = jsonSend[0]['cant'] + 1

    personalJesusMariazona00500 = Personal.objects.filter(**cargofuncional, ubigeo='150113', zona='00500').order_by(
        'ape_paterno')[:265]
    for jm00500 in personalJesusMariazona00500:
        if validarCelular(jm00500.celular):
            jsonSend[1]['numeros'] = jsonSend[1]['numeros'] + jm00500.celular + ','
            jsonSend[1]['cant'] = jsonSend[1]['cant'] + 1

    personalPuentePiedra00200 = Personal.objects.filter(**cargofuncional, ubigeo='150125', zona='00200').order_by(
        'ape_paterno')[:89]
    for pp00200 in personalPuentePiedra00200:
        if validarCelular(pp00200.celular):
            jsonSend[2]['numeros'] = jsonSend[2]['numeros'] + pp00200.celular + ','
            jsonSend[2]['cant'] = jsonSend[2]['cant'] + 1

    personalPuentePiedra02500 = Personal.objects.filter(**cargofuncional, ubigeo='150125', zona='02500').order_by(
        'ape_paterno')[:112]
    for pp02500 in personalPuentePiedra02500:
        if validarCelular(pp02500.celular):
            jsonSend[3]['numeros'] = jsonSend[3]['numeros'] + pp02500.celular + ','
            jsonSend[3]['cant'] = jsonSend[3]['cant'] + 1

    return JsonResponse(jsonSend, safe=False)


def sendSMSEmpadronadorUrbanoDia2(request):
    # 150113 00400 00500
    # 150125 00200 02500
    texto00400 = """“Usted ha sido seleccionado para participar en el curso de capacitación dirigido a “Empadronadores Urbanos”,
     el día 07 de abril en el local "CASA DE LA JUVENTUD MUNICIPALIDAD JESÚS MARÍA" Avenida Horacio Urteaga 1035 a las 07:30 am”
     Llevar consigo su DNI, se tomará en cuenta su puntualidad para el ingreso al local de capacitación _INEI.
        """
    texto00500 = """
    “Usted ha sido seleccionado para participar en el curso de capacitación dirigido a “Empadronadores Urbanos”,
    el día 07 de abril en el local  "UNIVERSIDAD JAIME BAUSATE Y MEZA" Jirón Río de Janeiro 560 a las 07:30 am”
    Llevar consigo su DNI, se tomará en cuenta su puntualidad para el ingreso al local de capacitación _INEI.
                """
    texto00200 = """
    “Usted ha sido seleccionado para participar en el curso de capacitación dirigido a “Empadronadores Urbanos”,
    el día 07 de abril en el local "​EX COLEGIO ​MIGUEL DE CERVANTES" Calle Los Claveles 125 a las 07:30 am”
    Llevar consigo su DNI, se tomará en cuenta su puntualidad para el ingreso al local de capacitación.
    """
    texto02500 = """
    “Usted ha sido seleccionado para participar en el curso de capacitación dirigido a “Empadronadores Urbanos”,
    el día 07 de abril en el local "​EX COLEGIO ​MIGUEL DE CERVANTES" Calle Los Claveles 125 a las 07:30 am”
    Llevar consigo su DNI, se tomará en cuenta su puntualidad para el ingreso al local de capacitación _INEI.
    """
    jsonSend = [{'cod': 'jm00400', 'msg': texto00400, 'numeros': '', 'cant': 0},
                {'cod': 'jm00500', 'msg': texto00500, 'numeros': '', 'cant': 0},
                {'cod': 'pp00200', 'msg': texto00200,
                 'numeros': '997575460,991889695,967767430,989522941,990642582,997566305,986595664,950410178,993585787,946897632,955959369,987822369,991681402,966798025,990658702,966645378,964962079,997584522,991681383,992194145',
                 'cant': 0},
                {'cod': 'pp02500', 'msg': texto02500, 'numeros': '', 'cant': 0}]

    cargofuncional = {'id_cargofuncional': 549}

    _personalJesusMariazona00400 = Personal.objects.filter(**cargofuncional, ubigeo='150113',
                                                           zona='00400').order_by('ape_paterno')[:405].values_list(
        'id_pea', flat=True)
    personalJesusMariazona00400 = Personal.objects.exclude(id_pea__in=_personalJesusMariazona00400).filter(
        **cargofuncional, ubigeo='150113', zona='00400')
    for jm00400 in personalJesusMariazona00400:
        if validarCelular(jm00400.celular):
            jsonSend[0]['numeros'] = jsonSend[0]['numeros'] + jm00400.celular + ','
            jsonSend[0]['cant'] = jsonSend[0]['cant'] + 1

    _personalJesusMariazona00500 = Personal.objects.filter(**cargofuncional, ubigeo='150113', zona='00500').order_by(
        'ape_paterno')[:265].values_list('id_pea', flat=True)
    personalJesusMariazona00500 = Personal.objects.exclude(id_pea__in=_personalJesusMariazona00500).filter(
        **cargofuncional, ubigeo='150113', zona='00500')
    for jm00500 in personalJesusMariazona00500:
        if validarCelular(jm00500.celular):
            jsonSend[1]['numeros'] = jsonSend[1]['numeros'] + jm00500.celular + ','
            jsonSend[1]['cant'] = jsonSend[1]['cant'] + 1

    _personalPuentePiedra00200 = Personal.objects.filter(**cargofuncional, ubigeo='150125', zona='00200').order_by(
        'ape_paterno')[:89].values_list('id_pea', flat=True)
    personalPuentePiedra00200 = Personal.objects.exclude(id_pea__in=_personalPuentePiedra00200).filter(**cargofuncional,
                                                                                                       ubigeo='150125',
                                                                                                       zona='00200')
    for pp00200 in personalPuentePiedra00200:
        if validarCelular(pp00200.celular):
            jsonSend[2]['numeros'] = jsonSend[2]['numeros'] + pp00200.celular + ','
            jsonSend[2]['cant'] = jsonSend[2]['cant'] + 1

    _personalPuentePiedra02500 = Personal.objects.filter(**cargofuncional, ubigeo='150125', zona='02500').order_by(
        'ape_paterno')[:112].values_list(
        'id_pea', flat=True)
    personalPuentePiedra02500 = Personal.objects.exclude(id_pea__in=_personalPuentePiedra02500).filter(**cargofuncional,
                                                                                                       ubigeo='150125',
                                                                                                       zona='02500')
    for pp02500 in personalPuentePiedra02500:
        if validarCelular(pp02500.celular):
            jsonSend[3]['numeros'] = jsonSend[3]['numeros'] + pp02500.celular + ','
            jsonSend[3]['cant'] = jsonSend[3]['cant'] + 1

    return JsonResponse(jsonSend, safe=False)


def sendSMSEmpadronadorUrbanoNoAsistieronDia1(request):
    cargofuncional = {'peaaula__id_pea__id_cargofuncional': 549}
    data = {
        'msg': 'Te esperamos mañana 7:30am, "EX COLEGIO MIGUEL DE CERVANTES" Carretera Panamericana Norte Paradero Hospital Carlos Lanfranco, traer DNI - INEI',
        'numeros': '997584522,997575460,991889695,967767430,989522941,990642582,997566305,986595664,950410178,993585787,946897632,955959369,987822369,991681402,966798025,990658702,966645378,964962079,997584522,991681383,992194145,',
        'cant': len(
            'Te esperamos mañana 7:30am, "EX COLEGIO MIGUEL DE CERVANTES" Carretera Panamericana Norte Paradero Hospital Carlos Lanfranco, traer DNI - INEI')}
    personalAsistio = PersonalAulaAsistencia.objects.filter(**cargofuncional, peaaula__id_pea__ubigeo='150125',
                                                            peaaula__id_pea__zona__in=['02500', '00200']).values_list(
        'peaaula__id_pea_id', flat=True)

    personalNoAsistio = Personal.objects.exclude(id_pea__in=personalAsistio).filter(id_cargofuncional=549,
                                                                                    ubigeo='150125',
                                                                                    zona__in=['02500', '00200'])

    for persona in personalNoAsistio:
        if validarCelular(persona.celular):
            data['numeros'] = data['numeros'] + persona.celular + ',';

    return JsonResponse(data)


def sendSMSEmpadronadorUrbanoNoAsistieronDia1JesusMariaZona4(request):
    cargofuncional = {'peaaula__id_pea__id_cargofuncional': 549}
    data = {
        'msg': 'Te esperamos mañana 7:30 am, "​CASA DE LA JUVENTUD MUNICIPALIDAD JESÚS MARÍA" Cruce Horacio Urteaga con Av. Santa Cruz, Traer DNI - INEI.',
        'numeros': '997584522,997575460,991889695,967767430,989522941,990642582,997566305,986595664,950410178,993585787,946897632,955959369,987822369,991681402,966798025,990658702,966645378,964962079,997584522,991681383,992194145,',
        'cant': len(
            'Te esperamos mañana 7:30am, "EX COLEGIO MIGUEL DE CERVANTES" Carretera Panamericana Norte Paradero Hospital Carlos Lanfranco, traer DNI - INEI')}
    personalAsistio = PersonalAulaAsistencia.objects.filter(**cargofuncional, peaaula__id_pea__ubigeo='150113',
                                                            peaaula__id_pea__zona__in=['00400']).values_list(
        'peaaula__id_pea_id', flat=True)

    personalNoAsistio = Personal.objects.exclude(id_pea__in=personalAsistio).filter(id_cargofuncional=549,
                                                                                    ubigeo='150113',
                                                                                    zona__in=['00400'])

    for persona in personalNoAsistio:
        if validarCelular(persona.celular):
            data['numeros'] = data['numeros'] + persona.celular + ',';

    return JsonResponse(data)


def sendSMSEmpadronadorUrbanoNoAsistieronDia1JesusMariaZona5(request):
    cargofuncional = {'peaaula__id_pea__id_cargofuncional': 549}
    data = {
        'msg': 'Te esperamos mañana 7:30 am, "​UNIVERSIDAD JAIME BAUSEATE Y MEZA" entre Jr. Costa Rica y Jr. Río de Janeiro, Traer DNI - INEI.',
        'numeros': '997584522,997575460,991889695,967767430,989522941,990642582,997566305,986595664,950410178,993585787,946897632,955959369,987822369,991681402,966798025,990658702,966645378,964962079,997584522,991681383,992194145,',
        'cant': len(
            'Te esperamos mañana 7:30am, "EX COLEGIO MIGUEL DE CERVANTES" Carretera Panamericana Norte Paradero Hospital Carlos Lanfranco, traer DNI - INEI')}
    personalAsistio = PersonalAulaAsistencia.objects.filter(**cargofuncional, peaaula__id_pea__ubigeo='150113',
                                                            peaaula__id_pea__zona__in=['00500']).values_list(
        'peaaula__id_pea_id', flat=True)

    personalNoAsistio = Personal.objects.exclude(id_pea__in=personalAsistio).filter(id_cargofuncional=549,
                                                                                    ubigeo='150113',
                                                                                    zona__in=['00500'])

    for persona in personalNoAsistio:
        if validarCelular(persona.celular):
            data['numeros'] = data['numeros'] + persona.celular + ',';
    return JsonResponse(data)


def validarCelular(numero):
    numerook = str(numero).replace(" ", "").strip()
    print(numerook)
    if len(numerook) == 9:
        return True
    else:
        return False
