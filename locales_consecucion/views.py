# from rest_framework import generics
from builtins import filter

from .serializer import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from .utils import restar, sumarDisponiblesUsar
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count, Min, Sum, Avg
from rest_framework.views import APIView
from seguridad.models import RolCurso


def agregarDirectorioCurso(request):
    directorios = DirectorioLocal.objects.all()
    cursos = Curso.objects.all()

    for directorio in directorios:
        for curso in cursos:
            if DirectorioLocalCurso.objects.filter(local_id=directorio.id_local, curso_id=curso.id_curso).count() == 0:
                directoriocurso = DirectorioLocalCurso()
                directoriocurso.local_id = directorio.id_local
                directoriocurso.curso_id = curso.id_curso
                directoriocurso.save()

    return JsonResponse(list(DirectorioLocalCurso.objects.all().values()), safe=False)


def agregarPeatoNotaFinalSinInternet(request):
    pea = Personal.objects.filter(ubigeo=130501)
    for p in pea:
        peanotafinal = PeaNotaFinalSinInternet(pea_id=p.id_pea, nota_final=0)
        peanotafinal.save()
    return JsonResponse(list(PeaNotaFinalSinInternet.objects.all().values()), safe=False)


class LocalViewSet(viewsets.ModelViewSet):
    queryset = Local.objects.all()
    serializer_class = LocalSerializer


class LocalCursoViewSet(viewsets.ModelViewSet):
    queryset = LocalCurso.objects.all()
    serializer_class = LocalCursoSerializer


class LocalAmbienteViewSet(viewsets.ModelViewSet):
    queryset = LocalAmbiente.objects.all()
    serializer_class = LocalAmbienteSerializer


class DirectorioLocalViewSet(viewsets.ModelViewSet):
    queryset = DirectorioLocal.objects.all()
    serializer_class = DirectorioLocalSerializer


class DirectorioLocalCursoViewSet(viewsets.ModelViewSet):
    queryset = DirectorioLocalCurso.objects.all()
    serializer_class = DirectorioLocalCursoSerializer


class DirectorioLocalAmbienteViewSet(viewsets.ModelViewSet):
    queryset = DirectorioLocalAmbiente.objects.all()
    serializer_class = DirectorioLocalAmbienteSerializer


class DirectorioLocalAmbienteFilterViewSet(generics.ListAPIView):
    serializer_class = DirectorioLocalAmbienteSerializer

    def get_queryset(self):
        localcurso = self.kwargs['localcurso']
        is_directorio = self.kwargs['is_directorio']
        if is_directorio == "1":
            return DirectorioLocalAmbiente.objects.filter(localcurso_id=localcurso)
        else:
            return LocalAmbiente.objects.filter(localcurso_id=localcurso)


class CursoEtapaViewSet(generics.ListAPIView):
    serializer_class = CursoSerializer2

    def get_queryset(self):
        etapa_id = self.kwargs['etapa_id']
        if 'rol' in self.kwargs:
            rol = self.kwargs['rol']
            cursosbyrol = RolCurso.objects.filter(rol=rol).values_list('curso', flat=True)
            return Curso.objects.filter(etapa_id=etapa_id, id_curso__in=cursosbyrol)
        else:
            return Curso.objects.filter(etapa_id=etapa_id)


class DirectorioLocalCursoFilter(generics.ListAPIView):
    serializer_class = DirectorioLocalCursoDetalleSerializer

    def get_queryset(self):
        local = self.kwargs['local']
        curso = self.kwargs['curso']
        return DirectorioLocalCurso.objects.filter(local_id=local, curso_id=curso)


class LocalCursoFilter(generics.ListAPIView):
    serializer_class = LocalCursoDetalleSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        filter = {}
        filter['curso_id'] = curso
        if 'ccdd' in self.kwargs:
            filter['local__ubigeo__ccdd'] = self.kwargs['ccdd']
        if 'ccpp' in self.kwargs:
            filter['local__ubigeo__ccdd'] = self.kwargs['ccdd']
            filter['local__ubigeo__ccpp'] = self.kwargs['ccpp']
        if 'ccdi' in self.kwargs:
            filter['local__ubigeo__ccdd'] = self.kwargs['ccdd']
            filter['local__ubigeo__ccpp'] = self.kwargs['ccpp']
            filter['local__ubigeo__ccdi'] = self.kwargs['ccdi']
        if 'zona' in self.kwargs:
            filter['local__ubigeo__ccdd'] = self.kwargs['ccdd']
            filter['local__ubigeo__ccpp'] = self.kwargs['ccpp']
            filter['local__ubigeo__ccdi'] = self.kwargs['ccdi']
            filter['local__zona_ubicacion_local'] = self.kwargs['zona']

        return LocalCurso.objects.filter(**filter)


