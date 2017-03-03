from django.db import models


# Create your models here.
class Ubigeo(models.Model):
    ubigeo = models.CharField(primary_key=True, max_length=6)
    ccdd = models.CharField(max_length=2, blank=True, null=True)
    ccpp = models.CharField(max_length=2, blank=True, null=True)
    ccdi = models.CharField(max_length=2, blank=True, null=True)
    departamento = models.CharField(max_length=100, blank=True, null=True)
    provincia = models.CharField(max_length=100, blank=True, null=True)
    distrito = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'UBIGEO'


class Zona(models.Model):
    ID = models.IntegerField(primary_key=True)
    UBIGEO = models.CharField(max_length=6)
    CODCCPP = models.CharField(max_length=4)
    ZONA = models.CharField(max_length=5)
    LLAVE_CCPP = models.CharField(max_length=10)
    LLAVE_ZONA = models.CharField(max_length=15)
    ETIQ_ZONA = models.CharField(max_length=5)

    class Meta:
        managed = True
        db_table = 'ZONA'
