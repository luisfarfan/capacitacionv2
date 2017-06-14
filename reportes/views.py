from django.shortcuts import render
from locales_consecucion.models import *
from .models import Reportes
from django.http import JsonResponse
from rest_framework.views import APIView
from django.db.models import Count, Value, F, Sum
from asistencia.serializer import PersonalAulaDetalleSerializer
from rest_framework import generics, viewsets
from django.utils.text import slugify
from evaluacion.serializer import PeaNotaFinalSinInternetSerializer
from reportes.models import MetaSeleccion, Inscritos


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
        filter = {}
        if ccdd is None:
            annotate = ('ubigeo',)
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
        ubigeos = Ubigeo.objects.filter(**filter).values(*annotate).annotate(
            dcount=Count(*annotate))
        response = []
        for ubigeo in ubigeos:
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
                usar = usar + int(disponible.total_aulas or 0)
            ambito = list(Ubigeo.objects.filter(ubigeo=ubigeo['ubigeo']).values())
            if disponibletotal > 0:
                response.append({'aulas_programadas': disponibletotal, 'disponible': disponibletotal,
                                 'disponible_percent': calcPocentaje(disponibletotal, disponible_total),
                                 'usar': usar, 'usar_percent': calcPocentaje(usar, disponible_total), 'ambito': ambito})
        return JsonResponse(response, safe=False)


"""
Reporte N° 2
"""


