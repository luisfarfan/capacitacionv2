from .utils import *


def recursive_menu(request):
    if request.is_secure():
        scheme = 'https://'
    else:
        scheme = 'http://'

    base_url = scheme + request.get_host()
    if 'user_session' in request.session:
        menu = request.session['user_session']['modulos']['CPV']['menu']
    else:
        menu = None
    modulo_id = 1
    if 'modulo_id' in request.session:
        modulo_id = request.session['modulo_id']

    context = {
        "menu": drawSidebar(menu, base_url, modulo_id),
    }

    return {'CLIENT_MENU': context}
