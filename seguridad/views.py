import urllib.request, json
from django.shortcuts import redirect
from django.views.generic import TemplateView

URL_USERDATASESSION = 'http://localhost:8000/seguridad/getUserData/?key={}'


def setSession(request):
    key = request.GET['key']
    response = urllib.request.urlopen(URL_USERDATASESSION.format(key))
    data = json.loads(response.read().decode('utf-8'))
    request.session['user_session'] = data['data']
    if not request.session.session_key:
        request.session.save()

    return redirect('/capacitacion/asistencia/')

    # return JsonResponse(data, safe=False)


class RenderTemplate(TemplateView):
    def get_template_names(self):
        try:
            modulos = self.request.session['user_session']['modulos']['CPV']['modulos_individuales']
            slug = self.kwargs.get('slug')
            for modulo in modulos:
                if modulo['slug'] == slug:
                    return modulo['template_html']
            return '404.html'
        except:
            return '404.html'
