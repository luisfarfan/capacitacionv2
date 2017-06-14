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
routerControlcalidad.register(r'Manual', ManualViewSet)
routerControlcalidad.register(r'AulaInstructor', AulaInstructorViewSet)
# routerControlcalidad.register(r'RespuestaLocal', RespuestaLocalViewSet)

urlpatterns = [
    # url(r'localescurso/(?P<curso>.+)/$', LocalesCursoViewSet.as_view()),
    url(r'aulaslocal/(?P<local>.+)/$', AulasLocalViewSet.as_view()),
    url(r'localescurso/(?P<curso>.+)/$', LocalesCurso.as_view()),
    url(r'grupopreguntas/(?P<formato>[0-9]+)/$',
        GrupoPreguntasFilterViewSet.as_view()),
    url(r'Manual/(?P<curso>[0-9]+)/$',
        ManualCursoFilterViewSet.as_view()),
    url(r'preguntas/(?P<conjunto>[0-9]+)/$',
        PreguntasFilterViewSet.as_view()),
    url(r'addedit/$',
        addEditRespuestasLocales.as_view()),
    url(r'addeditaula/$',
        addEditRespuestasAulas.as_view()),
    url(r'addeditmanual/$',
        addEditRespuestasManuales.as_view()),
url(r'estadomanual/(?P<idaula>[0-9]+)/(?P<idmanual>[0-9]+)$',
    EstadoManualsFilterViewSet.as_view()),
]