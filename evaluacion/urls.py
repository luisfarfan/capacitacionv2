from .views import *
from django.conf.urls import url
from rest_framework import routers

routerEvaluacion = routers.DefaultRouter()
routerEvaluacion.register(r'criterioscurso', CriteriosCursoViewSet)
# routerAsistencia.register(r'crudpersonalaula', PersonalAulaViewSet)

urlpatterns = [
    url(r'saveNotas/$', saveNotas),
    url(r'criteriosdetalle_curso/(?P<curso>[0-9]+)/$',
        CriterioCursoFilterViewSet.as_view()),
]
