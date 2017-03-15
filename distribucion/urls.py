from .views import *
from django.conf.urls import url

routerDistribucion = routers.DefaultRouter()
routerDistribucion.register(r'localzona', LocalZonaViewSet)
routerDistribucion.register(r'crudpersonalaula', PersonalAulaViewSet)

urlpatterns = [
    url(r'localzona_detalle/(?P<localcurso>[0-9]+)/$', LocalZonaDetalleViewSet.as_view()),
    url(r'asignarZonas/$', saveZonasLocal),
    url(r'zonas_libres_por_asignar/(?P<curso>[0-9]+)/(?P<ubigeo>[0-9]+)/$', FilterZonaViewSet.as_view()),

    # Urls para personal
    url(r'personalcapacitar_bylocalcurso/(?P<localcurso>[0-9]+)/$', PersonalCapacitarbyCursoViewSet.as_view()),
    url(r'personalcapacitar_bylocalcurso/(?P<localcurso>[0-9]+)/(?P<contingencia>[0-9]+)/$',
        PersonalCapacitarbyCursoViewSet.as_view()),

    # Urls para Local Ambientes
    url(r'localambiente_detalle/(?P<localcurso>[0-9]+)/$', LocalAmbienteDetalleViewSet.as_view()),

    # Url para distribucion
    url(r'distribuir/(?P<localcurso_id>[0-9]+)/$', distribuir_byLocalCurso),
    url(r'personalaula/(?P<id_localambiente>[0-9]+)/$', PersonalAulaDetalleViewSet.as_view()),

    # Url para setear instructor
    url(r'setInstructor/$', setInstructor),
]
