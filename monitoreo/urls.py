from .views import *
from django.conf.urls import url

urlpatterns = [
    url(r'resumennacional/(?P<curso>[0-9]+)/$', ResumenNacional.as_view()),
    url(r'resumennacional/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', ResumenNacional.as_view()),
    url(r'resumennacional/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$', ResumenNacional.as_view()),
    url(r'resumennacional/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        ResumenNacional.as_view()),

    url(r'etapas/(?P<curso>[0-9]+)/$', Etapas.as_view()),
    url(r'cursos/$', Cursos.as_view()),
    url(r'cursos/(?P<etapa>[0-9]+)/$', Cursos.as_view()),

    url(r'consecucionAulas/(?P<curso>[0-9]+)/$', consecucionAulas.as_view()),
    url(r'consecucionAulas/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', consecucionAulas.as_view()),
    url(r'consecucionAulas/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$', consecucionAulas.as_view()),
    url(r'consecucionAulas/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        consecucionAulas.as_view()),

    url(r'personalCapacitar/(?P<curso>[0-9]+)/$', personalCapacitar.as_view()),
    url(r'personalCapacitar/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', personalCapacitar.as_view()),
    url(r'personalCapacitar/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$', personalCapacitar.as_view()),
    url(r'personalCapacitar/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        personalCapacitar.as_view()),

    url(r'personalCapacitado/(?P<curso>[0-9]+)/$', personalCapacitado.as_view()),
    url(r'personalCapacitado/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', personalCapacitado.as_view()),
    url(r'personalCapacitado/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$', personalCapacitado.as_view()),
    url(r'personalCapacitado/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        personalCapacitado.as_view()),

    url(r'resultadosCapacitacion/(?P<curso>[0-9]+)/$', resultadosCapacitacion.as_view()),
    url(r'resultadosCapacitacion/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', resultadosCapacitacion.as_view()),
    url(r'resultadosCapacitacion/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        resultadosCapacitacion.as_view()),
    url(r'resultadosCapacitacion/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        resultadosCapacitacion.as_view()),

    url(r'porSexo/(?P<curso>[0-9]+)/$', porSexo.as_view()),
    url(r'porSexo/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', porSexo.as_view()),
    url(r'porSexo/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        porSexo.as_view()),
    url(r'porSexo/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        porSexo.as_view()),

    url(r'grupoEdad/(?P<curso>[0-9]+)/$', grupoEdad.as_view()),
    url(r'grupoEdad/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', grupoEdad.as_view()),
    url(r'grupoEdad/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        grupoEdad.as_view()),
    url(r'grupoEdad/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        grupoEdad.as_view()),

    url(r'nivelEducativo/(?P<curso>[0-9]+)/$', nivelEducativo.as_view()),
    url(r'nivelEducativo/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', nivelEducativo.as_view()),
    url(r'nivelEducativo/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        nivelEducativo.as_view()),
    url(r'nivelEducativo/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        nivelEducativo.as_view()),

    url(r'updateCantidadAulasLocales/$', updateCantidadAulasLocales),
    url(r'updatePersonal/$', updatePersonal),
    url(r'updateSexo/$', updateSexo),
]
