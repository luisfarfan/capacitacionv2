from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics, viewsets
from .serializer import *


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