class postulantesSeleccionadosporCurso(APIView):
    def get(self, request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {}
        filter['id_cargofuncional'] = curso
        filter3 = {}
        filter3['id_cargofuncional'] = curso
        if ccdd is None:
            annotate = ('ubigeo',)
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
            annotate = ('ubigeo',)
        if zona is not None:
            filter['zona'] = zona

        metas = MetaSeleccion.objects.using('consecucion').filter(**filter).values(*annotate).annotate(
            dcount=Count(*annotate))
        response = []
        for meta in metas:
            meta_campo = MetaSeleccion.objects.using('consecucion').filter(id_cargofuncional=curso,
                                                                           ubigeo=meta['ubigeo']).aggregate(
                sum=Sum('meta_campo'))
            meta_capa = MetaSeleccion.objects.using('consecucion').filter(id_cargofuncional=curso,
                                                                          ubigeo=meta['ubigeo']).aggregate(
                sum=Sum('meta_capa'))
            if meta_campo['sum'] > 0:
                ambito = list(Ubigeo.objects.filter(ubigeo=meta['ubigeo']).values())
                inscritos = Inscritos.objects.using('consecucion').filter(id_cargofuncional=curso,
                                                                          ubigeo_i=meta['ubigeo']).count()
                seleccionados = Personal.objects.filter(id_cargofuncional=curso, ubigeo_id=meta['ubigeo']).count()
                reserva = Personal.objects.filter(id_cargofuncional=curso, ubigeo_id=meta['ubigeo'],
                                                  contingencia=1).count()
                response.append({'meta_campo': meta_campo['sum'], 'meta_capa': meta_capa['sum'], 'inscritos': inscritos,
                                 'inscritos_percent': calcPocentaje(inscritos, meta_capa['sum']),
                                 'seleccionados_percent': calcPocentaje(seleccionados, meta_capa['sum']),
                                 'reserva_percent': calcPocentaje(reserva, meta_capa['sum']),
                                 'seleccionados': seleccionados, 'reserva': reserva, 'ambito': ambito})

        return JsonResponse(response, safe=False)


"""
Reporte N° 3
"""


class coberturaPersonal(APIView):
    def get(self, request, cargo, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {}
        filter['id_cargofuncional'] = cargo
        filter3 = {}
        filter3['id_cargofuncional'] = cargo
        if ccdd is None:
            annotate = ('ubigeo',)
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
            annotate = ('ubigeo',)
        if zona is not None:
            filter['zona'] = zona

        metas = MetaSeleccion.objects.using('consecucion').filter(**filter).values(*annotate).annotate(
            dcount=Count(*annotate))
        response = []
        for meta in metas:
            meta_campo = MetaSeleccion.objects.using('consecucion').filter(id_cargofuncional=cargo,
                                                                           ubigeo=meta['ubigeo']).aggregate(
                sum=Sum('meta_campo'))
            meta_capa = MetaSeleccion.objects.using('consecucion').filter(id_cargofuncional=cargo,
                                                                          ubigeo=meta['ubigeo']).aggregate(
                sum=Sum('meta_capa'))
            if meta_campo['sum'] > 0:
                ambito = list(Ubigeo.objects.filter(ubigeo=meta['ubigeo']).values())
                bajas = Personal.objects.filter(id_cargofuncional=cargo, ubigeo_id=meta['ubigeo'],
                                                baja_estado=1).count()
                altas = Personal.objects.filter(id_cargofuncional=cargo, ubigeo_id=meta['ubigeo'],
                                                alta_estado=1).count()
                capacitado = Personal.objects.filter(id_cargofuncional=cargo, ubigeo_id=meta['ubigeo'],
                                                     contingencia=0).count()
                response.append(
                    {'meta_campo': meta_campo['sum'], 'meta_capa': meta_capa['sum'], 'bajas': bajas, 'altas': bajas,
                     'bajas_percent': calcPocentaje(bajas, meta_capa['sum']),
                     'altas_percent': calcPocentaje(altas, meta_capa['sum']),
                     'capacitado': capacitado,
                     'capacitado_percent': calcPocentaje(capacitado, meta_capa['sum']), 'ambito': ambito})

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
    def get(self, request, cargo, ccdd=None, ccpp=None, ccdi=None, zona=None):
        filter = {}
        filter['id_cargofuncional'] = cargo
        filter3 = {}
        filter3['id_cargofuncional'] = cargo
        if ccdd is None:
            annotate = ('ubigeo',)
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
            annotate = ('ubigeo',)
        if zona is not None:
            filter['zona'] = zona

        metas = MetaSeleccion.objects.using('consecucion').filter(**filter).values(*annotate).annotate(
            dcount=Count(*annotate))
        response = []
        for meta in metas:
            meta_campo = MetaSeleccion.objects.using('consecucion').filter(id_cargofuncional=cargo,
                                                                           ubigeo=meta['ubigeo']).aggregate(
                sum=Sum('meta_campo'))
            if meta_campo['sum'] > 0:
                ambito = list(Ubigeo.objects.filter(ubigeo=meta['ubigeo']).values())
                titular = PersonalAulaNotaFinal.objects.filter(sw_titu=1,
                                                               peaaula__id_pea__ubigeo=meta['ubigeo']).count()
                reserva = PersonalAulaNotaFinal.objects.filter(sw_titu=0, seleccionado=1,
                                                               peaaula__id_pea__ubigeo=meta['ubigeo']).count()
                noseleccionado = PersonalAulaNotaFinal.objects.filter(sw_titu=0, seleccionado=0,
                                                                      peaaula__id_pea__ubigeo=meta['ubigeo']).count()

                response.append(
                    {'meta_campo': meta_campo['sum'], 'titular': titular, 'reserva': reserva,
                     'reserva_percent': calcPocentaje(reserva, meta_campo['sum']),
                     'noseleccionado_percent': calcPocentaje(noseleccionado, meta_campo['sum']),
                     'noseleccionado': noseleccionado,
                     'titular_percent': calcPocentaje(titular, meta_campo['sum']), 'ambito': ambito})

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


class directorioLocales(APIView):
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

        query = list(DirectorioLocal.objects.filter(**filter, directoriolocalcurso__curso_id=curso).values())
        response = []
        for q in query:
            ubigeo = list(Ubigeo.objects.filter(ubigeo=q['ubigeo_id']).values())
            q['ubigeo'] = ubigeo
            response.append(q)

        return JsonResponse(query, safe=False)


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
