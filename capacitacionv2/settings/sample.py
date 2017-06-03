DATABASES = {
    # BASE DE DATOS PRINCIPAL PARA CAPACITACIÓN
    'default': {
        'ENGINE': 'sql_server.pyodbc',  # Driver de sql para python
        'NAME': 'xxxxxxx',  # Nombre de Base de Datos
        'USER': 'xxxxxx',  # Usuario de Base de datos
        'PASSWORD': 'xxxx',  # clave de Base de Datos
        'HOST': 'xxx.xx.xxx',  # HOST del servidor
        'OPTIONS': {
            'driver': 'ODBC Driver 11 for SQL Server',
            # Driver de SQL para Linux, si es Linux es :"ODBC Driver 11 for SQL Server", Windows es "SQL Server"
            'unicode_results': True
        },
    },
    # BASE DE DATOS DONDE SE OBTIENE LAS METAS DE CAPACITACION, Y CARGOS FUNCIONALES
    'consecucion': {
        'ENGINE': 'sql_server.pyodbc',  # Driver de sql para python
        'NAME': 'xxxxxxx',  # Nombre de Base de Datos
        'USER': 'xxxxxx',  # Usuario de Base de datos
        'PASSWORD': 'xxxx',  # clave de Base de Datos
        'HOST': 'xxx.xx.xxx',  # HOST del servidor
        'OPTIONS': {
            'driver': 'ODBC Driver 11 for SQL Server',
            'unicode_results': True
        },
    },
    # BASE DE DATOS DONDE SE OBTIENE ALGUNOS UBIGEOS,ZONAS,ETC.
    'segmentacion': {
        'ENGINE': 'sql_server.pyodbc',  # Driver de sql para python
        'NAME': 'xxxxxxx',  # Nombre de Base de Datos
        'USER': 'xxxxxx',  # Usuario de Base de datos
        'PASSWORD': 'xxxx',  # clave de Base de Datos
        'HOST': 'xxx.xx.xxx',  # HOST del servidor
        'OPTIONS': {
            'driver': 'ODBC Driver 11 for SQL Server',
            # Driver de SQL para Linux, si es Linux es :"ODBC Driver 11 for SQL Server", Windows es "SQL Server"
            'unicode_results': True
        },
    }
}
