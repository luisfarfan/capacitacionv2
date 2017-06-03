from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'izzsuvka)mnc)c_u53=o319(#(%jd)hs#^#ua1bawogi21b2@+'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    },
    'consecucion': {
        'ENGINE': 'sql_server.pyodbc',
        'NAME': 'INEI_BDRRHH_CONSECUCION_CENSO',
        'USER': 'us_inei_bdrrhh_consecucion',
        'PASSWORD': 'nU6&beTRi',
        'HOST': '192.168.203.160',
        'OPTIONS': {
            'driver': 'ODBC Driver 11 for SQL Server',
            'unicode_results': True
        },
    },
    'segmentacion': {
        'ENGINE': 'sql_server.pyodbc',
        'NAME': 'CPV_SEGMENTACION',
        'USER': 'us_segmentacion_web',
        'PASSWORD': 'u$s3g*mentaWeB',
        'HOST': '172.18.1.41',
        'OPTIONS': {
            'driver': 'ODBC Driver 11 for SQL Server',
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
