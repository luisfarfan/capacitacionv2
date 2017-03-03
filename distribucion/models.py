from django.db import models
from locales_consecucion.models import Curso, Ubigeo, Zona, LocalAmbiente


# Create your models here.
class CargoFuncional(models.Model):
    id_cargofuncional = models.IntegerField(primary_key=True, max_length=3)
    nombre_funcionario = models.CharField(max_length=100, blank=True, null=True)
    id_curso = models.ForeignKey(Curso, on_delete=models.CASCADE)

    class Meta:
        managed = True
        db_table = 'CARGO_FUNCIONAL'


class CursoCargoFuncional(models.Model):
    id_cursocargofuncional = models.AutoField(primary_key=True)
    id_cargofuncional = models.ForeignKey(CargoFuncional)
    id_curso = models.ForeignKey(Curso)

    class Meta:
        managed = True
        db_table = 'CURSO_CARGO_FUNIONAL'


class Personal(models.Model):
    id_pea = models.AutoField(primary_key=True)
    id_per = models.CharField(max_length=8, blank=True, null=True)
    dni = models.CharField(max_length=8, blank=True, null=True)
    ape_paterno = models.CharField(max_length=100, blank=True, null=True)
    ape_materno = models.CharField(max_length=100, blank=True, null=True)
    nombre = models.CharField(max_length=100, blank=True, null=True)
    id_cargofuncional = models.ForeignKey(CargoFuncional)
    id_convocatoriacargo = models.CharField(max_length=4, blank=True, null=True)
    zona = models.ForeignKey(Zona)
    ubigeo = models.ForeignKey(Ubigeo)
    contingencia = models.IntegerField(blank=True, null=True)
    baja_estado = models.IntegerField(null=True, blank=True, default=0)
    alta_estado = models.IntegerField(null=True, blank=True, default=0)
    apto = models.IntegerField(null=True, blank=True, default=0)

    class Meta:
        managed = True
        db_table = 'PERSONAL'


class PersonalAula(models.Model):
    id_peaaula = models.AutoField(primary_key=True)
    id_pea = models.ForeignKey(Personal, on_delete=models.CASCADE)
    id_localambiente = models.ForeignKey(LocalAmbiente, on_delete=models.CASCADE)
    id_instructor = models.ForeignKey('Instructor', blank=True, null=True, on_delete=models.CASCADE)
    pea_fecha = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'PersonalAula'



