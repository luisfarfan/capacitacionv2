from .utils import *
from seguridad.models import RolCursoModulosSeguridad


def recursive_menu(request):
    if request.is_secure():
        scheme = 'https://'
    else:
        scheme = 'http://'
    base_url = scheme + request.get_host()
    modulos = []
    if 'user_session' in request.session:
        menu = request.session['user_session']['menuRecursive']
        rol = request.session['user_data']['user']['rol']['codigo']
        if 'curso' in request.GET:
            modulos = getModulosbyRol(rol, request.GET['curso'])

    else:
        menu = None
    modulo_id = 1
    if 'modulo_id' in request.session:
        modulo_id = request.session['modulo_id']

    context = {
        "menu": drawSidebar(menu, base_url, modulo_id, modulos, request),
    }

    return {'CLIENT_MENU': context}


def getModulosbyRol(rol, curso):
    return list(RolCursoModulosSeguridad.objects.filter(rol=rol, curso=curso).values_list('modulo', flat=True))
