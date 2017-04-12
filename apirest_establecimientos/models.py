from django.db import models


# Create your models here.
class FenomenoMonitoreo(models.Model):
    COD_AMBITO = models.CharField(max_length=50, primary_key=True)
    TOTAL_MARCO = models.IntegerField()
    TOTAL_EMP = models.IntegerField()
    VIV_MARCO = models.IntegerField()
    EST_MARCO = models.IntegerField()
    VIV_EMP = models.IntegerField()
    EST_EMP = models.IntegerField()
    VIV_OCUP_PERSON_PRESENT = models.IntegerField()
    VIV_OCUP_PERSON_PRESENT_AFEC = models.IntegerField()
    VIV_OCUP_PERSON_PRESENT_NO_AFEC = models.IntegerField()
    VIV_OCUP_PERSON_PRESENT_DAMNIF = models.IntegerField()
    POBLACION = models.IntegerField()
    POBLACION_AFEC = models.IntegerField()
    POBLACION_NO_AFEC = models.IntegerField()
    POBLACION_DAMNIF = models.IntegerField()
    MUNICIPALIDAD = models.IntegerField()
    COMISARIA = models.IntegerField()
    INST_EDU = models.IntegerField()
    EST_SALUD = models.IntegerField()
    LO_COM = models.IntegerField()
    GOBERNACION = models.IntegerField()
    OTRO = models.IntegerField()
    EST_APTO_FUN = models.IntegerField()
    EST_NO_APTO = models.IntegerField()
    EST_COLAPSADO = models.IntegerField()
    EST_NO_EXIST = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'FENOMENO_MONITOREO'


class FenomenoMarcoDistrito(models.Model):
    UBIGEO = models.CharField(max_length=6, primary_key=True)
    CCDD = models.CharField(max_length=2, primary_key=True)
    DEPARTAMENTO = models.CharField(max_length=100, primary_key=True)
    CCPP = models.CharField(max_length=2, primary_key=True)
    PROVINCIA = models.CharField(max_length=100, primary_key=True)
    CCDI = models.CharField(max_length=2, primary_key=True)
    DISTRITO = models.CharField(max_length=100, primary_key=True)

    class Meta:
        managed = False
        db_table = 'FENOMENO_MARCO_DISTRITO'
