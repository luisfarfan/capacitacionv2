from django.db import models
from locales_consecucion.models import Personal, TipoResultadosCapacitacion


class MetaSeleccion(models.Model):
    ccdd = models.CharField(max_length=2)
    ccpp = models.CharField(max_length=2)
    ccdi = models.CharField(max_length=2)
    ubigeo = models.CharField(max_length=6)
    zona = models.CharField(max_length=5, null=True, blank=True)
    id_convocatoriacargo = models.IntegerField()
    id_cargofuncional = models.IntegerField()
    meta = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'METASELECCION'


class Ficha177(models.Model):
    id_per = models.IntegerField(primary_key=True)
    id_convocatoriacargo = models.IntegerField()
    capacita = models.IntegerField()
    notacap = models.FloatField()
    seleccionado = models.IntegerField()
    sw_titu = models.IntegerField()
    bandaprob = models.IntegerField()
    zona_i = models.CharField(max_length=5)
    seccion_i = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'ficha_177'
