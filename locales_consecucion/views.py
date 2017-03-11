# from rest_framework import generics
from .serializer import *
from rest_framework import generics, viewsets
from django.http import JsonResponse
from .utils import restar
from django.views.decorators.csrf import csrf_exempt


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
    serializer_class = CursoSerializer

    def get_queryset(self):
        etapa_id = self.kwargs['etapa_id']
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
        ubigeo = self.kwargs['ubigeo']
        if 'zona' in self.kwargs:
            zona = self.kwargs['zona']
            query = LocalCurso.objects.filter(curso_id=curso, local__ubigeo_id=ubigeo, local__zona_ubicacion_local=zona)
        else:
            query = LocalCurso.objects.filter(curso_id=curso, local__ubigeo_id=ubigeo)

        return query


class DirectorioLocalbyUbigeo(generics.ListAPIView):
    serializer_class = DirectorioLocalSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        ubigeo = self.kwargs['ubigeo']
        if 'zona' in self.kwargs:
            zona = self.kwargs['zona']
            query = DirectorioLocal.objects.filter(directoriolocalcurso__curso_id=curso, ubigeo_id=ubigeo,
                                                   zona_ubicacion_local=zona)
        else:
            query = DirectorioLocal.objects.filter(directoriolocalcurso__curso_id=curso, ubigeo_id=ubigeo)

        return query

        # def get_queryset(self):


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

    local = Local(nombre_local=directorio.nombre_local, nombre_via=directorio.nombre_via,
                  zona_ubicacion_local=directorio.zona_ubicacion_local,
                  mz_direccion=directorio.mz_direccion, tipo_via=directorio.tipo_via, referencia=directorio.referencia,
                  n_direccion=directorio.n_direccion, km_direccion=directorio.km_direccion,
                  lote_direccion=directorio.lote_direccion, piso_direccion=directorio.piso_direccion,
                  telefono_local_fijo=directorio.telefono_local_fijo,
                  telefono_local_celular=directorio.telefono_local_celular,
                  funcionario_nombre=directorio.funcionario_nombre, funcionario_email=directorio.funcionario_email,
                  funcionario_cargo=directorio.funcionario_cargo, responsable_nombre=directorio.responsable_nombre,
                  responsable_email=directorio.responsable_email, responsable_telefono=directorio.responsable_telefono,
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
                  cantidad_usar_computo=directorio.cantidad_usar_computo, id_directoriolocal_id=directorio.id_local)
    local.save()

    localcurso = LocalCurso(local_id=local.id_local, curso_id=directoriolocalcurso.curso_id)
    localcurso.save()
    localambientes = DirectorioLocalAmbiente.objects.filter(localcurso_id=directoriolocalcurso.id)
    if localambientes.count():
        for i in localambientes:
            ambientes = LocalAmbiente(localcurso_id=localcurso.id, id_ambiente_id=i.id_ambiente_id,
                                      capacidad=i.capacidad,
                                      n_piso=i.n_piso)
            ambientes.save()

    return JsonResponse({'msg': True}, safe=False)
