from .views import *
from django.conf.urls import url
from rest_framework import routers

routerControlcalidad = routers.DefaultRouter()
routerControlcalidad.register(r'etapascontrolcalidad', EtapasControlCalidadViewSet)
routerControlcalidad.register(r'tipodocumento', TipoDocumentoViewSet)
routerControlcalidad.register(r'documentos', DocumentosViewSet)
routerControlcalidad.register(r'formatos', FormatosViewSet)
routerControlcalidad.register(r'grupopreguntas', GrupoPreguntasViewSet)
routerControlcalidad.register(r'preguntas', PreguntasViewSet)
routerControlcalidad.register(r'tipopreguntas', TipoPreguntaViewSet)
routerControlcalidad.register(r'opciones', OpcionesViewSet)
routerControlcalidad.register(r'localambientesrespuestas', LocalAmbienteRespuestasViewSet)
