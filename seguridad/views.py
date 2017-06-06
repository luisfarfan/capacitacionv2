import urllib.request, json
from django.shortcuts import redirect
from django.views.generic import TemplateView, ListView
from reportes.models import Reportes
from django.conf import settings
from django.http import JsonResponse
from seguridad.models import RolCurso, RolCursoModulos
from locales_consecucion.models import Curso


def setSession(request):
    key = request.GET['key']
    seguridadurl = request.GET['urlbase']
    response = urllib.request.urlopen(
        '{}{}'.format(seguridadurl, '/services/menubyproyectosistema/cpvcapacitacion/?key={}'.format(key)))
    userData = urllib.request.urlopen(
        '{}{}'.format(seguridadurl, '/services/getAuthData?key={}'.format(key)))
    data = json.loads(response.read().decode('utf-8'))
    userDataDecode = json.loads(userData.read().decode('utf-8'))
    request.session['user_session'] = data
    request.session['user_data'] = userDataDecode
    request.session['seguridadurl'] = seguridadurl

    return redirect('/bienvenido/')


class RenderTemplate(TemplateView):
    user = None

    def get(self, request, *args, **kwargs):
        if self.user:
            return redirect('http://{}'.format(request.META['HTTP_HOST']))
        return super(RenderTemplate, self).get(request, *args, **kwargs)

    def get_template_names(self):
        try:
            print(self.request.session['user_session'])
            modulos = self.request.session['user_session']['routes']
            slug = 'modulos/{}'.format(self.kwargs.get('slug'))
            for modulo in modulos:
                if modulo['slug'] == slug:
                    self.request.session['modulo_id'] = modulo['id']
                    return modulo['template_html']
            return '404.html'
        except:
            return '404.html'

    def get_context_data(self, **kwargs):
        context = super(RenderTemplate, self).get_context_data(**kwargs)
        try:
            modulos = self.request.session['user_session']['routes']
            slug = 'modulos/{}'.format(self.kwargs.get('slug'))
            for modulo in modulos:
                if modulo['slug'] == slug:
                    context['breadcumbs'] = modulo['descripcion']
                    context['session_key'] = self.request.session.session_key
                    context['modeenv'] = renderENVDB()
                    context['modulo'] = modulo['codigo']
                self.user = True
            return context
        except:
            return context


class RenderReportes(TemplateView):
    def get_template_names(self):
        slug = int(self.kwargs.get('slug') or 0)
        self.request.session['modulo_id'] = 108
        try:
            if slug == 'main':
                template = 'main.html'
            else:
                template = Reportes.objects.get(id=slug).template_html
            return 'reportes/{}'.format(template)
        except:
            return 'reportes/reporte.html'

    def get_context_data(self, **kwargs):
        context = super(RenderReportes, self).get_context_data(**kwargs)
        slug = self.kwargs.get('slug')
        try:
            if slug == 'main':
                context['breadcumbs'] = 'Reportes'
                context['session_key'] = self.request.session.session_key
                context['modeenv'] = renderENVDB()
                context['reportes'] = Reportes.objects.all()
                context['selected'] = int(slug or 0)
            else:
                reporte = Reportes.objects.get(slug=slug)
                context['breadcumbs'] = reporte.nombre
                context['session_key'] = self.request.session.session_key
                context['modeenv'] = renderENVDB()
                context['reportes'] = Reportes.objects.all()
                context['selected'] = int(slug or 0)
            return context
        except:
            # return redirect('localhost:8001/reportes/main')
            context['reportes'] = Reportes.objects.all()
            context['selected'] = int(slug or 0)
            return context


def renderENVDB():
    if settings.ENV == 'LOCAL':
        return '<span class="label label-success">MODO DESARROLLO - SE PUEDE EDITAR!</span>'
    elif settings.ENV == 'PROD':
        return '<span class="label label-danger">MODO PRODUCCIÓN - NO SE PUEDE EDITAR!</span>'
    elif settings.ENV == 'SQLITE':
        return '<span class="label label-success">MODO DESARROLLO - SE PUEDE EDITAR!</span>'


def cargarModulos(request):
    modulos = ['reportes', 'reglocal', 'dist', 'asist', 'eval', 'result', 'localsin', 'evalsin', 'resulsin']
    roles = ['jefedepa', 'jefesubdepa', 'jefeprov', 'jefedist', 'jefezona', 'coordcapa', 'coordcurso', 'instnac',
             'jefesubprov', 'jefesubzon', 'jefeempesp', 'jefesecurb']
    cursos = Curso.objects.filter(etapa__in=[2, 3])
    for curso in cursos:
        for rol in roles:
            if RolCurso.objects.filter(rol=rol, curso_id=curso.id_curso).count() == 0:
                rolcurso = RolCurso(rol=rol, curso_id=curso.id_curso)
                rolcurso.save()

    rolescursos = RolCurso.objects.all()
    for rolcurso in rolescursos:
        for modulo in modulos:
            if RolCursoModulos.objects.filter(rolcurso_id=rolcurso, modulo=modulo).count() == 0:
                rolcursomodulo = RolCursoModulos(rolcurso_id=rolcurso.id, modulo=modulo)
                rolcursomodulo.save()

    return JsonResponse({'msg': 'generado todo'})


def cargarModulos2(request):
    # roles = ['coordcapa', 'coordcurso', 'instnac', 'jefesubprov', 'jefesubzon', 'jefeempesp', 'jefesecurb']
    modulos = ['reportes', 'reglocal', 'dist', 'asist', 'eval', 'result', 'localsin', 'evalsin', 'resulsin']
    roles = ['jefesecempesp']
    cursos = Curso.objects.filter(etapa__in=[3])
    for curso in cursos:
        for rol in roles:
            if RolCurso.objects.filter(rol=rol, curso_id=curso.id_curso).count() == 0:
                rolcurso = RolCurso(rol=rol, curso_id=curso.id_curso)
                rolcurso.save()

    rolescursos = RolCurso.objects.all()
    for rolcurso in rolescursos:
        for modulo in modulos:
            if RolCursoModulos.objects.filter(rolcurso_id=rolcurso, modulo=modulo).count() == 0:
                rolcursomodulo = RolCursoModulos(rolcurso_id=rolcurso.id, modulo=modulo)
                rolcursomodulo.save()

    return JsonResponse({'msg': 'generado todo'})


def visualizaRolCurso(request, rol, curso, modulo):
    try:
        visualiza = RolCursoModulos.objects.get(rolcurso__rol=rol, rolcurso__curso=curso, modulo=modulo).visualiza
    except RolCursoModulos.DoesNotExist:
        visualiza = 0

    return JsonResponse({'visualiza': visualiza})