class LocalCursoFilterUsar(generics.ListAPIView):
    serializer_class = LocalCursoDetalleSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        filter = {}
        filter['curso_id'] = curso
        if 'ccdd' in self.kwargs:
            filter['local__ubigeo__ccdd'] = self.kwargs['ccdd']
        if 'ccpp' in self.kwargs:
            filter['local__ubigeo__ccdd'] = self.kwargs['ccdd']
            filter['local__ubigeo__ccpp'] = self.kwargs['ccpp']
        if 'ccdi' in self.kwargs:
            filter['local__ubigeo__ccdd'] = self.kwargs['ccdd']
            filter['local__ubigeo__ccpp'] = self.kwargs['ccpp']
            filter['local__ubigeo__ccdi'] = self.kwargs['ccdi']
        if 'zona' in self.kwargs:
            filter['local__ubigeo__ccdd'] = self.kwargs['ccdd']
            filter['local__ubigeo__ccpp'] = self.kwargs['ccpp']
            filter['local__ubigeo__ccdi'] = self.kwargs['ccdi']
            filter['local__zona_ubicacion_local'] = self.kwargs['zona']

        return LocalCurso.objects.filter(**filter, local__usar=1)


class DirectorioLocalbyUbigeo(generics.ListAPIView):
    serializer_class = DirectorioLocalSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        filter = {}
        filter['directoriolocalcurso__curso_id'] = curso
        if 'ccdd' in self.kwargs:
            filter['ubigeo__ccdd'] = self.kwargs['ccdd']
        if 'ccpp' in self.kwargs:
            filter['ubigeo__ccdd'] = self.kwargs['ccdd']
            filter['ubigeo__ccpp'] = self.kwargs['ccpp']
        if 'ccdi' in self.kwargs:
            filter['ubigeo__ccdd'] = self.kwargs['ccdd']
            filter['ubigeo__ccpp'] = self.kwargs['ccpp']
            filter['ubigeo__ccdi'] = self.kwargs['ccdi']
        if 'zona' in self.kwargs:
            filter['ubigeo__ccdd'] = self.kwargs['ccdd']
            filter['ubigeo__ccpp'] = self.kwargs['ccpp']
            filter['ubigeo__ccdi'] = self.kwargs['ccdi']
            filter['zona_ubicacion_local'] = self.kwargs['zona']

        return DirectorioLocal.objects.filter(**filter)[:100]


def directorioLocalesPagination(request, curso, ccdd=None, ccpp=None, ccdi=None, zona=None):
    filter = {}
    filter['directoriolocalcurso__curso_id'] = curso
    start = request.GET.get('start') or 0
    length = request.GET.get('length') or 10
    queryString = request.GET.get('search[value]')
    draw = request.GET.get('draw') or 1
    if ccdd is not None:
        filter['ubigeo__ccdd'] = ccdd
    if ccpp is not None:
        filter['ubigeo__ccdd'] = ccdd
        filter['ubigeo__ccpp'] = ccpp
    if ccdi is not None:
        filter['ubigeo__ccdd'] = ccdd
        filter['ubigeo__ccpp'] = ccpp
        filter['ubigeo__ccdi'] = ccdi
    if zona is not None:
        filter['ubigeo__ccdd'] = ccdd
        filter['ubigeo__ccpp'] = ccpp
        filter['ubigeo__ccdi'] = ccdi
        filter['zona_ubicacion_local'] = zona
    _start = int(start or 0)
    _length = _start + int(length or 0)
    if queryString != '' and queryString != None:
        data = DirectorioLocal.objects.filter(**filter, nombre_local__contains=queryString)[_start:_length].values()
    else:
        data = DirectorioLocal.objects.filter(**filter)[_start:_length].values()

    return JsonResponse(
        {'data': list(data), 'draw': draw, 'recordsFiltered': DirectorioLocal.objects.filter(**filter).count(),
         'recordsTotal': DirectorioLocal.objects.filter(**filter).count()}, safe=False)


