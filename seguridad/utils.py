def drawSidebar(menu, base_url, module_id):
    if menu is None:
        return ''
    html = ''
    html += """<li class="navigation-header"><span>Censo de Poblacion y Vivienda VIII</span>
                 <i class="icon-menu" title="Main pages"></i></li>"""
    html += recursiveMenu(menu, base_url, module_id)
    return html


def recursiveMenu(menu, base_url, module_id):
    html = ''
    css_class = ''
    for i in menu:
        if 'modulos_hijos' in i:
            if len(i['modulos_hijos']):
                if module_id == i['id']:
                    css_class = """class='active'"""
                else:
                    css_class = ''

                html += """<li {}><a href="#"><i class="{}"></i><span>{}</span></a><ul> """.format(css_class, i['icon'],
                                                                                                   i['descripcion'])
                for child in i['modulos_hijos']:
                    if 'id' in child:
                        if module_id == child['id']:
                            css_class = """class='active'"""
                        else:
                            css_class = ''

                        if len(child['modulos_hijos']):
                            html += """<li {}><a href="{}"><i class ="{}">
                                </i>{}</a><ul>""".format(css_class, base_url + '/' + child['slug'] + '/', child['icon'],
                                                         child['descripcion'])
                            html += recursiveMenu(child['modulos_hijos'], base_url, module_id)
                            html += """</ul>"""
                        else:
                            html += """<li {}><a href="{}"><i class ="{}">
                                                </i>{}</a>""".format(css_class, base_url + '/' + child['slug'] + '/',
                                                                     child['icon'],
                                                                     child['descripcion'])
                html += """</ul>"""
            else:
                html += """<li {}><a href="{}">
                    <i class="{}"></i><span>{}</span></a></li>""".format(css_class, base_url + '/' + i['slug'] + '/',
                                                                         i['icon'], i['descripcion'])
    return html
