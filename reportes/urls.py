from .views import *
from django.conf.urls import url

urlpatterns = [
    # DirectorioLocales Reporte por numero de ambientes
    url(r'directoriolocales_numeroambientes/(?P<curso>[0-9]+)/$', directoriolocalesNumeroAmbientes.as_view()),
    url(r'directoriolocales_numeroambientes/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$',
        directoriolocalesNumeroAmbientes.as_view()),
    url(r'directoriolocales_numeroambientes/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        directoriolocalesNumeroAmbientes.as_view()),
    url(r'directoriolocales_numeroambientes/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        directoriolocalesNumeroAmbientes.as_view()),
    url(
        r'directoriolocales_numeroambientes/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        directoriolocalesNumeroAmbientes.as_view()),
    # Fin ubigeo locales marco segun ubigeo

    url(r'localesseleccionados_numeroambientes/(?P<curso>[0-9]+)/$', localseleccionadoNumeroAmbientes.as_view()),
    url(r'localesseleccionados_numeroambientes/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$',
        localseleccionadoNumeroAmbientes.as_view()),
    url(r'localesseleccionados_numeroambientes/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        localseleccionadoNumeroAmbientes.as_view()),
    url(r'localesseleccionados_numeroambientes/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        localseleccionadoNumeroAmbientes.as_view()),
    url(
        r'localesseleccionados_numeroambientes/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        localseleccionadoNumeroAmbientes.as_view()),
    url(r'asistenciaporCurso/(?P<curso>[0-9]+)/$', asistenciaporCurso.as_view()),

]