@csrf_exempt
def generar_ambientes(request):
    if request.method == "POST" and request.is_ajax():
        data = request.POST
        ambientes = {}
        for i in data:
            if data[i] == '':
                ambientes[i] = 0
            else:
                ambientes[i] = int(data[i])

        id_local = data['local']
        curso = data['curso']

        if data['directorio'] == "1":
            ambiente_local = DirectorioLocalAmbiente
            local = DirectorioLocalCurso
            localcurso = DirectorioLocalCurso.objects.get(local_id=id_local, curso_id=curso)

        else:
            ambiente_local = LocalAmbiente
            local = LocalCurso
            localcurso = LocalCurso.objects.get(local_id=id_local, curso_id=curso)

        object = {
            'cantidad_usar_aulas': [
                restar(ambiente_local.objects.filter(localcurso__local_id=id_local, localcurso__curso_id=curso,
                                                     id_ambiente=1).count(),
                       ambientes['cantidad_usar_aulas']), 1],
            'cantidad_usar_auditorios': [
                restar(ambiente_local.objects.filter(localcurso__local_id=id_local, localcurso__curso_id=curso,
                                                     id_ambiente=2).count(),
                       ambientes['cantidad_usar_auditorios']), 2],
            'cantidad_usar_sala': [
                restar(ambiente_local.objects.filter(localcurso__local_id=id_local, localcurso__curso_id=curso,
                                                     id_ambiente=3).count(),
                       ambientes['cantidad_usar_sala']), 3],
            'cantidad_usar_oficina': [
                restar(ambiente_local.objects.filter(localcurso__local_id=id_local, localcurso__curso_id=curso,
                                                     id_ambiente=4).count(),
                       ambientes['cantidad_usar_oficina']), 4],
            'cantidad_usar_computo': [
                restar(ambiente_local.objects.filter(localcurso__local_id=id_local, localcurso__curso_id=curso,
                                                     id_ambiente=5).count(),
                       ambientes['cantidad_usar_computo']), 5],
            'cantidad_usar_otros': [
                restar(ambiente_local.objects.filter(localcurso__local_id=id_local, localcurso__curso_id=curso,
                                                     id_ambiente=6).count(),
                       ambientes['cantidad_usar_otros']), 6]
        }

        for i in object:
            if object[i][0] > 0:
                for a in range(object[i][0]):
                    localambiente = ambiente_local(localcurso=localcurso,
                                                   id_ambiente=Ambiente.objects.get(pk=object[i][1]))
                    localambiente.save()
            elif object[i][0] < 0:
                borrar = ambiente_local.objects.filter(localcurso__local_id=id_local, localcurso__curso_id=curso,
                                                       id_ambiente=Ambiente.objects.get(pk=object[i][1])). \
                             order_by('-id_localambiente')[:(-1 * object[i][0])]

                ambiente_local.objects.filter(pk__in=borrar).delete()

        response = ambiente_local.objects.filter(localcurso__local_id=id_local, localcurso__curso_id=curso).values(
            'numero', 'id_ambiente__nombre_ambiente', 'id_ambiente_id', 'capacidad', 'n_piso')
        return JsonResponse(list(response), safe=False)


