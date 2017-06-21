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
routerControlcalidad.register(r'respuestaaula', RespuestaAulaViewSet)
# routerControlcalidad.register(r'respuestamanual', RespuestaManualViewSet)
# routerControlcalidad.register(r'respuestalocal', RespuestaLocalViewSet)

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
    url(r'respuestaaulalocal/(?P<curso>[0-9]+)/$',
        RespuestaAulaLocalViewSet.as_view()),
    url(r'capitulomanual/(?P<id>[0-9]+)/$',
        CapitulosManualViewSet.as_view()),
    url(r'respuestalocal/(?P<curso>[0-9]+)/$',
        RespuestaLocalViewSet.as_view()),
    url(r'respuestamanual/(?P<curso>[0-9]+)/$',
        RespuestaManualViewSet.as_view()),
    url(r'nombrecapitulo/(?P<id>[0-9]+)/$',
        CapitulosViewSet.as_view()),
    url(r'respuestaDurante/$',
        addEditRespuestaDurante.as_view()),
    url(r'estadodurantemanual/(?P<user>[0-9]+)/(?P<aula>[0-9]+)/(?P<manual>[0-9]+)/(?P<curso>[0-9]+)$',
        EstadoDuranteManualsFilterViewSet.as_view()),
    url(
        r'estadodurantecapitulo/(?P<user>[0-9]+)/(?P<aula>[0-9]+)/(?P<capitulo>[0-9]+)/(?P<manual>[0-9]+)/(?P<curso>[0-9]+)$',
        EstadoDuranteCapituloFilterViewSet.as_view()),
    url(r'estadolocal/(?P<local>[0-9]+)/(?P<curso>[0-9]+)/(?P<usuario>[0-9]+)$',
        EstadoLocalFilterViewSet.as_view()),
    url(r'estadoaula/(?P<local>[0-9]+)/(?P<aula>[0-9]+)/(?P<curso>[0-9]+)/(?P<usuario>[0-9]+)$',
        EstadoAulaFilterViewSet.as_view()),
    url(r'respuestaDuranteCapitulo/$',
        addEditRespuestaDuranteCapitulo.as_view()),
]
