from .views import *
from django.conf.urls import url
from rest_framework import routers

routerEvaluacion = routers.DefaultRouter()
routerEvaluacion.register(r'criterioscurso', CriteriosCursoViewSet)
routerEvaluacion.register(r'personalnointernetnotas', PersonalNotasSinInternetViewSet)
# routerAsistencia.register(r'crudpersonalaula', PersonalAulaViewSet)

urlpatterns = [
    url(r'saveNotas/$', saveNotas),
    url(r'saveNotasFinal/$', saveNotasFinal),
    url(r'cerrarCursoConInternet/(?P<curso>[0-9]+)/(?P<ubigeo>[0-9]+)/$',cerrarCursoConInternet),
    url(r'cerrarCursoSinInternet/(?P<curso>[0-9]+)/(?P<ubigeo>[0-9]+)/$', cerrarCursoSinInternet),
    url(r'saveNotaFinalSinInternet/$', saveNotaFinalSinInternet),
    url(r'cerrarCursoEmpadronador/$', cerrarCursoEmpadronador),
    url(r'criteriosdetalle_curso/(?P<curso>[0-9]+)/$',
        CriterioCursoFilterViewSet.as_view()),

    url(r'personalaula_notafinal/(?P<id_cargofuncional>[0-9]+)/(?P<ccdd>[0-9]+)/$',
        PersonalAulaDetalleNotaFinalViewSet.as_view()),
    url(r'personalaula_notafinal/(?P<id_cargofuncional>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        PersonalAulaDetalleNotaFinalViewSet.as_view()),
    url(r'personalaula_notafinal/(?P<id_cargofuncional>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        PersonalAulaDetalleNotaFinalViewSet.as_view()),
    url(
        r'personalaula_notafinal/(?P<id_cargofuncional>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        PersonalAulaDetalleNotaFinalViewSet.as_view()),
    url(r'cargos_curso/(?P<curso>[0-9]+)/$',
        CargosCursoViewSet.as_view()),
    url(r'ambitosRankeo/$',
        UbigeosRankeoViewSet.as_view()),
    url(r'ambitosRankeo/(?P<ccdd>[0-9]+)/$',
        UbigeosRankeoViewSet.as_view()),
    url(r'ambitosRankeo/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        UbigeosRankeoViewSet.as_view()),
    url(r'ambitosRankeo/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        UbigeosRankeoViewSet.as_view()),
    url(r'meta/(?P<cargofuncional>[0-9]+)/(?P<ccdd>[0-9]+)/$',
        Meta.as_view()),
    url(r'meta/(?P<cargofuncional>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        Meta.as_view()),
    url(r'meta/(?P<cargofuncional>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        Meta.as_view()),
    url(r'meta/(?P<cargofuncional>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        Meta.as_view()),

    url(r'personalaula_sininternet/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$',
        PersonalAulaDetalleNotaFinalSinInternetViewSet.as_view()),
    url(r'personalaula_sininternet/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        PersonalAulaDetalleNotaFinalSinInternetViewSet.as_view()),
    url(r'personalaula_sininternet/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        PersonalAulaDetalleNotaFinalSinInternetViewSet.as_view()),
    url(
        r'personalaula_sininternet/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        PersonalAulaDetalleNotaFinalSinInternetViewSet.as_view()),
    url(r'personalnotas_sininternet/(?P<curso>[0-9]+)/(?P<ubigeo>[0-9]+)/$',
        PersonalNotasSinInternet.as_view()),

    url(r'personalrankeo_sininternet/(?P<cargo>[0-9]+)/(?P<ccdd>[0-9]+)/$',
        PersonalNotaFinalSinInternetViewSet.as_view()),
    url(r'personalrankeo_sininternet/(?P<cargo>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        PersonalNotaFinalSinInternetViewSet.as_view()),
    url(r'personalrankeo_sininternet/(?P<cargo>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        PersonalNotaFinalSinInternetViewSet.as_view()),
    url(
        r'personalrankeo_sininternet/(?P<cargo>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        PersonalNotaFinalSinInternetViewSet.as_view()),
    url(r'algo/$', algo),
    url(r'bajas/$', bajas),
    url(r'altas/$', altas),
    url(r'titulares/$', titulares),
    url(r'reserva/$', reserva),
    url(r'aprobados/$', aprobados),
    url(r'dnis/$', chio),
    url(r'updateBajas/$', updateBajas),
]
