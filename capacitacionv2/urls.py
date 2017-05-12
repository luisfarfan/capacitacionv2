"""capacitacionv2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
1. Add an import:  from my_app import views
2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
1. Add an import:  from other_app.views import Home
2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
1. Import the include() function: from django.conf.urls import url, include
2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView
from locales_consecucion.urls import *
from distribucion.urls import routerDistribucion
from asistencia.urls import routerAsistencia
from evaluacion.urls import routerEvaluacion
from seguridad.views import *
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^bienvenido/$', TemplateView.as_view(template_name="home.html")),
    url(r'^admin/', admin.site.urls),
    url(r'reporte/(?P<slug>.+)/$', ensure_csrf_cookie(RenderReportes.as_view())),
    url(r'modulos/(?P<slug>.+)/$', ensure_csrf_cookie(RenderTemplate.as_view())),
    url(r'^locales/', include(router.urls)),
    url(r'^locales/', include('locales_consecucion.urls')),
    url(r'^distribucion/', include(routerDistribucion.urls)),
    url(r'^distribucion/', include('distribucion.urls')),
    url(r'^asistencia/', include(routerAsistencia.urls)),
    url(r'^asistencia/', include('asistencia.urls')),
    url(r'^evaluacion/', include(routerEvaluacion.urls)),
    url(r'^evaluacion/', include('evaluacion.urls')),
    url(r'^reportes/', include('reportes.urls')),
    url(r'^ubigeo/', include('ubigeo.urls')),
    url('^setSession/$', setSession),
    url('^setSessionPrueba/$', setSessionPrueba),
    url(r'^monitoreo/', include('monitoreo.urls')),
    url(r'^apirest_establecimientos/', include('apirest_establecimientos.urls')),

]
