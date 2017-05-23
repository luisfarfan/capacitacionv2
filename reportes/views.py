from django.shortcuts import render
from ubigeo.models import *
from locales_consecucion.models import *
from .models import Reportes
from django.http import JsonResponse
from rest_framework.views import APIView
from django.db.models import Count, Value, F, Sum
from asistencia.serializer import PersonalAulaDetalleSerializer
from rest_framework import generics, viewsets
from django.utils.text import slugify
from evaluacion.serializer import PeaNotaFinalSinInternetSerializer
from reportes.models import Inscritos


def getReportes(request):
    query = list(Reportes.objects.all().values().order_by('order'))
    return JsonResponse(query, safe=False)


def putHTMLSlugReportes(request):
    reportes = Reportes.objects.all()
    for reporte in reportes:
        reporte.slug = slugify(reporte.nombre)
        reporte.template_html = slugify(reporte.nombre) + '.html'
        reporte.save()
        open('templates/reportes/' + reporte.template_html, 'w')

    return JsonResponse({'msg': 'Slug actualizado'})


"""
Reporte N° 1
"""


class NumeroaulasCoberturadas(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)
        filter = {'curso': curso}

        if ccdd is not None:
            filter['ccdd'] = ccdd
            annotate = ('ubigeo',)
        if ccpp is not None:
            filter['ccpp'] = ccpp
            annotate = ('ubigeo',)
        if ccdi is not None:
            filter['ccdi'] = ccdi
            annotate = ('ccdi', 'ubigeo')
        if zona is not None:
            filter['ccdi'] = ccdi
            annotate = ('zona', 'ubigeo')
        ubigeos = MetaAula.objects.filter(**filter).values(*annotate).annotate(
            dcount=Count(*annotate))
        response = []
        for ubigeo in ubigeos:
            if ccdi is None:
                ambito = Ubigeo.objects.filter(ubigeo=ubigeo['ubigeo']).values()[0]
            else:
                ambito = ubigeo['zona']
            meta = MetaAula.objects.filter(ubigeo=ubigeo['ubigeo'], curso=curso).aggregate(meta=Sum('meta'))['meta']
            locales = Local.objects.filter(ubigeo_id=ubigeo['ubigeo'], localcurso__curso_id=curso)
            disponibletotal = 0
            usar = 0
            for disponible in locales:
                disponible_total = int(
                    disponible.cantidad_disponible_auditorios or 0) + int(
                    disponible.cantidad_disponible_sala or 0) + int(
                    disponible.cantidad_disponible_aulas or 0) + int(
                    disponible.cantidad_disponible_computo or 0) + int(
                    disponible.cantidad_disponible_oficina or 0) + int(
                    disponible.cantidad_disponible_otros or 0)
                disponibletotal = disponibletotal + disponible_total
                usar = usar + disponible.total_aulas
            print(disponibletotal)
            response.append({'meta': meta, 'disponible': disponibletotal,
                             'disponible_percent': calcPocentaje(disponibletotal, meta),
                             'usar': usar, 'usar_percent': calcPocentaje(usar, meta), 'ambito': ambito})

        return JsonResponse(response, safe=False)


"""
Reporte N° 2
"""


class postulantesSeleccionadosporCurso(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)
        filter = {}
        filter['id_cargofuncional__in'] = cargos
        filter3 = {}
        filter3['id_cargofuncional__in'] = list(cargos)

        if ccdd is not None:
            filter['ccdd'] = ccdd
            filter3['ccdd_i'] = ccdd
            annotate = ('ubigeo',)
        if ccpp is not None:
            filter['ccpp'] = ccpp
            filter3['ccpp_i'] = ccdd
            annotate = ('ubigeo',)
        if ccdi is not None:
            filter['ccdi'] = ccdi
            filter3['ccdi_i'] = ccdd
            annotate = ('zona', 'ubigeo')
        if zona is not None:
            filter['zona'] = zona

        ubigeos = MetaCapacitacionPersonal.objects.filter(**filter).values(*annotate).annotate(dcount=Count(*annotate))
        response = []
        zonan = None
        for ubigeo in ubigeos:
            if ccdi is None:
                meta = MetaCapacitacionPersonal.objects.filter(ubigeo=ubigeo['ubigeo'],
                                                               id_cargofuncional__in=cargos).aggregate(
                    sum=Sum('meta_campo'))
                ambito = Ubigeo.objects.filter(ubigeo=ubigeo['ubigeo']).values('departamento', 'provincia', 'distrito')[
                    0]

            else:
                meta = MetaCapacitacionPersonal.objects.filter(ubigeo=ubigeo['ubigeo'], zona=ubigeo['zona'],
                                                               id_cargofuncional__in=cargos).aggregate(
                    sum=Sum('meta_campo'))
                zonan = ubigeo['zona']
                ambito = Ubigeo.objects.filter(ubigeo=ubigeo['ubigeo']).values()[0]

            inscritos = Inscritos.objects.using('consecucion').filter(ubigeo_i=ubigeo['ubigeo']).count()
            seleccionados = Personal.objects.filter(id_cargofuncional__in=cargos,
                                                    ubigeo_id=ubigeo['ubigeo']).count()

            response.append(
                {'metacampo': meta['sum'], 'inscritos': inscritos,
                 'inscritos_percent': calcPocentaje(inscritos, meta['sum']),
                 'seleccionados': seleccionados, 'seleccionados_percent': calcPocentaje(seleccionados, meta['sum']),
                 'ambito': ambito, 'zona': zonan})

        return JsonResponse(response, safe=False)


