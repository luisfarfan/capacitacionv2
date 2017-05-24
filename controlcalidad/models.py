from django.db import models
from locales_consecucion.models import Curso, LocalAmbiente, CargoFuncional, Local


# Create your models here.
class EtapasControlCalidad(models.Model):
    nombre = models.CharField(max_length=50)

    class Meta:
        managed = True
        db_table = 'ETAPAS_CONTROLCALIDAD'


class TipoDocumento(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'TIPO_DOCUMENTO'


class Documentos(models.Model):
    curso = models.ForeignKey(Curso)
    nombre = models.CharField(max_length=100)
    tipodocumento = models.ForeignKey(TipoDocumento)
    formato = models.ForeignKey('Formatos')

    class Meta:
        managed = True
        db_table = 'DOCUMENTOS'


class Formatos(models.Model):
    curso = models.ForeignKey(Curso)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'FORMATOS'


class GrupoPreguntas(models.Model):
    titulo1 = models.CharField(max_length=100, blank=True, null=True)
    titulo2 = models.CharField(max_length=100, blank=True, null=True)
    formato = models.ForeignKey(Formatos, null=True)

    class Meta:
        managed = True
        db_table = 'GRUPO_PREGUNTAS'


class Preguntas(models.Model):
    nombre = models.CharField(max_length=100)
    order = models.IntegerField()
    grupo = models.ForeignKey(GrupoPreguntas, null=True)
    tipo = models.ForeignKey('TipoPregunta', null=True)

    class Meta:
        managed = True
        db_table = 'PREGUNTAS'


class TipoPregunta(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'TIPO_PREGUNTA'


class Opciones(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'OPCIONES'


class LocalAmbienteRespuestas(models.Model):
    localambiente = models.ForeignKey(LocalAmbiente)
    opcion = models.ForeignKey(Opciones)
    respuesta = models.IntegerField()
    otros = models.CharField(max_length=255)

    class Meta:
        managed = True
        db_table = 'LOCALAMBIENTE_RESPUESTAS'


class UsuarioLocales(models.Model):
    local = models.ForeignKey(Local)
    usuario = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'USUARIO_LOCALES'
