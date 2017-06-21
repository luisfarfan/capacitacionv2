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

class AulaInstructor(models.Model):
    local =  models.ForeignKey(Local)
    aula = models.IntegerField(null=True, blank=True)
    instructor = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'AULAINSTRUCTOR'


class Documentos(models.Model):
    curso = models.ForeignKey(Curso)
    nombre = models.CharField(max_length=100)
    tipodocumento = models.ForeignKey(TipoDocumento)
    formato = models.ForeignKey('Formatos')

    class Meta:
        managed = True
        db_table = 'DOCUMENTOS'


class TipoFormato(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'TIPO_FORMATO'


class Manual(models.Model):
    codigo = models.CharField(max_length=255, blank=True, null=True)
    nombre = models.CharField(max_length=100)
    curso = models.ForeignKey(Curso, null=True)
    formato = models.IntegerField( null=True)

    class Meta:
        managed = True
        db_table = 'MANUAL'


class Formatos(models.Model):
    # curso = models.ForeignKey(Curso)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    tipo_formato = models.ForeignKey('TipoPregunta', null=True)
    manual_id = models.ForeignKey(Manual, null=True)

    class Meta:
        managed = True
        db_table = 'FORMATOS'


class GrupoPreguntas(models.Model):
    titulo1 = models.CharField(max_length=100, blank=True, null=True)
    conjunto = models.CharField(max_length=100, blank=True, null=True)
    formato = models.ForeignKey(Formatos, null=True)
    tipo_titulo = models.IntegerField( null=True)

    class Meta:
        managed = True
        db_table = 'GRUPO_PREGUNTAS'


class Preguntas(models.Model):
    nombre = models.CharField(max_length=100)
    conjunto = models.IntegerField()
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


class RespuestaLocal(models.Model):
    local = models.ForeignKey(Local)
    instructor = models.IntegerField(null=True, blank=True)
    llave = models.IntegerField(null=True, blank=True)
    pregunta = models.IntegerField(null=True, blank=True)
    opcional = models.CharField(max_length=255, blank=True, null=True)
    opcionselected = models.ForeignKey(Opciones)
    respuesta_texto = models.CharField(max_length=255, blank=True, null=True)
    curso = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'RESPUESTALOCAL'

class RespuestaAula(models.Model):
    aula = models.ForeignKey(Local)
    local = models.IntegerField(null=True, blank=True)
    instructor = models.IntegerField(null=True, blank=True)
    llave = models.IntegerField(null=True, blank=True)
    pregunta = models.IntegerField(null=True, blank=True)
    opcionselected = models.ForeignKey(Opciones)
    respuesta_texto = models.CharField(max_length=255, blank=True, null=True)
    opcional = models.CharField(max_length=255, blank=True, null=True)
    curso = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'RESPUESTAAULA'

class RespuestaManuales(models.Model):
    aula = models.ForeignKey(Local)
    llave = models.IntegerField(null=True, blank=True)
    pregunta = models.IntegerField(null=True, blank=True)
    opcionselected = models.ForeignKey(Opciones)
    manual = models.ForeignKey(Manual)
    respuesta_texto = models.CharField(max_length=255, blank=True, null=True)
    opcional = models.CharField(max_length=255, blank=True, null=True)
    cantidad = models.CharField(max_length=255, blank=True, null=True)
    curso = models.IntegerField(null=True, blank=True)
    cantidaddocumentos = models.IntegerField(null=True, blank=True)
    cantidaddodefectuosos = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'RESPUESTAMANUALES'

class Capitulos(models.Model):
    nombre = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'CAPITULOS'

class CapitulosManual(models.Model):
    manual = models.ForeignKey(Manual)
    capitulo = models.ForeignKey(Capitulos)

    class Meta:
        managed = True
        db_table = 'CAPITULOSMANUAL'


class RespuestaDuranteManual(models.Model):
    llave = models.IntegerField(null=True, blank=True)
    manual = models.IntegerField(null=True, blank=True)
    curso = models.IntegerField(null=True, blank=True)
    instructor = models.IntegerField(null=True, blank=True)
    aula = models.IntegerField(null=True, blank=True)
    fecha = models.CharField(max_length=255, blank=True, null=True)
    pregunta = models.IntegerField(null=True, blank=True)
    respuesta1 = models.CharField(max_length=255, blank=True, null=True)
    respuesta2 = models.CharField(max_length=255, blank=True, null=True)
    respuesta3 = models.CharField(max_length=255, blank=True, null=True)
    respuesta4 = models.CharField(max_length=255, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'RESPUESTADURANTEMANUAL'


class RespuestaDuranteCapitulo(models.Model):
    llave = models.IntegerField(null=True, blank=True)
    manual = models.IntegerField(null=True, blank=True)
    capitulo = models.IntegerField(null=True, blank=True)
    curso = models.IntegerField(null=True, blank=True)
    instructor = models.IntegerField(null=True, blank=True)
    aula = models.IntegerField(null=True, blank=True)
    fecha = models.CharField(max_length=255, blank=True, null=True)
    pregunta = models.IntegerField(null=True, blank=True)
    respuesta1 = models.CharField(max_length=255, blank=True, null=True)
    respuesta2 = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'RESPUESTADURANTECAPITULO'

