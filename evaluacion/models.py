from django.db import models
from locales_consecucion.models import Curso


# Create your models here.
class Criterio(models.Model):
    id_criterio = models.AutoField(primary_key=True)
    nombre_criterio = models.CharField(max_length=100, blank=True, null=True)
    descripcion_criterio = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'CRITERIO'


class CursoCriterio(models.Model):
    id_cursocriterio = models.AutoField(primary_key=True)
    id_curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    id_criterio = models.ForeignKey('Criterio', on_delete=models.CASCADE)
    ponderacion = models.IntegerField()

    class Meta:
        managed = True
        unique_together = ('id_curso', 'id_criterio',)
        db_table = 'CURSO_CRITERIO'
