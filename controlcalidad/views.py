from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics, viewsets
from .serializer import *
from locales_consecucion.serializer import LocalSerializer, LocalAmbienteSerializer
from locales_consecucion.models import Local, LocalAmbiente
from django.http import JsonResponse

from django.db.models import Subquery

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
