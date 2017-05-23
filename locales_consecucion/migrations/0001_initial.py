# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-22 18:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ubigeo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GISLimiteDep',
            fields=[
                ('CCDD', models.CharField(max_length=2, primary_key=True, serialize=False)),
                ('CAPACITACION_CURSO1', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO2', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO3', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO4', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO5', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO6', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO7', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO8', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO9', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO10', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO11', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO12', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO14', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO15', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO16', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO17', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'sde].[CPV_SEGMENTACION_DBO_TB_LIMITE_DEP',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='GISLimiteDis',
            fields=[
                ('CCDD', models.CharField(max_length=2)),
                ('CCPP', models.CharField(max_length=2)),
                ('CCDI', models.CharField(max_length=2)),
                ('UBIGEO', models.CharField(max_length=6, primary_key=True, serialize=False)),
                ('CAPACITACION_CURSO1', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO2', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO3', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO4', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO5', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO6', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO7', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO8', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO9', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO10', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO11', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO12', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO14', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO15', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO16', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO17', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'sde].[CPV_SEGMENTACION_DBO_TB_LIMITE_DIS',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='GISLimiteProv',
            fields=[
                ('OBJECTID', models.IntegerField(primary_key=True, serialize=False)),
                ('CCDD', models.CharField(max_length=2)),
                ('CCPP', models.CharField(max_length=2)),
                ('CAPACITACION_CURSO1', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO2', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO3', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO4', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO5', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO6', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO7', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO8', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO9', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO10', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO11', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO12', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO14', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO15', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO16', models.IntegerField(blank=True, null=True)),
                ('CAPACITACION_CURSO17', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'sde].[CPV_SEGMENTACION_DBO_TB_LIMITE_PRO',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Ambiente',
            fields=[
                ('id_ambiente', models.AutoField(primary_key=True, serialize=False)),
                ('nombre_ambiente', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'AMBIENTE',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='CargoFuncional',
            fields=[
                ('id_cargofuncional', models.IntegerField(primary_key=True, serialize=False)),
                ('nombre_funcionario', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'CARGO_FUNCIONAL',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Criterio',
            fields=[
                ('id_criterio', models.AutoField(primary_key=True, serialize=False)),
                ('nombre_criterio', models.CharField(blank=True, max_length=100, null=True)),
                ('descripcion_criterio', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'CRITERIO',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Curso',
            fields=[
                ('id_curso', models.AutoField(primary_key=True, serialize=False)),
                ('cod_curso', models.CharField(blank=True, max_length=3, null=True)),
                ('nombre_curso', models.CharField(blank=True, max_length=255, null=True)),
                ('nota_minima', models.IntegerField(blank=True, null=True)),
                ('fecha_inicio', models.CharField(blank=True, max_length=255, null=True)),
                ('fecha_fin', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'db_table': 'CURSO',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='CursoCargoFuncional',
            fields=[
                ('id_cursocargofuncional', models.AutoField(primary_key=True, serialize=False)),
                ('id_cargofuncional', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.CargoFuncional')),
                ('id_curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Curso')),
            ],
            options={
                'db_table': 'CURSO_CARGO_FUNIONAL',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='CursoCriterio',
            fields=[
                ('cursocriterio', models.AutoField(primary_key=True, serialize=False)),
                ('ponderacion', models.IntegerField()),
                ('criterio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Criterio')),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Curso')),
            ],
            options={
                'db_table': 'CURSO_CRITERIO',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='DirectorioLocal',
            fields=[
                ('id_local', models.AutoField(primary_key=True, serialize=False)),
                ('nombre_local', models.CharField(blank=True, max_length=300, null=True)),
                ('zona_ubicacion_local', models.CharField(blank=True, db_column='zona_ubicacion_local', max_length=5, null=True)),
                ('tipo_via', models.CharField(blank=True, max_length=300, null=True)),
                ('nombre_via', models.CharField(blank=True, max_length=300, null=True)),
                ('referencia', models.CharField(blank=True, max_length=300, null=True)),
                ('n_direccion', models.CharField(blank=True, max_length=300, null=True)),
                ('km_direccion', models.CharField(blank=True, max_length=300, null=True)),
                ('mz_direccion', models.CharField(blank=True, max_length=300, null=True)),
                ('lote_direccion', models.CharField(blank=True, max_length=300, null=True)),
                ('piso_direccion', models.CharField(blank=True, max_length=300, null=True)),
                ('telefono_local_fijo', models.CharField(blank=True, max_length=10, null=True)),
                ('telefono_local_celular', models.CharField(blank=True, max_length=10, null=True)),
                ('fecha_inicio', models.CharField(blank=True, max_length=100, null=True)),
                ('fecha_fin', models.CharField(blank=True, max_length=100, null=True)),
                ('turno_uso_local', models.CharField(blank=True, max_length=100, null=True)),
                ('capacidad_local_total', models.IntegerField(blank=True, null=True)),
                ('capacidad_local_usar', models.IntegerField(blank=True, null=True)),
                ('funcionario_nombre', models.CharField(blank=True, max_length=100, null=True)),
                ('funcionario_email', models.CharField(blank=True, max_length=100, null=True)),
                ('funcionario_cargo', models.CharField(blank=True, max_length=100, null=True)),
                ('funcionario_celular', models.CharField(blank=True, max_length=100, null=True)),
                ('responsable_nombre', models.CharField(blank=True, max_length=100, null=True)),
                ('responsable_email', models.CharField(blank=True, max_length=100, null=True)),
                ('responsable_telefono', models.CharField(blank=True, max_length=100, null=True)),
                ('responsable_celular', models.CharField(blank=True, max_length=100, null=True)),
                ('cantidad_total_aulas', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_aulas', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_aulas', models.IntegerField(blank=True, null=True)),
                ('cantidad_total_auditorios', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_auditorios', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_auditorios', models.IntegerField(blank=True, null=True)),
                ('cantidad_total_sala', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_sala', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_sala', models.IntegerField(blank=True, null=True)),
                ('cantidad_total_oficina', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_oficina', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_oficina', models.IntegerField(blank=True, null=True)),
                ('cantidad_total_otros', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_otros', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_otros', models.IntegerField(blank=True, null=True)),
                ('especifique_otros', models.CharField(blank=True, max_length=100, null=True)),
                ('cantidad_total_computo', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_computo', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_computo', models.IntegerField(blank=True, null=True)),
                ('total_aulas', models.IntegerField(blank=True, null=True)),
                ('total_disponibles', models.IntegerField(blank=True, default=0, null=True)),
                ('ubigeo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ubigeo.Ubigeo')),
            ],
            options={
                'db_table': 'DIRECTORIOLOCAL',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='DirectorioLocalAmbiente',
            fields=[
                ('id_localambiente', models.AutoField(primary_key=True, serialize=False)),
                ('numero', models.IntegerField(blank=True, null=True)),
                ('n_piso', models.IntegerField(blank=True, null=True)),
                ('capacidad', models.IntegerField(blank=True, null=True)),
                ('id_ambiente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Ambiente')),
            ],
            options={
                'db_table': 'DIRECTORIOLOCAL_AMBIENTE',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='DirectorioLocalCurso',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ambientes', models.ManyToManyField(through='locales_consecucion.DirectorioLocalAmbiente', to='locales_consecucion.Ambiente')),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Curso')),
                ('local', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.DirectorioLocal')),
            ],
            options={
                'db_table': 'DIRECTORIOLOCAL_CURSO',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Etapa',
            fields=[
                ('id_etapa', models.AutoField(primary_key=True, serialize=False)),
                ('cod_etapa', models.CharField(blank=True, max_length=3, null=True)),
                ('nombre_etapa', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'ETAPA',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Instituciones',
            fields=[
                ('ID_INSTITUCION', models.IntegerField(primary_key=True, serialize=False)),
                ('DESC_INSTITUCION', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'MAE_INSTITUCION',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Local',
            fields=[
                ('id_local', models.AutoField(primary_key=True, serialize=False)),
                ('nombre_local', models.CharField(blank=True, max_length=300, null=True)),
                ('zona_ubicacion_local', models.CharField(blank=True, db_column='zona_ubicacion_local', max_length=5, null=True)),
                ('tipo_via', models.CharField(blank=True, max_length=300, null=True)),
                ('nombre_via', models.CharField(blank=True, max_length=300, null=True)),
                ('referencia', models.CharField(blank=True, max_length=300, null=True)),
                ('n_direccion', models.CharField(blank=True, max_length=300, null=True)),
                ('km_direccion', models.CharField(blank=True, max_length=300, null=True)),
                ('mz_direccion', models.CharField(blank=True, max_length=300, null=True)),
                ('lote_direccion', models.CharField(blank=True, max_length=300, null=True)),
                ('piso_direccion', models.CharField(blank=True, max_length=300, null=True)),
                ('telefono_local_fijo', models.CharField(blank=True, max_length=10, null=True)),
                ('telefono_local_celular', models.CharField(blank=True, max_length=10, null=True)),
                ('fecha_inicio', models.CharField(blank=True, max_length=100, null=True)),
                ('fecha_fin', models.CharField(blank=True, max_length=100, null=True)),
                ('turno_uso_local', models.CharField(blank=True, max_length=100, null=True)),
                ('capacidad_local_total', models.IntegerField(blank=True, null=True)),
                ('capacidad_local_usar', models.IntegerField(blank=True, null=True)),
                ('funcionario_nombre', models.CharField(blank=True, max_length=100, null=True)),
                ('funcionario_email', models.CharField(blank=True, max_length=100, null=True)),
                ('funcionario_cargo', models.CharField(blank=True, max_length=100, null=True)),
                ('funcionario_celular', models.CharField(blank=True, max_length=100, null=True)),
                ('responsable_nombre', models.CharField(blank=True, max_length=100, null=True)),
                ('responsable_email', models.CharField(blank=True, max_length=100, null=True)),
                ('responsable_telefono', models.CharField(blank=True, max_length=100, null=True)),
                ('responsable_celular', models.CharField(blank=True, max_length=100, null=True)),
                ('cantidad_total_aulas', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_aulas', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_aulas', models.IntegerField(blank=True, null=True)),
                ('cantidad_total_auditorios', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_auditorios', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_auditorios', models.IntegerField(blank=True, null=True)),
                ('cantidad_total_sala', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_sala', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_sala', models.IntegerField(blank=True, null=True)),
                ('cantidad_total_oficina', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_oficina', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_oficina', models.IntegerField(blank=True, null=True)),
                ('cantidad_total_otros', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_otros', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_otros', models.IntegerField(blank=True, null=True)),
                ('especifique_otros', models.CharField(blank=True, max_length=100, null=True)),
                ('cantidad_total_computo', models.IntegerField(blank=True, null=True)),
                ('cantidad_disponible_computo', models.IntegerField(blank=True, null=True)),
                ('cantidad_usar_computo', models.IntegerField(blank=True, null=True)),
                ('total_aulas', models.IntegerField(blank=True, null=True)),
                ('usar', models.IntegerField(default=0)),
                ('total_disponibles', models.IntegerField(blank=True, default=0, null=True)),
                ('id_directoriolocal', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.DirectorioLocal')),
                ('ubigeo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ubigeo.Ubigeo')),
            ],
            options={
                'db_table': 'LOCAL',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='LocalAmbiente',
            fields=[
                ('id_localambiente', models.AutoField(primary_key=True, serialize=False)),
                ('numero', models.IntegerField(blank=True, null=True)),
                ('n_piso', models.IntegerField(blank=True, null=True)),
                ('capacidad', models.IntegerField(blank=True, null=True)),
                ('id_instructor', models.IntegerField(blank=True, null=True)),
                ('id_ambiente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Ambiente')),
            ],
            options={
                'db_table': 'LOCAL_AMBIENTE',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='LocalAmbito',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ccdd', models.CharField(blank=True, max_length=2, null=True)),
                ('ccpp', models.CharField(blank=True, max_length=2, null=True)),
                ('ccdi', models.CharField(blank=True, max_length=2, null=True)),
                ('zona', models.CharField(blank=True, max_length=5, null=True)),
            ],
            options={
                'db_table': 'LocalAmbito',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='LocalCurso',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ambientes', models.ManyToManyField(through='locales_consecucion.LocalAmbiente', to='locales_consecucion.Ambiente')),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Curso')),
                ('local', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Local')),
            ],
            options={
                'db_table': 'LOCAL_CURSO',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='MetaAula',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ccdd', models.CharField(max_length=2)),
                ('ccpp', models.CharField(max_length=2)),
                ('ccdi', models.CharField(max_length=2)),
                ('ubigeo', models.CharField(max_length=6)),
                ('curso', models.IntegerField()),
                ('meta', models.IntegerField(null=True)),
            ],
            options={
                'db_table': 'META_AULA',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='MetaCapacitacionPersonal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ccdd', models.CharField(max_length=2)),
                ('ccpp', models.CharField(max_length=2)),
                ('ccdi', models.CharField(max_length=2)),
                ('ubigeo', models.CharField(max_length=6)),
                ('zona', models.CharField(blank=True, max_length=6, null=True)),
                ('id_cargofuncional', models.IntegerField()),
                ('meta_campo', models.IntegerField()),
                ('meta_capacitacion', models.IntegerField()),
                ('inscritos', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'META_CAPACITACION_PERSONAL',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='NivelGrado',
            fields=[
                ('nivel_grado_id', models.IntegerField(primary_key=True, serialize=False)),
                ('descripcion', models.CharField(max_length=255)),
                ('nivel_id', models.IntegerField()),
                ('grado_id', models.IntegerField()),
            ],
            options={
                'db_table': 'nivel_grado',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='PeaNotaFinalSinInternet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nota_final', models.FloatField()),
                ('bandaprob', models.IntegerField(blank=True, null=True)),
                ('capacita', models.IntegerField(blank=True, null=True)),
                ('seleccionado', models.IntegerField(blank=True, null=True)),
                ('sw_titu', models.IntegerField(blank=True, null=True)),
                ('notacap', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'PERSONALNOTAFINAL_SININTERNET',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Personal',
            fields=[
                ('id_pea', models.AutoField(primary_key=True, serialize=False)),
                ('id_per', models.CharField(blank=True, max_length=8, null=True)),
                ('sexo', models.CharField(blank=True, max_length=1, null=True)),
                ('dni', models.CharField(blank=True, max_length=8, null=True)),
                ('ape_paterno', models.CharField(blank=True, max_length=100, null=True)),
                ('ape_materno', models.CharField(blank=True, max_length=100, null=True)),
                ('nombre', models.CharField(blank=True, max_length=100, null=True)),
                ('celular', models.CharField(blank=True, max_length=100, null=True)),
                ('id_convocatoriacargo', models.CharField(blank=True, max_length=4, null=True)),
                ('zona', models.CharField(blank=True, max_length=5, null=True)),
                ('contingencia', models.IntegerField(blank=True, null=True)),
                ('baja_estado', models.IntegerField(blank=True, default=0, null=True)),
                ('alta_estado', models.IntegerField(blank=True, default=0, null=True)),
                ('edad', models.IntegerField(blank=True, null=True)),
                ('correo', models.CharField(blank=True, max_length=100, null=True)),
                ('grado', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.NivelGrado')),
                ('id_cargofuncional', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.CargoFuncional')),
                ('id_pea_reemplazo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Personal')),
            ],
            options={
                'db_table': 'PERSONAL',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='PersonalAula',
            fields=[
                ('id_peaaula', models.AutoField(primary_key=True, serialize=False)),
                ('id_localambiente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.LocalAmbiente')),
                ('id_pea', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Personal')),
            ],
            options={
                'db_table': 'PersonalAula',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='PersonalAulaAsistencia',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('turno_manana', models.IntegerField(blank=True, null=True)),
                ('turno_tarde', models.IntegerField(blank=True, null=True)),
                ('fecha', models.CharField(max_length=50)),
                ('peaaula', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='personalaula', to='locales_consecucion.PersonalAula')),
            ],
            options={
                'db_table': 'PersonalAulaAsistencia',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='PersonalAulaNotaFinal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nota_final', models.FloatField()),
                ('bandaprob', models.IntegerField(blank=True, null=True)),
                ('capacita', models.IntegerField(blank=True, null=True)),
                ('seleccionado', models.IntegerField(blank=True, null=True)),
                ('sw_titu', models.IntegerField(blank=True, null=True)),
                ('notacap', models.FloatField(blank=True, null=True)),
                ('peaaula', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='personalaula_notafinal', to='locales_consecucion.PersonalAula')),
            ],
            options={
                'db_table': 'PersonalAulaNotaFinal',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='PersonalCursoCriterio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nota', models.FloatField(blank=True, null=True)),
                ('cursocriterio', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.CursoCriterio')),
                ('peaaula', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='personalaula_notas', to='locales_consecucion.PersonalAula')),
            ],
            options={
                'db_table': 'PeaCursoCriterio',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Profesion',
            fields=[
                ('codigo', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('detalle', models.CharField(blank=True, max_length=255, null=True)),
                ('estado', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'PROFESION',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='TipoResultadosCapacitacion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'TipoResultadoCapacitacion',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='UbigeoCursoMeta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('meta', models.IntegerField()),
                ('ubigeo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ubigeo.Ubigeo')),
            ],
        ),
        migrations.AddField(
            model_name='personal',
            name='profesion',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Profesion'),
        ),
        migrations.AddField(
            model_name='personal',
            name='tipo_inst',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Instituciones'),
        ),
        migrations.AddField(
            model_name='personal',
            name='ubigeo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ubigeo.Ubigeo'),
        ),
        migrations.AddField(
            model_name='peanotafinalsininternet',
            name='pea',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='personal_notafinal', to='locales_consecucion.Personal'),
        ),
        migrations.AddField(
            model_name='localambito',
            name='localcurso',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='localescurso', to='locales_consecucion.LocalCurso'),
        ),
        migrations.AddField(
            model_name='localambiente',
            name='localcurso',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.LocalCurso'),
        ),
        migrations.AddField(
            model_name='localambiente',
            name='pea',
            field=models.ManyToManyField(through='locales_consecucion.PersonalAula', to='locales_consecucion.Personal'),
        ),
        migrations.AddField(
            model_name='directoriolocalambiente',
            name='localcurso',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.DirectorioLocalCurso'),
        ),
        migrations.AddField(
            model_name='curso',
            name='criterios',
            field=models.ManyToManyField(through='locales_consecucion.CursoCriterio', to='locales_consecucion.Criterio'),
        ),
        migrations.AddField(
            model_name='curso',
            name='directoriolocales',
            field=models.ManyToManyField(through='locales_consecucion.DirectorioLocalCurso', to='locales_consecucion.DirectorioLocal'),
        ),
        migrations.AddField(
            model_name='curso',
            name='etapa',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Etapa'),
        ),
        migrations.AddField(
            model_name='curso',
            name='locales',
            field=models.ManyToManyField(through='locales_consecucion.LocalCurso', to='locales_consecucion.Local'),
        ),
        migrations.AlterUniqueTogether(
            name='localcurso',
            unique_together=set([('local', 'curso')]),
        ),
        migrations.AlterUniqueTogether(
            name='directoriolocalcurso',
            unique_together=set([('local', 'curso')]),
        ),
        migrations.AlterUniqueTogether(
            name='cursocriterio',
            unique_together=set([('curso', 'cursocriterio')]),
        ),
        migrations.AlterUniqueTogether(
            name='cursocargofuncional',
            unique_together=set([('id_cargofuncional', 'id_curso')]),
        ),
    ]
