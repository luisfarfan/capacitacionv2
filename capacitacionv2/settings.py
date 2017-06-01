"""
Django settings for capacitacionv2 project.

Generated by 'django-admin startproject' using Django 1.10.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""
import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ENV = 'EMPADRONAMIENTO_LINUX'
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'izzsuvka)mnc)c_u53=o319(#(%jd)hs#^#ua1bawogi21b2@+'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'pandas',
    'rest_framework',
    'asistencia',
    'locales_consecucion',
    'consecucion_pases',
    'evaluacion',
    'ubigeo',
    'distribucion',
    'seguridad',
    'reportes',
    'monitoreo',
    'apirest_establecimientos',
    'controlcalidad'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'capacitacionv2.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'seguridad.context_processor.recursive_menu'
            ],
        },
    },
]

WSGI_APPLICATION = 'capacitacionv2.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

"""
Variables de entorno
"""
_DATABASECONF = {}
if ENV == 'LOCAL':
    _DATABASECONF = {
        'default': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV_CAPACITACION_PRUEBA',
            'USER': 'us_capacitacion_web',
            'PASSWORD': 'cap5wegU$re',
            'HOST': '172.18.1.41',
            'OPTIONS': {
                'driver': 'SQL Server',
                'unicode_results': True
            },
        },
        'consecucion': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'INEI_BDRRHH_CONSECUCION_CENSO',
            'USER': 'us_inei_bdrrhh_consecucion',
            'PASSWORD': 'nU6&beTRi',
            'HOST': '192.168.203.160',
            'OPTIONS': {
                'driver': 'SQL Server',
                'unicode_results': True
            },
        },
        'SMS': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'INEI_BDRRHH_CONSECUCION',
            'USER': 'rvila',
            'PASSWORD': 'inei1202',
            'HOST': '192.168.200.250',
            'OPTIONS': {
                'driver': 'SQL Server',
                'unicode_results': True
            },
        },
        'arcgis': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV_MONITOREO_GIS',
            'USER': 'us_cpv2017_monitoreo',
            'PASSWORD': 'brEStarABr2c*CrE',
            'HOST': '192.168.202.84',
            'OPTIONS': {
                'driver': 'SQL Server',
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
                'driver': 'SQL Server',
                'unicode_results': True
            },
        }
    }
elif ENV == 'DESARROLLO':
    _DATABASECONF = {
        'default': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV_CAPACITACION_PRUEBA',
            'USER': 'us_capacitacion_web',
            'PASSWORD': 'cap5wegU$re',
            'HOST': '172.18.1.41',
            'OPTIONS': {
                'driver': 'ODBC Driver 11 for SQL Server',
                'unicode_results': True
            },
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
        'arcgis': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV_MONITOREO_GIS',
            'USER': 'us_cpv2017_monitoreo',
            'PASSWORD': 'brEStarABr2c*CrE',
            'HOST': '192.168.202.84',
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
elif ENV == 'SQLITE':
    _DATABASECONF = {
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
                'driver': 'SQL Server',
                'unicode_results': True
            },
        },
    }
elif ENV == 'EMPADRONAMIENTO':
    _DATABASECONF = {
        'default': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV2017_CAPACITACION',
            'USER': 'us_capacitacion_web',
            'PASSWORD': 'cap5wegU$re',
            'HOST': '172.18.1.41',
            'OPTIONS': {
                'driver': 'SQL Server',
                'unicode_results': True
            },
        },
        'consecucion': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'INEI_BDRRHH_CONSECUCION_CENSO',
            'USER': 'us_inei_bdrrhh_consecucion',
            'PASSWORD': 'nU6&beTRi',
            'HOST': '192.168.203.160',
            'OPTIONS': {
                'driver': 'SQL Server',
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
                'driver': 'SQL Server',
                'unicode_results': True
            },
        }
    }
elif ENV == 'EMPADRONAMIENTO_LINUX':
    _DATABASECONF = {
        'default': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': 'CPV2017_CAPACITACION',
            'USER': 'us_capacitacion_web',
            'PASSWORD': 'cap5wegU$re',
            'HOST': '172.18.1.41',
            'OPTIONS': {
                'driver': 'ODBC Driver 11 for SQL Server',
                'unicode_results': True
            },
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
DATABASES = _DATABASECONF

# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')
]

STATIC_URL = '/static/'
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'CACHE_TABLE',
    }
}
SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'

CORS_ORIGIN_ALLOW_ALL = True
# CORS_ORIGIN_WHITELIST = (
#     '192.168.200.123:8001',
#     'cpv.inei.gob.pe:5050',
#     'cpv.inei.gob.pe:85',
#     '172.16.2.205:8000',
#     'localhost:3000',
#     '192.168.200.123:3000',
# )
