from django.db import models


class MetaSeleccion(models.Model):
    ccdd = models.CharField(max_length=2)
    ccpp = models.CharField(max_length=2)
    ccdi = models.CharField(max_length=2)
    ubigeo = models.CharField(max_length=6)
    id_convocatoriacargo = models.IntegerField()
    id_cargofuncional = models.IntegerField()
    meta = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'meta_seleccion'
