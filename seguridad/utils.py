def drawSidebar(menu, base_url, module_id, modulos_permitidos):
    if menu is None:
        return ''
    html = ''
    html += """<li class="navigation-header"><span></span>
                 <i class="icon-menu" title="Main pages"></i></li>"""
    html += recursiveMenu(menu, base_url, module_id, modulos_permitidos)
    return html


def recursiveMenu(menu, base_url, module_id, modulos_permitidos):
    html = ''
    css_class = ''
    if 'hijos' in menu:
        html += _recursiveMenu(menu['hijos'], base_url, module_id, modulos_permitidos)

    return html


def _recursiveMenu(hijos, base_url, module_id, modulos_permitidos):
    html = ''
    css_class = ''
    for menu in hijos:
        if 'hijos' in menu:
            if module_id == menu['id']:
                css_class = """class='active'"""
            else:
                css_class = ""

            html += """<li {}><a href="#"><i class="{}"></i><span>{}</span></a><ul> """.format(css_class,
                                                                                               menu['icon'],
                                                                                               menu['descripcion'])
            for child in menu['hijos']:
                if 'id' in child:
                    if module_id == child['id']:
                        css_class = """class='active'"""
                    else:
                        css_class = ''

                    if 'hijos' in child:
                        html += """<li {}><a href="{}"><i class ="{}">
                                    </i>{}</a><ul>""".format(css_class, base_url + '/' + child['slug'] + '/',
                                                             child['icon'],
                                                             child['descripcion'])
                        html += _recursiveMenu(child['hijos'], base_url, module_id)
                        html += """</ul>"""
                    else:
                        if child['codigo'] in modulos_permitidos:
                            html += """<li {}><a href="{}"><i class ="{}">
                                                    </i>{}</a>""".format(css_class,
                                                                         base_url + '/' + child['slug'] + '/',
                                                                         child['icon'],
                                                                         child['descripcion'])
                        else:
                            html += """<li {}><a href="{}"><i class ="{}">
                                                    </i>{}</a>""".format(css_class,
                                                                         base_url + '/' + child['slug'] + '/',
                                                                         child['icon'],
                                                                         child['descripcion'])
            html += """</ul>"""
        else:
            if module_id == menu['id']:
                css_class = """class='active'"""
            else:
                css_class = ""

            if menu['codigo'] in modulos_permitidos:
                html += """<li {}><a href="{}"> 
                        <i class="{}"></i><span>{}</span></a></li>""".format(css_class,
                                                                             base_url + '/' + menu['slug'] + '/',
                                                                             menu['icon'], menu['descripcion'])
            else:
                html += """<li {}><a href="{}">
                        <i class="{}"></i><span>{}</span></a></li>""".format(css_class,
                                                                             base_url + '/' + menu['slug'] + '/',
                                                                             menu['icon'], menu['descripcion'])
    return html