"""
Reporte N° 3
"""


class postulantesAsistieronporCurso(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)
        filter = {}
        filter['id_cargofuncional__in'] = cargos
        filter3 = {}
        filter3['id_cargofuncional__in'] = list(cargos)

        if ccdd is not None:
            filter['ccdd'] = ccdd
            filter3['ccdd_i'] = ccdd
            annotate = ('ubigeo',)
        if ccpp is not None:
            filter['ccpp'] = ccpp
            filter3['ccpp_i'] = ccdd
            annotate = ('ubigeo',)
        if ccdi is not None:
            filter['ccdi'] = ccdi
            filter3['ccdi_i'] = ccdd
            annotate = ('zona', 'ubigeo')
        if zona is not None:
            filter['zona'] = zona

        ubigeos = MetaCapacitacionPersonal.objects.filter(**filter).values(*annotate).annotate(
            dcount=Count(*annotate))
        response = []
        for ubigeo in ubigeos:
            if ccdi is None:
                personal = Personal.objects.filter(ubigeo_id=ubigeo['ubigeo'],
                                                   id_cargofuncional__in=cargos)
                ambito = Ubigeo.objects.filter(ubigeo=ubigeo['ubigeo']).values()[0]

            else:
                personal = Personal.objects.filter(ubigeo_id=ubigeo['ubigeo'],
                                                   id_cargofuncional__in=cargos, zona=ubigeo['zona'])
                ambito = ubigeo['zona']
            meta = personal.count()
            asistieron = personal.filter(contingencia=0, baja_estado=0).count()
            noasistieron = personal.filter(contingencia=0, baja_estado=1).count()
            response.append(
                {'meta': meta, 'asistieron': asistieron, 'asistieron_percent': calcPocentaje(asistieron, meta),
                 'noasistieron': noasistieron, 'noasistieron_percent': calcPocentaje(noasistieron, meta),
                 'ambito': ambito})

        return JsonResponse(response, safe=False)


"""
Reporte N° 4
"""


class bajadePostulantes(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)
        filter = {}
        filter['id_cargofuncional__in'] = cargos
        filter3 = {}
        filter3['id_cargofuncional__in'] = list(cargos)

        if ccdd is not None:
            filter['ccdd'] = ccdd
            filter3['ccdd_i'] = ccdd
            annotate = ('ubigeo',)
        if ccpp is not None:
            filter['ccpp'] = ccpp
            filter3['ccpp_i'] = ccdd
            annotate = ('ubigeo',)
        if ccdi is not None:
            filter['ccdi'] = ccdi
            filter3['ccdi_i'] = ccdd
            annotate = ('zona', 'ubigeo')
        if zona is not None:
            filter['zona'] = zona

        ubigeos = MetaCapacitacionPersonal.objects.filter(**filter).values(*annotate).annotate(
            dcount=Count(*annotate))
        response = []
        for ubigeo in ubigeos:
            if ccdi is None:
                personal = Personal.objects.filter(ubigeo_id=ubigeo['ubigeo'],
                                                   id_cargofuncional__in=cargos)
                ambito = Ubigeo.objects.filter(ubigeo=ubigeo['ubigeo']).values()[0]

            else:
                personal = Personal.objects.filter(ubigeo_id=ubigeo['ubigeo'],
                                                   id_cargofuncional__in=cargos, zona=ubigeo['zona'])
                ambito = ubigeo['zona']
            meta = personal.count()
            baja = personal.filter(contingencia=0, baja_estado=1).count()
            response.append(
                {'meta': meta, 'baja': baja, 'baja_percent': calcPocentaje(baja, meta),
                 'ambito': ambito})

        return JsonResponse(response, safe=False)


"""
Reporte N° 5
"""


