from django.db import models
from locales_consecucion.models import Curso


# Create your models here.

class RolCurso(models.Model):
    rol = models.IntegerField()
    curso = models.ForeignKey(Curso)

    class Meta:
        managed = True
        db_table = 'ROLCURSO'


class MenuRolModulo(models.Model):
    rolcurso = models.ForeignKey(RolCurso)
    modulo = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'ROLCURSOMODULO'