@csrf_exempt
def directorioSeleccionado(request, id_directoriolocal, id_curso):
    directorio = DirectorioLocal.objects.get(pk=id_directoriolocal)
    directoriolocalcurso = DirectorioLocalCurso.objects.get(local_id=id_directoriolocal, curso_id=id_curso)
    sumarDisponiblesUsar(id_directoriolocal, True)
    if Local.objects.filter(id_directoriolocal_id=id_directoriolocal).count():
        localseleccionado = Local.objects.filter(id_directoriolocal_id=id_directoriolocal,
                                                 localcurso__curso_id=id_curso).update(
            nombre_local=directorio.nombre_local, nombre_via=directorio.nombre_via,
            zona_ubicacion_local=directorio.zona_ubicacion_local,
            mz_direccion=directorio.mz_direccion, tipo_via=directorio.tipo_via,
            referencia=directorio.referencia,
            n_direccion=directorio.n_direccion, km_direccion=directorio.km_direccion,
            lote_direccion=directorio.lote_direccion, piso_direccion=directorio.piso_direccion,
            telefono_local_fijo=directorio.telefono_local_fijo,
            telefono_local_celular=directorio.telefono_local_celular,
            funcionario_nombre=directorio.funcionario_nombre, funcionario_email=directorio.funcionario_email,
            funcionario_cargo=directorio.funcionario_cargo, responsable_nombre=directorio.responsable_nombre,
            responsable_email=directorio.responsable_email,
            responsable_telefono=directorio.responsable_telefono,
            responsable_celular=directorio.responsable_celular, ubigeo_id=directorio.ubigeo_id,
            fecha_inicio=directorio.fecha_inicio, fecha_fin=directorio.fecha_fin,
            cantidad_total_aulas=directorio.cantidad_total_aulas,
            cantidad_disponible_aulas=directorio.cantidad_disponible_aulas,
            cantidad_usar_aulas=directorio.cantidad_usar_aulas,
            cantidad_total_auditorios=directorio.cantidad_total_auditorios,
            cantidad_disponible_auditorios=directorio.cantidad_disponible_auditorios,
            cantidad_usar_auditorios=directorio.cantidad_usar_auditorios,
            cantidad_total_sala=directorio.cantidad_total_sala,
            cantidad_disponible_sala=directorio.cantidad_disponible_sala,
            cantidad_usar_sala=directorio.cantidad_usar_sala,
            cantidad_total_oficina=directorio.cantidad_total_oficina,
            cantidad_disponible_oficina=directorio.cantidad_disponible_oficina,
            cantidad_usar_oficina=directorio.cantidad_usar_oficina,
            cantidad_total_otros=directorio.cantidad_total_otros,
            cantidad_disponible_otros=directorio.cantidad_disponible_otros,
            cantidad_usar_otros=directorio.cantidad_usar_otros,
            especifique_otros=directorio.especifique_otros,
            cantidad_total_computo=directorio.cantidad_total_computo,
            cantidad_disponible_computo=directorio.cantidad_disponible_computo,
            cantidad_usar_computo=directorio.cantidad_usar_computo, id_directoriolocal_id=directorio.id_local,
            total_aulas=directorio.total_aulas, total_disponibles=directorio.total_disponibles,
            funcionario_celular=directorio.funcionario_celular, turno_uso_local=directorio.turno_uso_local)
        local = Local.objects.get(id_directoriolocal_id=id_directoriolocal)
    else:
        local = Local(nombre_local=directorio.nombre_local, nombre_via=directorio.nombre_via,
                      zona_ubicacion_local=directorio.zona_ubicacion_local,
                      mz_direccion=directorio.mz_direccion, tipo_via=directorio.tipo_via,
                      referencia=directorio.referencia,
                      n_direccion=directorio.n_direccion, km_direccion=directorio.km_direccion,
                      lote_direccion=directorio.lote_direccion, piso_direccion=directorio.piso_direccion,
                      telefono_local_fijo=directorio.telefono_local_fijo,
                      telefono_local_celular=directorio.telefono_local_celular,
                      funcionario_nombre=directorio.funcionario_nombre, funcionario_email=directorio.funcionario_email,
                      funcionario_cargo=directorio.funcionario_cargo, responsable_nombre=directorio.responsable_nombre,
                      responsable_email=directorio.responsable_email,
                      responsable_telefono=directorio.responsable_telefono,
                      responsable_celular=directorio.responsable_celular, ubigeo_id=directorio.ubigeo_id,
                      fecha_inicio=directorio.fecha_inicio, fecha_fin=directorio.fecha_fin,
                      cantidad_total_aulas=directorio.cantidad_total_aulas,
                      cantidad_disponible_aulas=directorio.cantidad_disponible_aulas,
                      cantidad_usar_aulas=directorio.cantidad_usar_aulas,
                      cantidad_total_auditorios=directorio.cantidad_total_auditorios,
                      cantidad_disponible_auditorios=directorio.cantidad_disponible_auditorios,
                      cantidad_usar_auditorios=directorio.cantidad_usar_auditorios,
                      cantidad_total_sala=directorio.cantidad_total_sala,
                      cantidad_disponible_sala=directorio.cantidad_disponible_sala,
                      cantidad_usar_sala=directorio.cantidad_usar_sala,
                      cantidad_total_oficina=directorio.cantidad_total_oficina,
                      cantidad_disponible_oficina=directorio.cantidad_disponible_oficina,
                      cantidad_usar_oficina=directorio.cantidad_usar_oficina,
                      cantidad_total_otros=directorio.cantidad_total_otros,
                      cantidad_disponible_otros=directorio.cantidad_disponible_otros,
                      cantidad_usar_otros=directorio.cantidad_usar_otros,
                      especifique_otros=directorio.especifique_otros,
                      cantidad_total_computo=directorio.cantidad_total_computo,
                      cantidad_disponible_computo=directorio.cantidad_disponible_computo,
                      cantidad_usar_computo=directorio.cantidad_usar_computo, id_directoriolocal_id=directorio.id_local,
                      total_aulas=directorio.total_aulas, total_disponibles=directorio.total_disponibles,
                      funcionario_celular=directorio.funcionario_celular, turno_uso_local=directorio.turno_uso_local)
    local.save()
    try:
        localcurso = LocalCurso.objects.get(local_id=local.id_local, curso_id=directoriolocalcurso.curso_id)
    except LocalCurso.DoesNotExist:
        LocalCurso(local_id=local.id_local, curso_id=directoriolocalcurso.curso_id).save()
        localcurso = LocalCurso.objects.get(local_id=local.id_local, curso_id=directoriolocalcurso.curso_id)

    generarAmbientesLocalSeleccionado(localcurso.id, id_curso)

    return JsonResponse({'msg': True})


