from .views import *
from django.conf.urls import url
from rest_framework import routers

routerAsistencia = routers.DefaultRouter()
routerAsistencia.register(r'localcurso', LocalCursoDetallebyLocalAmbienteViewSet)
routerAsistencia.register(r'personalauladetalle', PersonalAulaDetalleViewSet)
routerAsistencia.register(r'personal', PersonalViewSet)
routerAsistencia.register(r'personaldetalle', DetallePersonalViewSet)
# routerAsistencia.register(r'crudpersonalaula', PersonalAulaViewSet)

urlpatterns = [
    url(r'localambientes_instructor/(?P<id_instructor>[0-9]+)/(?P<curso>[0-9]+)/$',
        LocalAmbientebyInstructorViewSet.as_view()),
    url(r'getrangofechas/$', rangoFechas),
    url(r'personalaula_bylocalambiente/(?P<id_localambiente>[0-9]+)/$',
        FilterPersonalAulaDetalleViewSet.as_view()),
    url(r'saveAsistencia/$', saveAsistencia),
    url(r'saveAsistenciaEmpadronadorUrbano/$', saveAsistenciaEmpadronadorUrbano),
    url(r'darAlta/$', darAlta),
    url(r'localambientes_bylocal/(?P<id_local>[0-9]+)/$',
        LocalAmbientebyLocal.as_view()),

]