class postulantesSeleccionadosSegunMetadeCampo(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)
        filter = {}
        filter['id_cargofuncional__in'] = cargos
        filter3 = {}
        filter3['id_cargofuncional__in'] = list(cargos)

        if ccdd is not None:
            filter['ccdd'] = ccdd
            filter3['ccdd_i'] = ccdd
            annotate = ('ubigeo',)
        if ccpp is not None:
            filter['ccpp'] = ccpp
            filter3['ccpp_i'] = ccdd
            annotate = ('ubigeo',)
        if ccdi is not None:
            filter['ccdi'] = ccdi
            filter3['ccdi_i'] = ccdd
            annotate = ('zona', 'ubigeo')
        if zona is not None:
            filter['zona'] = zona

        ubigeos = MetaCapacitacionPersonal.objects.filter(**filter).values(*annotate).annotate(
            dcount=Count(*annotate))
        response = []
        for ubigeo in ubigeos:
            if ccdi is None:
                personal = Personal.objects.filter(ubigeo_id=ubigeo['ubigeo'],
                                                   id_cargofuncional__in=cargos)
                ambito = Ubigeo.objects.filter(ubigeo=ubigeo['ubigeo']).values()[0]

            else:
                personal = Personal.objects.filter(ubigeo_id=ubigeo['ubigeo'],
                                                   id_cargofuncional__in=cargos, zona=ubigeo['zona'])
                ambito = ubigeo['zona']
            meta = personal.count()
            capacitados = personal.filter(contingencia=0, baja_estado=0).count()
            if ccdd == '13':
                seleccionados = PeaNotaFinalSinInternet.objects.filter(sw_titu=1,
                                                                       pea__ubigeo_id=ubigeo['ubigeo'],
                                                                       pea__id_cargofuncional__in=cargos).count()
            else:
                seleccionados = PersonalAulaNotaFinal.objects.filter(sw_titu=1,
                                                                     peaaula__id_pea__ubigeo=ubigeo['ubigeo'],
                                                                     peaaula__id_pea__id_cargofuncional__in=cargos).count()
            response.append(
                {'meta': meta, 'capacitados': capacitados, 'capacitados_percent': calcPocentaje(capacitados, meta),
                 'seleccionados': seleccionados, 'seleccionados_percent': calcPocentaje(seleccionados, meta),
                 'ambito': ambito})

        return JsonResponse(response, safe=False)


"""
Reporte N°7
"""


class directoriolocalesNumeroAmbientes(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi
        if zona is not None:
            filter['zona_ubicacion_local'] = zona

        query = DirectorioLocal.objects.filter(**filter, directoriolocalcurso__curso_id=curso).values()
        return JsonResponse(list(query), safe=False)


"""
Reporte N°8
"""


class localseleccionadoNumeroAmbientes(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {}
        if ccdd is not None:
            filter['ubigeo__ccdd'] = ccdd
        if ccpp is not None:
            filter['ubigeo__ccpp'] = ccpp
        if ccdi is not None:
            filter['ubigeo__ccdi'] = ccdi
        if zona is not None:
            filter['zona_ubicacion_local'] = zona

        query = Local.objects.filter(**filter, localcurso__curso_id=curso).values()
        return JsonResponse(list(query), safe=False)


"""
Reporte N°10
"""


class asistenciaporCurso(generics.ListAPIView):
    serializer_class = PersonalAulaDetalleSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']

        ambientes = LocalAmbiente.objects.filter(localcurso__curso_id=curso).values_list('id_localambiente', flat=True)
        return PersonalAula.objects.filter(id_localambiente_id__in=ambientes)


"""
Reporte N°11 Con Internet
"""


class registroNotasporCursoConInternet(generics.ListAPIView):
    serializer_class = PersonalAulaDetalleSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)
        filter = {}
        if 'ccdd' in self.kwargs:
            filter['id_pea__ubigeo__ccdd'] = self.kwargs['ccdd']

        if 'ccpp' in self.kwargs:
            filter['id_pea__ubigeo__ccpp'] = self.kwargs['ccpp']

        if 'ccdi' in self.kwargs:
            filter['id_pea__ubigeo__ccdi'] = self.kwargs['ccdi']

        if 'zona' in self.kwargs:
            filter['id_pea__zona'] = self.kwargs['zona']

        query = PersonalAula.objects.filter(id_pea__id_cargofuncional__in=cargos, **filter)
        return query


"""
Reporte N°11 Sin Internet
"""


class registroNotasporCursoSinInternet(generics.ListAPIView):
    serializer_class = PeaNotaFinalSinInternetSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        cargos = CursoCargoFuncional.objects.filter(id_curso=curso).values_list('id_cargofuncional', flat=True)
        filter = {}
        if 'ccdd' in self.kwargs:
            filter['id_pea__ubigeo__ccdd'] = self.kwargs['ccdd']

        if 'ccpp' in self.kwargs:
            filter['id_pea__ubigeo__ccpp'] = self.kwargs['ccpp']

        if 'ccdi' in self.kwargs:
            filter['id_pea__ubigeo__ccdi'] = self.kwargs['ccdi']

        if 'zona' in self.kwargs:
            filter['id_pea__zona'] = self.kwargs['zona']

        query = PeaNotaFinalSinInternet.objects.filter(id_pea__id_cargofuncional__in=cargos, **filter)
        return query


def calcPocentaje(partial, total):
    if partial is None or total is None:
        return 0
    if partial == 0 or total == 0:
        return 0

    porcentaje = (partial * 100) / total
    return float("{0:.2f}".format(porcentaje) or 0)