def generarAmbientesLocalSeleccionado(localcurso, id_curso):
    local = LocalCurso.objects.get(pk=localcurso)
    ambientes = LocalAmbiente.objects.filter(localcurso_id=localcurso).count()

    if ambientes:
        LocalAmbiente.objects.filter(localcurso_id=localcurso).delete()

    ambientesdirectorio = DirectorioLocalAmbiente.objects.filter(
        localcurso__local_id=local.local.id_directoriolocal,
        localcurso__curso_id=id_curso)
    if ambientesdirectorio:
        for aula in ambientesdirectorio:
            LocalAmbiente(localcurso_id=local.id, n_piso=aula.n_piso, numero=aula.numero,
                          id_ambiente_id=aula.id_ambiente_id, capacidad=aula.capacidad).save()


class SeleccionarLocalDisponible(APIView):
    def post(self, request):
        id_local = request.data['id_local']
        local = Local.objects.get(pk=id_local)
        local.usar = 1
        local.save()
        return JsonResponse({'msg': 'Local cambiado a local a usar'})


class DeseleccionarLocalDisponible(APIView):
    def post(self, request):
        id_local = request.data['id_local']
        print(id_local)
        local = Local.objects.get(pk=id_local)
        local.usar = 0
        local.save()
        return JsonResponse({'usar': local.usar})


def addLocalesCurso(request):
    cursos = Curso.objects.filter(etapa=3)
    directorio = DirectorioLocal.objects.all()
    bulkInsert = []
    for curso in cursos:
        for dir in directorio:
            localcurso = DirectorioLocalCurso(curso_id=curso.id_curso, local_id=dir.id_local)
            bulkInsert.append(localcurso)

    DirectorioLocalCurso.objects.bulk_create(bulkInsert)


def _calcularTotalAulas():
    locales = Local.objects.all()
    for local in locales:
        local.total_aulas = int(local.cantidad_usar_auditorios or 0) + int(local.cantidad_usar_aulas or 0) + int(
            local.cantidad_usar_computo or 0) + int(local.cantidad_usar_oficina or 0) + int(
            local.cantidad_usar_otros or 0) + int(
            local.cantidad_usar_sala or 0) + int(local.cantidad_usar_sala or 0)
        local.save()
    return JsonResponse({'msg': True})


def calcularTotalAulas(request):
    locales = Local.objects.all()
    for local in locales:
        local.total_aulas = int(local.cantidad_usar_auditorios or 0) + int(local.cantidad_usar_aulas or 0) + int(
            local.cantidad_usar_computo or 0) + int(local.cantidad_usar_oficina or 0) + int(
            local.cantidad_usar_otros or 0) + int(
            local.cantidad_usar_sala or 0) + int(local.cantidad_usar_sala or 0)
        local.save()
    return JsonResponse({'msg': True})


def llenarDBGIS(request):
    metaubigeos = MetaAula.objects.values('ubigeo').distinct()
    responseTotal = []
    for metaubigeo in metaubigeos:
        metaCurso = MetaAula.objects.filter(ubigeo=metaubigeo['ubigeo'])
        response = {}
        response['UBIGEO'] = metaubigeo['ubigeo']
        for ubigeo in metaCurso:
            metaubigeocurso = LocalCurso.objects.filter(curso_id=ubigeo.curso, local__ubigeo=ubigeo.ubigeo).aggregate(
                total=Sum('local__total_aulas'))
            model_key = 'CAPACITACION_CURSO{}'.format(ubigeo.curso)
            if metaubigeocurso['total'] is not None:
                print(metaubigeocurso['total'], ubigeo.meta)
                percent = int(round((metaubigeocurso['total'] / ubigeo.meta) * 100))
                response[model_key] = percent
            else:
                response[model_key] = 0
        GISLimiteDis.objects.using('arcgis').filter(UBIGEO=response['UBIGEO']).update(**response)
        metaubigeos = list(MetaAula.objects.values_list('ubigeo', flat=True).distinct())
        query = GISLimiteDis.objects.using('arcgis').filter(UBIGEO__in=metaubigeos).values()
    return JsonResponse(list(query), safe=False)


