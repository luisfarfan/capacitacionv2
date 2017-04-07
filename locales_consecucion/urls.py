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
    # Locales Marco segun ubigeo
    url(r'directoriolocal_byambito/(?P<curso>[0-9]+)/$', DirectorioLocalbyUbigeo.as_view()),
    url(r'directoriolocal_byambito/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', DirectorioLocalbyUbigeo.as_view()),
    url(r'directoriolocal_byambito/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        DirectorioLocalbyUbigeo.as_view()),
    url(r'directoriolocal_byambito/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        DirectorioLocalbyUbigeo.as_view()),
    url(
        r'directoriolocal_byambito/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        DirectorioLocalbyUbigeo.as_view()),
    # Fin ubigeo locales marco segun ubigeo


    # Locales Marco segun ubigeo
    url(r'localcurso_filter/(?P<curso>[0-9]+)/$', LocalCursoFilter.as_view()),
    url(r'localcurso_filter/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', LocalCursoFilter.as_view()),
    url(r'localcurso_filter/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        LocalCursoFilter.as_view()),
    url(r'localcurso_filter/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        LocalCursoFilter.as_view()),
    url(
        r'localcurso_filter/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        LocalCursoFilter.as_view()),
    # Fin ubigeo locales marco segun ubigeo

    url(r'generar_ambientes/$', generar_ambientes),
    url(r'directoriolocal_ambientes/(?P<curso>[0-9]+)/(?P<local>[0-9]+)/$', DirectorioLocalCursoFilter.as_view()),
    url(r'directoriolocalambientes_detalle/(?P<localcurso>[0-9]+)/(?P<is_directorio>[0-9]+)/$',
        DirectorioLocalAmbienteFilterViewSet.as_view()),
    url(r'directorioSeleccionado/(?P<id_directoriolocal>[0-9]+)/(?P<id_curso>[0-9]+)/$', directorioSeleccionado),

    # Agregar directorio a locales
    url(r'agregarDirectorioCurso/$', agregarDirectorioCurso),
    url(r'agregarPeatoNotaFinalSinInternet/$', agregarPeatoNotaFinalSinInternet),
    url(r'llenarDBGIS/$', llenarDBGIS),
    url(r'calcularTotalAulas/$', calcularTotalAulas),
]
