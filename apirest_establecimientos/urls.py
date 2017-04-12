from django.conf.urls import url
from .views import Establecimientos, EstablecimientosDistritosZonas

urlpatterns = [
    url(r'establecimientos/$',
        Establecimientos.as_view()),
    url(r'establecimientos/(?P<ccdd>[0-9]+)/$',
        Establecimientos.as_view()),
    url(r'establecimientos/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$',
        Establecimientos.as_view()),
    url(r'establecimientos/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        Establecimientos.as_view()),
    url(r'establecimientos/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/(?P<zona>[0-9]+)/$',
        Establecimientos.as_view()),
    url(r'establecimientosDistritos/(?P<ubigeo>[0-9]+)/$',
        EstablecimientosDistritosZonas.as_view()),
    url(r'establecimientosDistritos/(?P<ubigeo>[0-9]+)/(?P<zona>[0-9]+)/$',
        EstablecimientosDistritosZonas.as_view()),
]