def diccionarioCursos(request):
    cursos = Curso.objects.all()
    response = {}
    for curso in cursos:
        keycurso = 'CAPACITACION_CURSO{}'.format(curso.id_curso)
        nombrecurso = curso.nombre_curso
        response[keycurso] = nombrecurso

    return JsonResponse(response)


def llenarDBGISProv(request):
    GISLimiteDis.objects.all()
    provincias = GISLimiteProv.objects.using('arcgis').all()
    cursos = Curso.objects.all()
    for prov in provincias:
        for curso in cursos:
            valuecurso = 'CAPACITACION_CURSO{}'.format(curso.id_curso)
            totalcurso = LocalCurso.objects.filter(curso_id=curso.id_curso, local__ubigeo__ccdd=prov.CCDD,
                                                   local__ubigeo__ccpp=prov.CCPP).aggregate(
                total=Sum('local__total_aulas'))
            metaCurso = MetaAula.objects.filter(ccdd=prov.CCDD, ccpp=prov.CCPP, curso=curso.id_curso).aggregate(
                totalMeta=Sum('meta'))
            if totalcurso['total'] is None or metaCurso['totalMeta'] is None:
                percent = None
            else:
                percent = int(round((totalcurso['total'] / metaCurso['totalMeta']) * 100))
            kwargs = {valuecurso: percent}
            GISLimiteProv.objects.using('arcgis').filter(OBJECTID=prov.OBJECTID).update(**kwargs)

    return JsonResponse({'msg': 'Actualizado con exito'}, safe=False)


def llenarDBGISDep(request):
    departamentos = GISLimiteDep.objects.using('arcgis').all()
    cursos = Curso.objects.all()
    for prov in departamentos:
        for curso in cursos:
            valuecurso = 'CAPACITACION_CURSO{}'.format(curso.id_curso)
            totalcurso = LocalCurso.objects.filter(curso_id=curso.id_curso, local__ubigeo__ccdd=prov.CCDD).aggregate(
                total=Sum('local__total_aulas'))
            metaCurso = MetaAula.objects.filter(ccdd=prov.CCDD, curso=curso.id_curso).aggregate(
                totalMeta=Sum('meta'))
            if totalcurso['total'] is None or metaCurso['totalMeta'] is None:
                percent = None
            else:
                percent = int(round((totalcurso['total'] / metaCurso['totalMeta']) * 100))
            kwargs = {valuecurso: percent}
            GISLimiteDep.objects.using('arcgis').filter(CCDD=prov.CCDD).update(**kwargs)

    return JsonResponse({'msg': 'Actualizado con exito'}, safe=False)

# def llenarDBGISProv(request):
#     metaubigeos = MetaAula.objects.values('ubigeo').distinct()
#     responseTotal = []
#     for metaubigeo in metaubigeos:
#         metaCurso = MetaAula.objects.filter(ubigeo=metaubigeo['ubigeo'])
#         response = {}
#         response['UBIGEO'] = metaubigeo['ubigeo']
#         for ubigeo in metaCurso:
#             metaubigeocurso = LocalCurso.objects.filter(curso_id=ubigeo.curso, local__ubigeo=ubigeo.ubigeo).aggregate(
#                 total=Sum('local__total_aulas'))
#             model_key = 'CAPACITACION_CURSO{}'.format(ubigeo.curso)
#             if metaubigeocurso['total'] is not None:
#                 print(metaubigeocurso['total'], ubigeo.meta)
#                 percent = int(round((metaubigeocurso['total'] / ubigeo.meta) * 100))
#                 response[model_key] = percent
#             else:
#                 response[model_key] = 0
#         GISLimiteDis.objects.using('arcgis').filter(UBIGEO=response['UBIGEO']).update(**response)
#         metaubigeos = list(MetaAula.objects.values_list('ubigeo', flat=True).distinct())
#         query = GISLimiteDis.objects.using('arcgis').filter(UBIGEO__in=metaubigeos).values()
#     return JsonResponse(list(query), safe=False)
