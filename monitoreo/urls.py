from .views import *
from django.conf.urls import url

urlpatterns = [
    url(r'resumennacional/(?P<curso>[0-9]+)/$', ResumenNacional.as_view()),
    url(r'resumennacional/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/$', ResumenNacional.as_view()),
    url(r'resumennacional/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/$', ResumenNacional.as_view()),
    url(r'resumennacional/(?P<curso>[0-9]+)/(?P<ccdd>[0-9]+)/(?P<ccpp>[0-9]+)/(?P<ccdi>[0-9]+)/$',
        ResumenNacional.as_view()),
]
