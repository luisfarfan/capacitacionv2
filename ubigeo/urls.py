from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^departamentos/$', DepartamentosList.as_view()),
    url(r'^provincias/(?P<ccdd>[0-9]+)/$', ProvinciasList.as_view()),
    url(r'^distritos/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$', DistritosList.as_view()),
    url(r'^zonas/(?P<ubigeo>[0-9]+)/$', ZonasList.as_view()),
]
