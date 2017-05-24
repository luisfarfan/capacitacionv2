from django.conf.urls import url
from rest_framework import routers
from .views import *

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
routerControlcalidad.register(r'usuariolocales', UsuarioLocalesViewSet)

urlpatterns = [
    # url(r'localescurso/(?P<curso>.+)/$', LocalesCursoViewSet.as_view()),
    url(r'aulaslocal/(?P<local>.+)/$', AulasLocalViewSet.as_view()),
    url(r'localescurso/(?P<curso>.+)/$', LocalesCurso.as_view())
]
