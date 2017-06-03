# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'izzsuvka)mnc)c_u53=o319(#(%jd)hs#^#ua1bawogi21b2@+'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

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

CORS_ORIGIN_ALLOW_ALL = True
# CORS_ORIGIN_WHITELIST = (
#     '192.168.200.123:8001',
#     'cpv.inei.gob.pe:5050',
#     'cpv.inei.gob.pe:85',
#     '172.16.2.205:8000',
#     'localhost:3000',
#     '192.168.200.123:3000',
# )
