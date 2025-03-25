# backend/settings/dev.py
from .base import *
import os

SECRET_KEY = 'django-insecure-77ch4pdv7*m++lo0)qsb$!z7+f3_g@8oeeq0x$d&oz6gw_4by^'

DEBUG = True

ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'auditapro_db'),
        'USER': os.getenv('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'postgres'),
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
