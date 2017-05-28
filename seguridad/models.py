from django.db import models
from locales_consecucion.models import Curso
from django.contrib import admin


class RolCursoModulosSeguridad(models.Model):
    rol = models.CharField(max_length=10)
    curso = models.ForeignKey(Curso)
    modulo = models.CharField(max_length=20)

    class Meta:
        managed = True
        db_table = 'ROLCURSOMODULOSSEGURIDAD'


class RolCurso(models.Model):
    rol = models.CharField(max_length=20)
    curso = models.ForeignKey(Curso)

    class Meta:
        managed = True
        db_table = 'ROLCURSOS'

    def __str__(self):
        return '{} - {}'.format(self.rol, self.curso.nombre_curso)


@admin.register(RolCurso)
class RolCursoAdmin(admin.ModelAdmin):
    list_filter = ('rol', 'curso__etapa__nombre_etapa')
    ordering = ['-rol', ]


class RolCursoModulos(models.Model):
    rolcurso = models.ForeignKey(RolCurso)
    modulo = models.CharField(max_length=20)
    visualiza = models.IntegerField(default=0)

    class Meta:
        managed = True
        db_table = 'ROLCURSOS_MODULOS'

    def __str__(self):
        return '{} - {}'.format(self.rolcurso, self.modulo)


@admin.register(RolCursoModulos)
class RolCursoModulosAdmin(admin.ModelAdmin):
    list_filter = ('rolcurso__rol', 'rolcurso__curso__etapa__nombre_etapa', 'modulo')
    ordering = ('rolcurso__rol',)
