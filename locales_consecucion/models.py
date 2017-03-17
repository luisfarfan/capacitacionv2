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
    nombre_curso = models.CharField(max_length=255, blank=True, null=True)
    etapa = models.ForeignKey(Etapa)
    locales = models.ManyToManyField('Local', through='LocalCurso')
    directoriolocales = models.ManyToManyField('DirectorioLocal', through='DirectorioLocalCurso')
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
    local = models.ForeignKey('Local', on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso)
    ambientes = models.ManyToManyField('Ambiente', through='LocalAmbiente')
    zonas = models.ManyToManyField(Zona, through='LocalZonas')

    class Meta:
        managed = True
        unique_together = ('local', 'curso',)
        db_table = 'LOCAL_CURSO'


class LocalZonas(models.Model):
    localcurso = models.ForeignKey(LocalCurso)
    zona = models.ForeignKey(Zona)

    class Meta:
        managed = True
        unique_together = ('localcurso', 'zona',)
        db_table = 'LOCALZONAS'


class DirectorioLocalCurso(models.Model):
    local = models.ForeignKey('DirectorioLocal')
    curso = models.ForeignKey(Curso)
    ambientes = models.ManyToManyField('Ambiente', through='DirectorioLocalAmbiente')

    class Meta:
        managed = True
        unique_together = ('local', 'curso',)
        db_table = 'DIRECTORIOLOCAL_CURSO'


class Local(models.Model):
    id_local = models.AutoField(primary_key=True)
    ubigeo = models.ForeignKey(Ubigeo)
    nombre_local = models.CharField(max_length=300, blank=True, null=True)
    zona_ubicacion_local = models.CharField(max_length=5, blank=True, null=True, db_column='zona_ubicacion_local')
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
    id_directoriolocal = models.ForeignKey('DirectorioLocal', blank=True, null=True)

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
    localcurso = models.ForeignKey('LocalCurso', on_delete=models.CASCADE, null=True)
    id_ambiente = models.ForeignKey(Ambiente)
    numero = models.IntegerField(blank=True, null=True)
    n_piso = models.IntegerField(blank=True, null=True)
    capacidad = models.IntegerField(blank=True, null=True)
    id_instructor = models.IntegerField(null=True, blank=True)
    pea = models.ManyToManyField('Personal', through='PersonalAula')

    class Meta:
        managed = True
        db_table = 'LOCAL_AMBIENTE'

    def save(self, *args, **kwargs):
        if self.id_localambiente is None:
            self.numero = LocalAmbiente.objects.filter(localcurso_id=self.localcurso_id,
                                                       id_ambiente=self.id_ambiente).count()
            self.numero = self.numero + 1
        return super(LocalAmbiente, self).save(*args, **kwargs)


class DirectorioLocal(models.Model):
    id_local = models.AutoField(primary_key=True)
    ubigeo = models.ForeignKey(Ubigeo)
    nombre_local = models.CharField(max_length=300, blank=True, null=True)
    zona_ubicacion_local = models.CharField(max_length=5, blank=True, null=True, db_column='zona_ubicacion_local')
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
        db_table = 'DIRECTORIOLOCAL'


class DirectorioLocalAmbiente(models.Model):
    id_localambiente = models.AutoField(primary_key=True)
    localcurso = models.ForeignKey('DirectorioLocalCurso', on_delete=models.CASCADE, null=True)
    id_ambiente = models.ForeignKey(Ambiente)
    numero = models.IntegerField(blank=True, null=True)
    n_piso = models.IntegerField(blank=True, null=True)
    capacidad = models.IntegerField(blank=True, null=True)

    # pea = models.ManyToManyField('PEA', through='PEA_AULA')

    class Meta:
        managed = True
        db_table = 'DIRECTORIOLOCAL_AMBIENTE'

    def save(self, *args, **kwargs):
        if self.id_localambiente is None:
            self.numero = DirectorioLocalAmbiente.objects.filter(localcurso_id=self.localcurso_id,
                                                                 id_ambiente=self.id_ambiente).count()
            self.numero = self.numero + 1
        return super(DirectorioLocalAmbiente, self).save(*args, **kwargs)


class CargoFuncional(models.Model):
    id_cargofuncional = models.IntegerField(primary_key=True)
    nombre_funcionario = models.CharField(max_length=100, blank=True, null=True)

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
    zona = models.CharField(max_length=5, blank=True, null=True)
    ubigeo = models.ForeignKey(Ubigeo)
    contingencia = models.IntegerField(blank=True, null=True)
    baja_estado = models.IntegerField(null=True, blank=True, default=0)
    alta_estado = models.IntegerField(null=True, blank=True, default=0)
    id_pea_reemplazo = models.ForeignKey('Personal', null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'PERSONAL'


class PersonalAula(models.Model):
    id_peaaula = models.AutoField(primary_key=True)
    id_pea = models.ForeignKey(Personal, on_delete=models.CASCADE)
    id_localambiente = models.ForeignKey('LocalAmbiente', on_delete=models.CASCADE)

    # pea_fecha = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'PersonalAula'


class PersonalAulaAsistencia(models.Model):
    peaaula = models.ForeignKey(PersonalAula, related_name='personalaula')
    turno_manana = models.IntegerField(null=True, blank=True)
    turno_tarde = models.IntegerField(null=True, blank=True)
    fecha = models.CharField(max_length=50)

    class Meta:
        managed = True
        db_table = 'PersonalAulaAsistencia'


class PersonalCursoCriterio(models.Model):
    peaaula = models.ForeignKey(PersonalAula, related_name='personalaula_notas')
    cursocriterio = models.ForeignKey(CursoCriterio, null=True, blank=True)
    nota = models.FloatField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'PeaCursoCriterio'
