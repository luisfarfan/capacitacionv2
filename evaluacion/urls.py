from .views import *
from django.conf.urls import url
from rest_framework import routers

routerEvaluacion = routers.DefaultRouter()
routerEvaluacion.register(r'criterioscurso', CriteriosCursoViewSet)
# routerAsistencia.register(r'crudpersonalaula', PersonalAulaViewSet)

urlpatterns = [
    url(r'saveNotas/$', saveNotas),
    url(r'saveNotasFinal/$', saveNotasFinal),
    url(r'criteriosdetalle_curso/(?P<curso>[0-9]+)/$',
        CriterioCursoFilterViewSet.as_view()),
    url(r'personalaula_notafinal/(?P<ubigeo>[0-9]+)/(?P<zona>[0-9]+)/(?P<id_cargofuncional>[0-9]+)/$',
        PersonalAulaDetalleNotaFinalViewSet.as_view()),
    url(r'cargos_curso/(?P<curso>[0-9]+)/$',
        CargosCursoViewSet.as_view()),
]
