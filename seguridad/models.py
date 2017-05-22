from django.db import models
from locales_consecucion.models import Curso


class RolCursoModulosSeguridad(models.Model):
    rol = models.CharField(max_length=10)
    curso = models.ForeignKey(Curso)
    modulo = models.CharField(max_length=20)

    class Meta:
        managed = True
        db_table = 'ROLCURSOMODULOSSEGURIDAD'
