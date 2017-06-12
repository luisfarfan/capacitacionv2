from rest_framework.views import APIView
from rest_framework import generics, viewsets
from .serializer import *
from locales_consecucion.serializer import LocalSerializer, LocalAmbienteSerializer
from locales_consecucion.models import Local, LocalAmbiente
from django.http import JsonResponse
import json
from .models import RespuestaLocal, RespuestaManuales
from .mixins import CustomQueryMixin

"""
Servicio: Locales según Curso de Capacitación
"""


class LocalesCurso(APIView):
    def get(self, request, curso):
        locales = list(Local.objects.filter(localcurso__curso_id=curso, usar=1).values())
        response = []
        for local in locales:
            try:
                usuariolocales = UsuarioLocales.objects.get(local_id=local['id_local'])
            except UsuarioLocales.DoesNotExist:
                usuariolocales = None
            if usuariolocales:
                local['seleccionar'] = 1
                local['instructor'] = usuariolocales.usuario
                local['localusuario'] = usuariolocales.id
                response.append(local)
            else:
                local['seleccionar'] = 0
                local['instructor'] = None
                local['localusuario'] = None
                response.append(local)

        return JsonResponse(response, safe=False)


class LocalesCursoViewSet(generics.ListAPIView):
    serializer_class = LocalSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        return Local.objects.filter(localcurso__curso_id=curso, usar=1)


class AulasLocalViewSet(generics.ListAPIView):
    serializer_class = LocalAmbienteSerializer

    def get_queryset(self):
        local = self.kwargs['local']
        return LocalAmbiente.objects.filter(localcurso__local_id=local)


class UsuarioLocalesViewSet(viewsets.ModelViewSet):
    queryset = UsuarioLocales.objects.all()
    serializer_class = UsuarioLocalesSerializer


class EtapasControlCalidadViewSet(viewsets.ModelViewSet):
    queryset = EtapasControlCalidad.objects.all()
    serializer_class = EtapasControlCalidadSerializer


class TipoDocumentoViewSet(viewsets.ModelViewSet):
    queryset = TipoDocumento.objects.all()
    serializer_class = TipoDocumentoSerializer


class DocumentosViewSet(viewsets.ModelViewSet):
    queryset = Documentos.objects.all()
    serializer_class = DocumentosSerializer


class FormatosViewSet(viewsets.ModelViewSet):
    queryset = Formatos.objects.all()
    serializer_class = FormatosSerializer


class GrupoPreguntasViewSet(viewsets.ModelViewSet):
    queryset = GrupoPreguntas.objects.all()
    serializer_class = GrupoPreguntasSerializer


class PreguntasViewSet(viewsets.ModelViewSet):
    queryset = Preguntas.objects.all()
    serializer_class = PreguntasSerializer


class TipoPreguntaViewSet(viewsets.ModelViewSet):
    queryset = TipoPregunta.objects.all()
    serializer_class = TipoPreguntaSerializer


class OpcionesViewSet(viewsets.ModelViewSet):
    queryset = Opciones.objects.all()
    serializer_class = OpcionesSerializer


class LocalAmbienteRespuestasViewSet(viewsets.ModelViewSet):
    queryset = LocalAmbienteRespuestas.objects.all()
    serializer_class = LocalAmbienteRespuestasSerializer


class ManualViewSet(viewsets.ModelViewSet):
    queryset = Manual.objects.all()
    serializer_class = ManualSerializer


class GrupoPreguntasFilterViewSet(generics.ListAPIView):
    serializer_class = GrupoPreguntasSerializer

    def get_queryset(self):
        formato = self.kwargs['formato']
        return GrupoPreguntas.objects.filter(formato=formato)


class ManualCursoFilterViewSet(generics.ListAPIView):
    serializer_class = ManualSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        return Manual.objects.filter(curso=curso)


class PreguntasFilterViewSet(generics.ListAPIView):
    serializer_class = PreguntasSerializer

    def get_queryset(self):
        grupo_id = self.kwargs['conjunto']
        return Preguntas.objects.filter(grupo_id=grupo_id)


# class RespuestaLocalViewSet(viewsets.ModelViewSet):
#     queryset = Manual.objects.all()
#     serializer_class = RespuestaLocalSerializer

class addEditRespuestasLocales(generics.ListAPIView):
    def post(self, request):
        postdata = request.POST['data']
        data = json.loads(postdata)
        c = 1
        for preguntas in data:
            for opciones in preguntas['opciones']:
                if RespuestaLocal.objects.filter(local_id=preguntas['id'],
                                                 llave=c).count() == 0:
                    RespuestaLocal(llave=c,pregunta=preguntas['pregunta'],local_id=preguntas['id'], opcionselected_id=opciones['opcion'],
                                   respuesta_texto=opciones['respuesta'],opcional=opciones['opcional']).save()
                    c=c+1

        return JsonResponse({'msg': 'Hecho'})

class addEditRespuestasAulas(generics.ListAPIView):
    def post(self, request):
        postdata = request.POST['data']
        data = json.loads(postdata)
        c = 1
        for preguntas in data:
            for opciones in preguntas['opciones']:
                if RespuestaAula.objects.filter(aula_id=preguntas['id'],
                                                 llave=c).count() == 0:
                    RespuestaAula(llave=c, pregunta=preguntas['pregunta'],respuesta_texto=opciones['respuesta'],
                                   aula_id=preguntas['id'],opcionselected_id=opciones['opcion']).save()
                    c = c + 1

        return JsonResponse({'msg': 'Hecho'})

class addEditRespuestasManuales(generics.ListAPIView):
    def post(self, request):
        postdata = request.POST['data']
        data = json.loads(postdata)
        c = 1
        for preguntas in data:
            for opciones in preguntas['opciones']:

                if RespuestaManuales.objects.filter(aula_id=preguntas['id'],
                                                 llave=c,manual_id=preguntas['id_manual']).count() == 0:
                    RespuestaManuales(llave=c, pregunta=preguntas['pregunta'],respuesta_texto=opciones['respuesta'],
                                   aula_id=preguntas['id'],manual_id=preguntas['id_manual'],opcionselected_id=opciones['opcion']).save()
                    c = c + 1

        return JsonResponse({'msg': 'Hecho'})



class EstadoManualsFilterViewSet(CustomQueryMixin, generics.GenericAPIView):
    serializer_class = SuccessSerializer

    def get_queryset(self):
        idaula = self.kwargs.get('idaula')
        idmanual = self.kwargs.get('idmanual')
        datos = RespuestaManuales.objects.filter(aula_id=idaula, manual_id=idmanual)
        if datos.exists():
            return {"success": True}
        else:
            return {"success": False}

