from django.db import models
from django.contrib import admin


# Create your models here
class ObservacionCurso(models.Model):
    ccdd = models.CharField(max_length=2)
    ccpp = models.CharField(max_length=2)
    ccdi = models.CharField(max_length=2)
    ubigeo = models.CharField(max_length=6)
    curso = models.IntegerField()
    observacion = models.CharField(max_length=255)

    class Meta:
        managed = True
        db_table = 'OBSERVACION_CURSO'

    def __str__(self):
        return '{}{}{} - Codigo Curso: {}'.format(self.ccdd, self.ccpp, self.ccdi, self.curso)


@admin.register(ObservacionCurso)
class ObservacionCursoAdmin(admin.ModelAdmin):
    pass
