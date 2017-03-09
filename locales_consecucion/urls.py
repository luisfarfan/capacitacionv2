from .views import *
from django.conf.urls import url

router = routers.DefaultRouter()
router.register(r'local', LocalViewSet)
router.register(r'localcurso', LocalCursoViewSet)
router.register(r'localambiente', LocalAmbienteViewSet)
router.register(r'directoriolocal', DirectorioLocalViewSet)
router.register(r'directoriolocalcurso', DirectorioLocalCursoViewSet)
router.register(r'directoriolocal_ambiente', DirectorioLocalAmbienteViewSet)

urlpatterns = [
    url(r'curso_etapa/(?P<etapa_id>.+)/$', CursoEtapaViewSet.as_view()),

]
