from .views import *
from django.conf.urls import url

routerDistribucion = routers.DefaultRouter()
routerDistribucion.register(r'localambito', LocalAmbitoViewSet)
routerDistribucion.register(r'crudpersonalaula', PersonalAulaViewSet)

urlpatterns = [
    url(r'localzona_detalle/(?P<localcurso>[0-9]+)/$', LocalZonaDetalleViewSet.as_view()),
    url(r'asignarZonas/$', saveZonasLocal),
    # Urls para ubigeos libres para asignar
    # Nacional - Todos los departamentos
    url(r'ambitoslibres/(?P<curso>[0-9]+)/$', UbigeosLibresViewSet.as_view()),
    # Provincias del departamento
    url(r'ambitoslibres/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', UbigeosLibresViewSet.as_view()),
    # Distritos de la provincia
    url(r'ambitoslibres/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$', UbigeosLibresViewSet.as_view()),
    # Zonas del Distrito
    url(r'ambitoslibres/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        ZonasLibresViewSet.as_view()),
    # Fin Urls para ubigeos libres para asignar
    # Urls para personal
    url(r'personalcapacitar_bylocalcurso/(?P<localcurso>[0-9]+)/$', PersonalLibreporCursoViewSet.as_view()),
    url(r'personalcapacitar_bylocalcurso/(?P<localcurso>[0-9]+)/(?P<contingencia>[0-9]+)/$',
        PersonalLibreporCursoViewSet.as_view()),
    # Urls para Local Ambientes
    url(r'localambiente_detalle/(?P<localcurso>[0-9]+)/$', LocalAmbienteDetalleViewSet.as_view()),
    # Url para distribucion
    url(r'distribuir/(?P<localcurso_id>[0-9]+)/$', distribuir_byLocalCurso),
    url(r'personalaula/(?P<id_localambiente>[0-9]+)/$', PersonalAulaDetalleViewSet.as_view()),
    # Url para setear instructor
    url(r'setInstructor/$', setInstructor),
    url(r'sendSMS/$', sendSMS),
    url(r'sendSMSEmpadronadorUrbano/$', sendSMSEmpadronadorUrbano),
    url(r'sendSMSEmpadronadorUrbanoDia2/$', sendSMSEmpadronadorUrbanoDia2),
    url(r'sendSMSEmpadronadorUrbanoNoAsistieronDia1/$', sendSMSEmpadronadorUrbanoNoAsistieronDia1),
    url(r'sendSMSEmpadronadorUrbanoNoAsistieronDia1JesusMariaZona4/$', sendSMSEmpadronadorUrbanoNoAsistieronDia1JesusMariaZona4),
    url(r'sendSMSEmpadronadorUrbanoNoAsistieronDia1JesusMariaZona5/$', sendSMSEmpadronadorUrbanoNoAsistieronDia1JesusMariaZona5),
]
