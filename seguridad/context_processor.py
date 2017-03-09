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

    context = {
        "menu": drawSidebar(menu, base_url, 1),
    }

    return {'CLIENT_MENU': context}
