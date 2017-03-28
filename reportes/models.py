from django.db import models


class Reportes(models.Model):
    nombre = models.CharField(max_length=255, blank=True, null=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        managed = True
        db_table = 'REPORTES'
