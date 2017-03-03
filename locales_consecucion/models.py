from django.db import models
from ubigeo.models import Ubigeo, Zona


# Create your models here.

class Etapa(models.Model):
    id_etapa = models.AutoField(primary_key=True)
    cod_etapa = models.CharField(max_length=3, blank=True, null=True)
    nombre_etapa = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ETAPA'


class Curso(models.Model):
    id_curso = models.AutoField(primary_key=True)
    cod_curso = models.CharField(max_length=3, blank=True, null=True)
    nombre_curso = models.CharField(max_length=100, blank=True, null=True)
    etapa = models.ForeignKey(Etapa)
    locales = models.ManyToManyField('Local', through='LocalCurso')
    # funcionarios = models.ManyToManyField('Funcionario', through='CursoFuncionario')
    criterios = models.ManyToManyField('Criterio', through='CursoCriterio')
    nota_minima = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'CURSO'


class Criterio(models.Model):
    id_criterio = models.AutoField(primary_key=True)
    nombre_criterio = models.CharField(max_length=100, blank=True, null=True)
    descripcion_criterio = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'CRITERIO'


class CursoCriterio(models.Model):
    cursocriterio = models.AutoField(primary_key=True)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    criterio = models.ForeignKey(Criterio, on_delete=models.CASCADE)
    ponderacion = models.IntegerField()

    class Meta:
        managed = True
        unique_together = ('curso', 'cursocriterio',)
        db_table = 'CURSO_CRITERIO'


class LocalCurso(models.Model):
    local = models.ForeignKey('Local')
    curso = models.ForeignKey(Curso)

    class Meta:
        managed = True
        unique_together = ('local', 'curso',)
        db_table = 'LOCAL_CURSO'


class Local(models.Model):
    id_local = models.AutoField(primary_key=True)
    ambientes = models.ManyToManyField('Ambiente', through='LocalAmbiente')
    ubigeo = models.ForeignKey(Ubigeo)
    nombre_local = models.CharField(max_length=300, blank=True, null=True)
    zona_ubicacion_local = models.ForeignKey(Zona, null=True, blank=True)
    tipo_via = models.CharField(max_length=300, blank=True, null=True)
    nombre_via = models.CharField(max_length=300, blank=True, null=True)
    referencia = models.CharField(max_length=300, blank=True, null=True)
    n_direccion = models.CharField(max_length=300, blank=True, null=True)
    km_direccion = models.CharField(max_length=300, blank=True, null=True)
    mz_direccion = models.CharField(max_length=300, blank=True, null=True)
    lote_direccion = models.CharField(max_length=300, blank=True, null=True)
    piso_direccion = models.CharField(max_length=300, blank=True, null=True)
    telefono_local_fijo = models.CharField(max_length=10, blank=True, null=True)
    telefono_local_celular = models.CharField(max_length=10, blank=True, null=True)
    fecha_inicio = models.CharField(max_length=100, blank=True, null=True)
    fecha_fin = models.CharField(max_length=100, blank=True, null=True)
    turno_uso_local = models.CharField(max_length=100, blank=True, null=True)
    capacidad_local_total = models.IntegerField(blank=True, null=True)
    capacidad_local_usar = models.IntegerField(blank=True, null=True)
    funcionario_nombre = models.CharField(max_length=100, blank=True, null=True)
    funcionario_email = models.CharField(max_length=100, blank=True, null=True)
    funcionario_cargo = models.CharField(max_length=100, blank=True, null=True)
    funcionario_celular = models.CharField(max_length=100, blank=True, null=True)
    responsable_nombre = models.CharField(max_length=100, blank=True, null=True)
    responsable_email = models.CharField(max_length=100, blank=True, null=True)
    responsable_telefono = models.CharField(max_length=100, blank=True, null=True)
    responsable_celular = models.CharField(max_length=100, blank=True, null=True)
    cantidad_total_aulas = models.IntegerField(blank=True, null=True)
    cantidad_disponible_aulas = models.IntegerField(blank=True, null=True)
    cantidad_usar_aulas = models.IntegerField(blank=True, null=True)
    cantidad_total_auditorios = models.IntegerField(blank=True, null=True)
    cantidad_disponible_auditorios = models.IntegerField(blank=True, null=True)
    cantidad_usar_auditorios = models.IntegerField(blank=True, null=True)
    cantidad_total_sala = models.IntegerField(blank=True, null=True)
    cantidad_disponible_sala = models.IntegerField(blank=True, null=True)
    cantidad_usar_sala = models.IntegerField(blank=True, null=True)
    cantidad_total_oficina = models.IntegerField(blank=True, null=True)
    cantidad_disponible_oficina = models.IntegerField(blank=True, null=True)
    cantidad_usar_oficina = models.IntegerField(blank=True, null=True)
    cantidad_total_otros = models.IntegerField(blank=True, null=True)
    cantidad_disponible_otros = models.IntegerField(blank=True, null=True)
    cantidad_usar_otros = models.IntegerField(blank=True, null=True)
    especifique_otros = models.CharField(max_length=100, blank=True, null=True)
    cantidad_total_computo = models.IntegerField(blank=True, null=True)
    cantidad_disponible_computo = models.IntegerField(blank=True, null=True)
    cantidad_usar_computo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'LOCAL'


class Ambiente(models.Model):
    id_ambiente = models.AutoField(primary_key=True)
    nombre_ambiente = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'AMBIENTE'


class LocalAmbiente(models.Model):
    id_localambiente = models.AutoField(primary_key=True)
    id_local = models.ForeignKey('Local', on_delete=models.CASCADE)
    id_ambiente = models.ForeignKey(Ambiente)
    numero = models.IntegerField(blank=True, null=True)
    n_piso = models.IntegerField(blank=True, null=True)
    capacidad = models.IntegerField(blank=True, null=True)

    # pea = models.ManyToManyField('PEA', through='PEA_AULA')

    class Meta:
        managed = True
        db_table = 'LOCAL_AMBIENTE'

    def save(self, *args, **kwargs):
        if self.id_localambiente is None:
            self.numero = LocalAmbiente.objects.filter(id_local=self.id_local, id_ambiente=self.id_ambiente).count()
            self.numero = self.numero + 1
        return super(LocalAmbiente, self).save(*args, **kwargs)
